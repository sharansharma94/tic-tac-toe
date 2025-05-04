-- Create the profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name TEXT,
  online BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security (RLS) on the profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public reads
CREATE POLICY "Public read access" ON profiles
FOR SELECT USING (true);

-- Policy: Allow only the owner to update their profile
CREATE POLICY "Owner can update" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- Policy: Allow only the owner to insert their profile
CREATE POLICY "Owner can insert" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);