import OpenAI from 'openai';
import { getContextEntries, getPostHistory } from './data';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

export async function generatePost(
  prompt: string,
  options: {
    includeContext?: boolean;
    includeHistory?: boolean;
    platforms?: string[];
  } = {}
): Promise<string> {
  const { includeContext = true, includeHistory = true, platforms = [] } = options;

  let systemPrompt = `You are a professional social media content creator. Create engaging, authentic posts that resonate with the target audience.

Guidelines:
- Write in a conversational, professional tone
- Keep posts concise and impactful
- Include relevant hashtags when appropriate
- Avoid overly promotional language
- Make content shareable and engaging`;

  if (platforms.length > 0) {
    systemPrompt += `\n\nTarget platforms: ${platforms.join(', ')}. Adapt the tone and format accordingly.`;
  }

  let contextSection = '';

  if (includeContext) {
    const contextEntries = await getContextEntries();
    if (contextEntries.length > 0) {
      contextSection += '\n\n<business_context>\n';
      for (const entry of contextEntries) {
        contextSection += `<${entry.type} title="${entry.title}">\n${entry.content}\n</${entry.type}>\n`;
      }
      contextSection += '</business_context>';
    }
  }

  if (includeHistory) {
    const history = await getPostHistory();
    const recentPosts = history.slice(0, 10);
    if (recentPosts.length > 0) {
      contextSection += '\n\n<recent_posts>\n';
      for (const post of recentPosts) {
        contextSection += `<post platform="${post.platform}" date="${post.postedAt}">\n${post.abbreviatedContent}\n</post>\n`;
      }
      contextSection += '</recent_posts>\n\nAvoid repeating similar content to recent posts. Maintain variety and freshness.';
    }
  }

  const userMessage = contextSection
    ? `${contextSection}\n\n<request>\n${prompt}\n</request>`
    : prompt;

  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  return response.choices[0]?.message?.content || '';
}

export async function summarizePostForHistory(content: string, platform: string): Promise<string> {
  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      {
        role: 'system',
        content: `You are a content summarizer. Create a very brief summary (max 50 words) of a social media post that captures the key topic/theme. This summary will be used to give context to future post generation to avoid repetition.

Output only the summary, no quotes or prefixes.`,
      },
      {
        role: 'user',
        content: `<platform>${platform}</platform>\n<post>\n${content}\n</post>`,
      },
    ],
    temperature: 0.3,
    max_tokens: 100,
  });

  return response.choices[0]?.message?.content?.trim() || content.substring(0, 100);
}
