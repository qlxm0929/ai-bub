import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const SYSTEM_PROMPT = `
You are an expert React and Tailwind CSS developer.
The user will describe a UI component they want to build.
Your task is to write a single React functional component that implements the user's request.
Use Tailwind CSS classes for styling. Tailwind CSS is already loaded — just use className with Tailwind utilities directly.
Do NOT use any external libraries other than React and 'lucide-react' for icons.
Do NOT use TypeScript types, interfaces, or generics — write plain JavaScript (JSX).
Return ONLY the raw code inside a \`\`\`jsx code block. Do not include any explanations.
The component MUST be exported as the default export and named App.
Make the design look modern, beautiful, and dynamic.

IMAGE RULES (very important):
- Never use unsplash.com, pexels.com, picsum.photos, or any random external image URLs — they will be blocked in the sandbox.
- For placeholder images, ALWAYS use this format: https://placehold.co/WIDTHxHEIGHT/BGCOLOR/TEXTCOLOR?text=Label
  Examples:
    https://placehold.co/400x300/1e293b/94a3b8?text=Product
    https://placehold.co/80x80/6366f1/ffffff?text=User
    https://placehold.co/600x400/0f172a/22d3ee?text=Banner
- For avatars, use: https://placehold.co/64x64/7c3aed/ffffff?text=AB (initials)
- For icons/decoration, prefer lucide-react components or CSS/SVG shapes instead of <img> tags.

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

// Fallback model list — tried in order if previous model is unavailable
const MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
];

export async function POST(req: NextRequest) {
  try {
    const { prompt, apiKey: userApiKey } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // 사용자 키 우선, 없으면 서버 키 사용
    const resolvedKey = userApiKey?.trim() || process.env.GEMINI_API_KEY;

    if (!resolvedKey) {
      return NextResponse.json(
        { error: 'API 키가 없습니다. 사이드바에서 Gemini API 키를 설정해주세요.' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: resolvedKey });

    let lastError: any = null;

    for (const model of MODELS) {
      try {
        console.log(`[generate-ui] Trying model: ${model}`);
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.2,
          }
        });

        // response.text 는 getter — 일부 모델(2.5-flash thinking mode)에서 undefined 반환 가능
        // candidates → parts → text 를 직접 추출하는 방어 코드 추가
        let code: string =
          response.text ??
          (response as any)?.candidates?.[0]?.content?.parts
            ?.map((p: any) => p.text ?? '')
            .join('') ??
          '';

        console.log(`[generate-ui] response.text length: ${code.length}, preview: ${code.slice(0, 80)}`);

        if (!code.trim()) {
          console.warn(`[generate-ui] Empty response from model ${model}, trying next`);
          lastError = new Error('Empty response from model');
          continue;
        }

        // Extract code from markdown block if present
        const match = code.match(/```tsx([\s\S]*?)```/) || code.match(/```jsx([\s\S]*?)```/) || code.match(/```([\s\S]*?)```/);
        if (match && match[1]) {
          code = match[1].trim();
        } else {
          code = code.trim();
        }

        if (!code) {
          lastError = new Error('Could not extract code from response');
          continue;
        }

        console.log(`[generate-ui] Success with model: ${model}, code length: ${code.length}`);
        return NextResponse.json({ code, model });

      } catch (err: any) {
        const status = err?.status ?? err?.code ?? 0;
        const isRetryable = status === 503 || status === 429 || String(err?.message).includes('UNAVAILABLE') || String(err?.message).includes('quota');
        console.warn(`[generate-ui] Model ${model} failed (${status}): ${err?.message}`);
        lastError = err;

        if (!isRetryable) {
          // Non-retryable error — don't try other models
          break;
        }
        // Retryable: try next model in list
      }
    }

    const msg = lastError?.message || 'All models are currently unavailable. Please try again later.';
    return NextResponse.json({ error: msg }, { status: 503 });

  } catch (error: any) {
    console.error('Error generating UI:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate UI' }, { status: 500 });
  }
}
