import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { onboardingData } = await request.json();

    if (!onboardingData) {
      return NextResponse.json(
        { error: 'Onboarding data is required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
Based on the following onboarding responses, generate a detailed character profile for a user in the Oneness Kingdom community. 
Please respond with a JSON object containing the following structure:
{
  "personality": "A detailed description of their personality type",
  "strengths": ["list", "of", "key", "strengths"],
  "growth_areas": ["areas", "for", "personal", "growth"],
  "ideal_role": "Their ideal role or contribution to the community",
  "communication_style": "How they prefer to communicate and interact",
  "values": ["core", "values", "that", "drive", "them"],
  "motivations": "What motivates and inspires them",
  "summary": "A brief summary of their character archetype"
}

Onboarding Data:
- Relationship Status: ${onboardingData.relationship_status}
- Location: ${onboardingData.location}
- Good Traits: ${onboardingData.good_traits.join(', ')}
- Bad Traits: ${onboardingData.bad_traits.join(', ')}
- Weekend Social: ${onboardingData.social_weekend}
- Recharge Method: ${onboardingData.social_recharge}
- Vacation Type: ${onboardingData.vacation_type}
- Vacation Activity: ${onboardingData.vacation_activity}
- Planning Style: ${onboardingData.planning_style}
- Planning Preference: ${onboardingData.planning_preference}
- Hobby Interest: ${onboardingData.hobby_interest}
- Hobby Activity: ${onboardingData.hobby_activity}
- Life Outlook: ${onboardingData.outlook}

Please generate a thoughtful, positive, and insightful character profile that would help them understand themselves better and how they can contribute to the Oneness Kingdom community.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from Gemini response');
    }

    const profile = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error generating character profile:', error);
    return NextResponse.json(
      { error: 'Failed to generate character profile' },
      { status: 500 }
    );
  }
}
