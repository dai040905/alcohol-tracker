-- Create a table for user profiles
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  gender text check (gender in ('male', 'female')) not null,
  weight_kg float not null,
  updated_at timestamptz default now()
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

-- Create policy to allow users to see only their own profile
create policy "Users can see their own profile"
  on profiles for select
  using ( auth.uid() = id );

-- Create policy to allow users to insert their own profile
create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

-- Create policy to allow users to update their own profile
create policy "Users can update their own profile"
  on profiles for update
  using ( auth.uid() = id );
