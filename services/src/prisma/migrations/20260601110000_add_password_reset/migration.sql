-- NOTE: Ensure the "pgcrypto" extension is enabled in Postgres because
-- the migration uses gen_random_uuid(). Run this manually if needed:
--   CREATE EXTENSION pgcrypto;

CREATE TABLE password_resets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NULL,
  email varchar(255) NOT NULL,
  code_hash varchar(255) NOT NULL,
  token_hash varchar(255),
  expires_at timestamptz NOT NULL,
  used_at timestamptz NULL,
  attempts integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_password_resets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_password_resets_email ON password_resets(email);
CREATE INDEX idx_password_resets_user_id ON password_resets(user_id);
