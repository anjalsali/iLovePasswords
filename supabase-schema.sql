-- Create the user_master_passwords table for storing master password hashes
CREATE TABLE user_master_passwords (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create an index on user_id for faster queries
CREATE INDEX idx_user_master_passwords_user_id ON user_master_passwords(user_id);

-- Enable Row Level Security (RLS) for master passwords
ALTER TABLE user_master_passwords ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only access their own master password
CREATE POLICY "Users can only access their own master password" ON user_master_passwords
    FOR ALL USING (auth.uid() = user_id);

-- Create the vault_entries table for storing encrypted passwords
CREATE TABLE vault_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    username TEXT,
    url TEXT,
    category TEXT NOT NULL DEFAULT 'Other' CHECK (category IN ('Social Media', 'Email', 'Work', 'Banking', 'Shopping', 'Entertainment', 'Utilities', 'Other')),
    encrypted_password TEXT NOT NULL,
    salt TEXT NOT NULL,
    iv TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create an index on user_id for faster queries
CREATE INDEX idx_vault_entries_user_id ON vault_entries(user_id);

-- Create an index on created_at for sorting
CREATE INDEX idx_vault_entries_created_at ON vault_entries(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE vault_entries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only access their own entries
CREATE POLICY "Users can only access their own vault entries" ON vault_entries
    FOR ALL USING (auth.uid() = user_id);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vault_entries_updated_at
    BEFORE UPDATE ON vault_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_master_passwords_updated_at
    BEFORE UPDATE ON user_master_passwords
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
