/*
  # Create groups and memberships tables

  1. New Tables
    - `groups`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `topics` (text[])
      - `max_members` (integer)
      - `image_url` (text)
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamp)

    - `group_members`
      - `id` (uuid, primary key)
      - `group_id` (uuid, references groups)
      - `user_id` (uuid, references auth.users)
      - `role` (text)
      - `joined_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create groups table
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  topics text[] NOT NULL,
  max_members integer NOT NULL,
  image_url text NOT NULL,
  created_by uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT max_members_positive CHECK (max_members > 0)
);

-- Create group members table
CREATE TABLE IF NOT EXISTS group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  role text NOT NULL DEFAULT 'member',
  joined_at timestamptz DEFAULT now(),
  CONSTRAINT valid_role CHECK (role IN ('admin', 'member')),
  UNIQUE(group_id, user_id)
);

-- Enable RLS
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- Groups policies
CREATE POLICY "Anyone can view groups"
  ON groups FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create groups"
  ON groups FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group admins can update groups"
  ON groups FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_id = groups.id 
      AND user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Group members policies
CREATE POLICY "Anyone can view group members"
  ON group_members FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can join groups"
  ON group_members FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    (
      SELECT count(*) FROM group_members WHERE group_id = group_members.group_id
    ) < (
      SELECT max_members FROM groups WHERE id = group_members.group_id
    )
  );

CREATE POLICY "Admins can manage group members"
  ON group_members FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_id = group_members.group_id 
      AND user_id = auth.uid() 
      AND role = 'admin'
    ) OR auth.uid() = user_id
  );