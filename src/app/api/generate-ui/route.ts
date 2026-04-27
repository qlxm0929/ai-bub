import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `
You are an expert React and Tailwind CSS developer.
The user will describe a UI component they want to build.
Your task is to write a single React functional component that implements the user's request.
Use Tailwind CSS classes for styling.
Do NOT use any external libraries other than React and 'lucide-react' for icons.
Return ONLY the raw code inside a \`\`\`tsx code block. Do not include any explanations.
The component MUST be exported as the default export.
Make the design look modern, beautiful, and dynamic.

Example structure:
\`\`\`tsx
import React from 'react';
import { Settings } from 'lucide-react';

export default function App() {
  return (
    <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-3">
        <Settings className="w-6 h-6 text-blue-500" />
        <h1 className="text-xl font-bold text-gray-800">Example</h1>
      </div>
    </div>
  );
}
\`\`\`
`;

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured in .env.local' }, { status: 500 });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.2,
      }
    });

    let code = response.text || '';
    
    // Extract code from markdown block if present
    const match = code.match(/```tsx([\s\S]*?)```/) || code.match(/```jsx([\s\S]*?)```/) || code.match(/```([\s\S]*?)```/);
    if (match && match[1]) {
      code = match[1].trim();
    } else {
      code = code.trim();
    }

    return NextResponse.json({ code });
  } catch (error: any) {
    console.error('Error generating UI:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate UI' }, { status: 500 });
  }
}
