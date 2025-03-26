/*
  # Add group messages and shared files tables

  1. New Tables
    - `group_messages`
      - `id` (uuid, primary key)
      - `group_id` (uuid, references groups)
      - `user_id` (uuid, references auth.users)
      - `message` (text)
      - `created_at` (timestamp)

    - `group_shared_files`
      - `id` (uuid, primary key)
      - `group_id` (uuid, references groups)
      - `product_id` (uuid, references products)
      - `shared_by` (uuid, references auth.users)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for group members
*/

-- Create group messages table
CREATE TABLE IF NOT EXISTS group_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create group shared files table
CREATE TABLE IF NOT EXISTS group_shared_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  shared_by uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(group_id, product_id)
);

-- Enable RLS
ALTER TABLE group_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_shared_files ENABLE ROW LEVEL SECURITY;

-- Group messages policies
CREATE POLICY "Group members can view messages"
ON group_messages FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM group_members
    WHERE group_members.group_id = group_messages.group_id
    AND group_members.user_id = auth.uid()
  )
);

CREATE POLICY "Group members can send messages"
ON group_messages FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM group_members
    WHERE group_members.group_id = group_messages.group_id
    AND group_members.user_id = auth.uid()
  )
);

-- Group shared files policies
CREATE POLICY "Group members can view shared files"
ON group_shared_files FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM group_members
    WHERE group_members.group_id = group_shared_files.group_id
    AND group_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can share their purchased files"
ON group_shared_files FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM group_members
    WHERE group_members.group_id = group_shared_files.group_id
    AND group_members.user_id = auth.uid()
  ) AND
  EXISTS (
    SELECT 1 FROM purchases
    WHERE purchases.product_id = group_shared_files.product_id
    AND purchases.user_id = auth.uid()
  )
);