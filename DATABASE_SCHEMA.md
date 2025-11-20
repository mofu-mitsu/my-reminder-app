# Database Schema

## Pets Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users table |
| type | TEXT | Type of pet (dog, cat, bird) |
| name | TEXT | Name of the pet |
| mbti_params | JSONB | Personality parameters |
| growth_points | INTEGER | Points earned by completing reminders |
| learning_logs | JSONB | Logs of user interactions for AI learning |
| accessories | JSONB | List of accessories the pet has |

## Reminders Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users table |
| title | TEXT | Title of the reminder |
| category | TEXT | Category of the reminder (water, medicine, shopping, etc.) |
| due_time | TIMESTAMP | When the reminder is due |
| achieved | BOOLEAN | Whether the reminder has been completed |

## Supabase Setup

1. Create a new Supabase project
2. Create the tables using the SQL below:

```sql
-- Create pets table
CREATE TABLE pets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  mbti_params JSONB DEFAULT '{}',
  growth_points INTEGER DEFAULT 0,
  learning_logs JSONB DEFAULT '[]',
  accessories JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create reminders table
CREATE TABLE reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  due_time TIMESTAMP NOT NULL,
  achieved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own pets" ON pets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pets" ON pets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pets" ON pets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own reminders" ON reminders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reminders" ON reminders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders" ON reminders
  FOR UPDATE USING (auth.uid() = user_id);
```