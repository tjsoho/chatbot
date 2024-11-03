import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface BotConfig {
  botName: string;
  businessName: string;
  businessBackground: string;
  botGoal: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  fallbackResponse: string;
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // Fetch bot config using the same path as ChatWindow
    const configRef = doc(db, 'botConfig', 'settings');
    const configSnap = await getDoc(configRef);

    if (!configSnap.exists()) {
      console.error('Bot config not found');
      return NextResponse.json({ error: 'Bot configuration not found' }, { status: 404 });
    }

    const botConfig = configSnap.data() as BotConfig;

    const systemPrompt = `You are ${botConfig.botName}, an AI assistant for ${botConfig.businessName}.

1. Response Strategy:
- CRITICAL: Limit ALL responses to 1-3 sentences maximum
- Never provide detailed explanations in a single message
- Always break information into smaller chunks
- Wait for user to request more information before continuing
- If asked how to sign up, tell users to process and then highlight the Get Started Button in the menu bar on our site.

2. Communication Guidelines:
- MUST keep responses under 30 words
- Use simple, everyday language
- If response would be longer than 30 words, stop and ask if user wants more details
- When asked about sloane, tell users what sloane does and then always highlight our hubs feature and one-one-one sign up with our business experts.


3. Business Information:
${botConfig.businessBackground}

4. Key Knowledge Base:
${botConfig.faqs.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n')}

5. Core Objectives:
${botConfig.botGoal}

Remember to:
1. Keep responses short and focused
2. Never provide more than 2 sentences in a single response
3. Maintain a friendly, conversational tone aligned with ${botConfig.businessName}'s values`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
    });

    return NextResponse.json({ 
      message: completion.choices[0]?.message?.content || botConfig.fallbackResponse 
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to process chat message' }, { status: 500 });
  }
} 