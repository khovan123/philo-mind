-- Add soft delete support for users
ALTER TABLE users
  ADD COLUMN deleted_at timestamptz NULL,
  ADD COLUMN deletion_requested_at timestamptz NULL;
