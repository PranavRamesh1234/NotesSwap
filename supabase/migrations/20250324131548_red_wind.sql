/*
  # Add storage policies for notes bucket

  1. Storage Policies
    - Enable authenticated users to upload files to their own folder
    - Allow public access to read files
    - Restrict file types to PDFs
    - Set maximum file size to 10MB
*/

-- Create storage policy for uploads
DO $$
BEGIN
    -- Create bucket if it doesn't exist
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('notes', 'notes', true)
    ON CONFLICT (id) DO NOTHING;

    -- Allow authenticated users to upload files to their own folder
    CREATE POLICY "Users can upload files to their own folder"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'notes' AND
        (SPLIT_PART(name, '/', 1) = auth.uid()::text) AND
        (LENGTH(DECODE(SUBSTRING(name FROM '%#"__data__#"___"([^"]*)"#"%' FOR '#'), 'base64')) < 10485760) AND
        (LOWER(SUBSTRING(name FROM '\.([^\.]*$)')) = 'pdf')
    );

    -- Allow authenticated users to update their own files
    CREATE POLICY "Users can update their own files"
    ON storage.objects FOR UPDATE TO authenticated
    USING (
        bucket_id = 'notes' AND
        (SPLIT_PART(name, '/', 1) = auth.uid()::text)
    );

    -- Allow authenticated users to delete their own files
    CREATE POLICY "Users can delete their own files"
    ON storage.objects FOR DELETE TO authenticated
    USING (
        bucket_id = 'notes' AND
        (SPLIT_PART(name, '/', 1) = auth.uid()::text)
    );

    -- Allow public access to read files
    CREATE POLICY "Public can read all files"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'notes');

EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END $$;