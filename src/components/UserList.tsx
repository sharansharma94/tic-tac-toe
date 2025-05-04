import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Users, UserCheck2 } from 'lucide-react';

interface User {
  id: string;
  full_name: string;
  online: boolean;
}

interface UserListProps {
  currentUserId: string;
  onUserSelect: (userId: string, userName: string) => void;
}

const UserList: React.FC<UserListProps> = ({ currentUserId, onUserSelect }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', currentUserId); // Exclude the current user

        if (error) throw error;

        const formattedUsers = data.map(user => ({
          id: user.id,
          full_name: user.full_name || 'Anonymous',
          online: user.online || false,
        }));

        setUsers(formattedUsers);
      } catch (err) {
        setError('Failed to load users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    // Subscribe to presence changes
    const presenceChannel = supabase.channel('online-users');
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        // Handle presence sync
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        setUsers(prev =>
          prev.map(user =>
            user.id === key ? { ...user, online: true } : user
          )
        );
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        setUsers(prev =>
          prev.map(user =>
            user.id === key ? { ...user, online: false } : user
          )
        );
      })
      .subscribe();

    return () => {
      presenceChannel.unsubscribe();
    };
  }, [currentUserId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
      <div className="flex items-center gap-2 mb-6">
        <Users className="text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">Available Players</h2>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {users.map(user => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${user.online ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="font-medium text-gray-700">{user.full_name}</span>
              </div>
              <button
                onClick={() => onUserSelect(user.id, user.full_name)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                <UserCheck2 size={16} />
                <span>Invite</span>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {users.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No other players available
          </p>
        )}
      </div>
    </div>
  );
};

export default UserList;