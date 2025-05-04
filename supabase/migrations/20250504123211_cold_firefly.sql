/*
  # Create game sessions table

  1. New Tables
    - `game_sessions`
      - `id` (uuid, primary key)
      - `player1_id` (uuid, references auth.users)
      - `player2_id` (uuid, references auth.users)
      - `winner_id` (uuid, references auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `game_state` (jsonb)

  2. Security
    - Enable RLS on `game_sessions` table
    - Add policies for authenticated users to:
      - Read their own game sessions
      - Create new game sessions
      - Update game sessions they're part of
*/

CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player1_id uuid REFERENCES auth.users NOT NULL,
  player2_id uuid REFERENCES auth.users,
  winner_id uuid REFERENCES auth.users,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  game_state jsonb NOT NULL DEFAULT '{}'::jsonb
);

ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE policyname = 'Users can read their own game sessions'
      AND tablename = 'game_sessions'
  ) THEN
    CREATE POLICY "Users can read their own game sessions"
      ON game_sessions
      FOR SELECT
      TO authenticated
      USING (
        auth.uid() = player1_id OR 
        auth.uid() = player2_id
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE policyname = 'Users can create game sessions'
      AND tablename = 'game_sessions'
  ) THEN
    CREATE POLICY "Users can create game sessions"
      ON game_sessions
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = player1_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE policyname = 'Users can update their game sessions'
      AND tablename = 'game_sessions'
  ) THEN
    CREATE POLICY "Users can update their game sessions"
      ON game_sessions
      FOR UPDATE
      TO authenticated
      USING (
        auth.uid() = player1_id OR 
        auth.uid() = player2_id
      )
      WITH CHECK (
        auth.uid() = player1_id OR 
        auth.uid() = player2_id
      );
  END IF;
END $$;