-- Add onboarding_completed to profiles if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Create onboarding_responses table
CREATE TABLE IF NOT EXISTS onboarding_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  relationship_status TEXT,
  location TEXT,
  good_traits TEXT[],
  bad_traits TEXT[],
  social_weekend TEXT,
  social_recharge TEXT,
  vacation_type TEXT,
  vacation_activity TEXT,
  planning_style TEXT,
  planning_preference TEXT,
  hobby_interest TEXT,
  hobby_activity TEXT,
  outlook TEXT,
  generated_character_profile TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own onboarding responses" 
  ON onboarding_responses FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding responses" 
  ON onboarding_responses FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding responses" 
  ON onboarding_responses FOR UPDATE 
  USING (auth.uid() = user_id);
