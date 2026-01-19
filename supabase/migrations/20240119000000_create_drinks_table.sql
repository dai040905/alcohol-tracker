-- Create a table for drinking records
create table drinks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  alcohol_type text not null,
  volume_cc float not null,
  abv float not null,
  created_at timestamptz default now()
);

-- Set up Row Level Security (RLS)
-- Enable RLS on the table
alter table drinks enable row level security;

-- Create policy to allow users to see only their own drinks
create policy "Users can see their own drinks"
  on drinks for select
  using ( auth.uid() = user_id );

-- Create policy to allow users to insert their own drinks
create policy "Users can insert their own drinks"
  on drinks for insert
  with check ( auth.uid() = user_id );

-- Create policy to allow users to update their own drinks
create policy "Users can update their own drinks"
  on drinks for update
  using ( auth.uid() = user_id );

-- Create policy to allow users to delete their own drinks
create policy "Users can delete their own drinks"
  on drinks for delete
  using ( auth.uid() = user_id );
