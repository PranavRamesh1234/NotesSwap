/*
  # Simplify storage policies for notes bucket

  1. Storage Policies
    - Create notes bucket if it doesn't exist
    - Basic RLS policies for CRUD operations
    - Move file validation to client side
*/

-- Drop existing policies if they exist
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can upload files to their own folder" ON storage.objects;
    DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
    DROP POLICY IF EXISTS "Public can read all files" ON storage.objects;
EXCEPTION
    WHEN undefined_object THEN
        NULL;
END $$;

-- Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('notes', 'notes', true)
ON CONFLICT (id) DO NOTHING;

-- Simple policies without complex validation
CREATE POLICY "Users can upload files to their own folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'notes' AND
    auth.uid()::text = (SPLIT_PART(name, '/', 1))
);

CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE TO authenticated
USING (
    bucket_id = 'notes' AND
    auth.uid()::text = (SPLIT_PART(name, '/', 1))
);

CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE TO authenticated
USING (
    bucket_id = 'notes' AND
    auth.uid()::text = (SPLIT_PART(name, '/', 1))
);

CREATE POLICY "Public can read all files"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'notes');