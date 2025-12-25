import { supabase } from './supabase';

export interface CharacterProfile {
  personality: string;
  strengths: string[];
  growth_areas: string[];
  ideal_role: string;
  communication_style: string;
  values: string[];
  motivations: string;
  summary: string;
}

export async function generateCharacterProfile(onboardingData: any): Promise<CharacterProfile> {
  try {
    const response = await fetch('/api/gemini/generate-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ onboardingData }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate character profile');
    }

    const result = await response.json();
    return result.profile;
  } catch (error) {
    console.error('Error generating character profile:', error);
    throw error;
  }
}

export async function saveCharacterProfile(userId: string, profile: CharacterProfile): Promise<void> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        character_profile: profile,
        onboarding_completed: true,
      })
      .eq('id', userId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error saving character profile:', error);
    throw error;
  }
}