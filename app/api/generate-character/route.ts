import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { 
      good_traits, 
      bad_traits, 
      hobby_interest, 
      hobby_activity, 
      outlook,
      location 
    } = body;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
      You are a creative character designer. Based on the following user personality traits, 
      create a "Kawaii" (cute) character profile that represents them in a fantasy or slice-of-life setting.
      
      User Traits:
      - Good Traits: ${good_traits.join(', ')}
      - "Charming Flaws": ${bad_traits.join(', ')}
      - Interests: ${hobby_interest}, ${hobby_activity}
      - Outlook: ${outlook}
      - Location: ${location}

      Please generate:
      1. A cute character name (Japanese & English).
      2. A short bio/backstory (max 3 sentences).
      3. A "Special Ability" based on their traits.
      4. A visual description of their appearance (chibi style).
      
      Output the result in JSON format with keys: name_jp, name_en, bio, ability, appearance.
      Ensure the tone is warm, encouraging, and whimsical.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Attempt to parse JSON from the response (in case Gemini wraps it in markdown blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : text;
    
    let characterProfile;
    try {
        characterProfile = JSON.parse(jsonString);
    } catch (e) {
        // Fallback if JSON parsing fails
        characterProfile = { bio: text };
    }

    return NextResponse.json(characterProfile);
  } catch (error) {
    console.error('Error generating character:', error);
    return NextResponse.json(
      { error: 'Failed to generate character' },
      { status: 500 }
    );
  }
}
