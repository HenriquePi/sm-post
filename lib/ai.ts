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
- Make content shareable and engaging
- IMPORTANT: When including URLs, write them as plain text (e.g., "voxelquote.com" or "https://voxelquote.com"). DO NOT use markdown link format like [text](url).`;

  if (platforms.length > 0) {
    systemPrompt += `\n\nTarget platforms: ${platforms.join(', ')}. Adapt the tone and format accordingly.`;
    
    if (platforms.includes('linkedin')) {
      systemPrompt += `\n\nLinkedIn-specific guidelines:
- Professional and thought-leadership focused
- Longer form content (1300-3000 characters works well)
- Use line breaks for readability
- Include 3-5 relevant hashtags at the end
- Encourage professional discussion and engagement
- URLs should be plain text (not markdown links)`;
    }
    
    if (platforms.includes('facebook')) {
      systemPrompt += `\n\nFacebook-specific guidelines:
- Conversational and community-focused
- Shorter, more casual content (40-80 words is optimal)
- Use emojis sparingly but effectively
- Ask questions to encourage comments
- Include 1-3 relevant hashtags
- URLs should be plain text (not markdown links)`;
    }
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
