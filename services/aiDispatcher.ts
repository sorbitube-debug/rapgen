
import { generateRapLyrics as generateWithGemini, regenerateRapLines as regenerateWithGemini } from './gemini';
import { AIConfig, LyricResponse, RapStyle, RapTone, RhymeComplexity, RapLength, RhymeScheme, StructureRule, SingerGender } from '../types';

const PROVIDER_DEFAULTS: Record<string, { baseUrl: string, modelId: string }> = {
  openai: { baseUrl: 'https://api.openai.com/v1/chat/completions', modelId: 'gpt-4o' },
  deepseek: { baseUrl: 'https://api.deepseek.com/v1/chat/completions', modelId: 'deepseek-chat' },
  grok: { baseUrl: 'https://api.x.ai/v1/chat/completions', modelId: 'grok-1' },
  openrouter: { baseUrl: 'https://openrouter.ai/api/v1/chat/completions', modelId: 'meta-llama/llama-3-70b-instruct' },
  huggingface: { baseUrl: 'https://api-inference.huggingface.co/models/', modelId: 'mistralai/Mistral-7B-Instruct-v0.2' },
  ollama: { baseUrl: 'http://localhost:11434/v1/chat/completions', modelId: 'llama3' },
  suno: { baseUrl: '', modelId: 'suno-v3' }
};

/**
 * Validates the provided AI configuration by attempting a lightweight API call.
 */
export const validateAIConfig = async (config: AIConfig): Promise<{ success: boolean; message: string }> => {
  if (config.provider === 'gemini') return { success: true, message: 'Gemini is pre-configured.' };
  
  let endpoint = config.baseUrl || PROVIDER_DEFAULTS[config.provider]?.baseUrl || '';
  if (!endpoint) return { success: false, message: 'آدرس API یافت نشد.' };

  // Convert chat/completions endpoint to models endpoint for validation if it looks like standard OpenAI
  let testEndpoint = endpoint.replace('/chat/completions', '/models');
  if (config.provider === 'huggingface') {
    testEndpoint = `https://api-inference.huggingface.co/models/${config.modelId}`;
  }

  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (config.apiKey) headers['Authorization'] = `Bearer ${config.apiKey}`;

    const response = await fetch(testEndpoint, {
      method: config.provider === 'huggingface' ? 'GET' : 'GET',
      headers
    });

    if (response.ok) {
      return { success: true, message: 'اتصال برقرار شد و کلید معتبر است.' };
    } else {
      const errorData = await response.json().catch(() => ({}));
      return { 
        success: false, 
        message: errorData.error?.message || `خطای API: ${response.status} ${response.statusText}` 
      };
    }
  } catch (err: any) {
    return { success: false, message: `خطا در برقراری ارتباط: ${err.message}` };
  }
};

export const dispatchRapLyrics = async (
  config: AIConfig,
  params: {
    topic: string,
    style: RapStyle,
    tone: RapTone,
    rhymeComplexity: RhymeComplexity,
    subStyle: string,
    length: RapLength,
    keywords: string,
    creativity: number,
    topK: number,
    topP: number,
    rhymeScheme: RhymeScheme,
    useThinking: boolean,
    targetBpm: number,
    flowSpeed: string,
    stressLevel: string,
    rhythmicVariety: string,
    singerGender: SingerGender,
    drumPattern?: Record<string, boolean[]>,
    beatAudio?: { name: string, data: string, mimeType: string } | null,
    structureRules?: StructureRule[],
    additionalNotes?: string
  }
): Promise<LyricResponse> => {
  
  if (config.provider === 'gemini') {
    return generateWithGemini(
      params.topic, params.style, params.tone, params.rhymeComplexity, params.subStyle,
      params.length, params.keywords, params.creativity, params.topK, params.topP,
      params.rhymeScheme, params.useThinking, params.targetBpm, params.flowSpeed,
      params.stressLevel, params.rhythmicVariety, params.singerGender, params.drumPattern, params.beatAudio, params.structureRules, params.additionalNotes
    );
  }

  // Determine endpoint
  let endpoint = config.baseUrl || PROVIDER_DEFAULTS[config.provider]?.baseUrl || '';
  
  // Special handling for Hugging Face Inference API
  if (config.provider === 'huggingface') {
    endpoint = `${endpoint}${config.modelId}`;
  }

  if (!endpoint) throw new Error("آدرس API برای این سرویس‌دهنده تنظیم نشده است.");

  const apiKey = config.apiKey || "";
  
  const systemInstruction = `
    شما "RapGen Pro Engine" هستید. یک مدل پیشرفته متخصص در مهندسی لیریک رپ فارسی.
    تخصص شما شامل: وزن عروضی مدرن، قافیه‌های چندسیلابی و تکنیک‌های فلو (Flow).
    جنسیت خواننده: ${params.singerGender === SingerGender.Male ? 'مرد' : 'زن'}. لطفاً لیریک را بر اساس لحن و رویکرد مناسب این جنسیت تولید کنید.
    محدودیت ساختاری: هرگز بخش‌های Intro (مقدمه) و Outro (پایانی) را در متن لیریک قرار ندهید. لیریک فقط باید شامل بخش‌های اصلی مانند Verse، Chorus و Bridge باشد.
    خروجی باید صرفاً یک JSON معتبر شامل فیلدهای title، content و aiAnalysis باشد.
  `;

  const userPrompt = `
    تولید لیریک رپ حرفه‌ای فارسی برای یک خواننده ${params.singerGender === SingerGender.Male ? 'مرد' : 'زن'}.
    موضوع: ${params.topic}
    ${params.additionalNotes ? `نکات اختصاصی کاربر: ${params.additionalNotes}` : ''}
    سبک: ${params.style} (${params.subStyle})
    لحن: ${params.tone}
    سرعت: ${params.flowSpeed}
    الگوی قافیه: ${params.rhymeScheme}
    BPM پیشنهادی: ${params.targetBpm}
    کلمات کلیدی: ${params.keywords}
  `;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  // Prepare body
  const body: any = {
    model: config.modelId,
    messages: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: userPrompt }
    ],
    temperature: params.creativity
  };

  // Some providers like OpenAI/DeepSeek support json_object mode
  if (['openai', 'deepseek', 'grok', 'openrouter'].includes(config.provider)) {
    body.response_format = { type: "json_object" };
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`AI Provider Error: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  
  // Hugging Face and some others return differently
  const content = config.provider === 'huggingface'
    ? data[0]?.generated_text
    : data.choices?.[0]?.message?.content;

  if (content == null || content === '') {
    throw new Error('خروجی خالی از سرویس AI دریافت شد.');
  }

  try {
    const result = JSON.parse(content);
    return {
      title: result.title || "بدون عنوان",
      content: result.content || "",
      aiAnalysis: result.aiAnalysis || "آنالیز توسط این موتور پشتیبانی نمی‌شود.",
      variant: 'Standard_Flow_v1',
      suggestedBpm: params.targetBpm
    };
  } catch (e) {
    // If it's not JSON, try to extract parts or return as is
    return {
      title: params.topic,
      content: content,
      aiAnalysis: "خطا در پارس خروجی JSON. متن خام نمایش داده می‌شود.",
      variant: 'Standard_Flow_v1',
      suggestedBpm: params.targetBpm
    };
  }
};

export const dispatchRegenerateLines = async (
    config: AIConfig,
    fullContent: string, 
    lineIndices: number[], 
    style: string, 
    topic: string, 
    instruction: string
): Promise<string> => {
    if (config.provider === 'gemini') {
        return regenerateWithGemini(fullContent, lineIndices, style, topic, instruction);
    }

    const endpoint = config.baseUrl || PROVIDER_DEFAULTS[config.provider]?.baseUrl || '';
    if (!endpoint) return fullContent;

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (config.apiKey) headers['Authorization'] = `Bearer ${config.apiKey}`;

    const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            model: config.modelId,
            messages: [
                { role: 'system', content: "شما یک ویراستار متخصص لیریک رپ هستید. فقط متن نهایی لیریک را بدون هیچ توضیحی برگردانید." },
                { role: 'user', content: `در لیریک زیر، خطوط شماره ${lineIndices.join(',')} را بر اساس این دستور بازنویسی کن: "${instruction}"\n\nمتن:\n${fullContent}` }
            ]
        })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        const errMsg = (data as { error?: { message?: string } })?.error?.message || response.statusText;
        throw new Error(`خطای API: ${errMsg}`);
    }
    return data.choices?.[0]?.message?.content ?? fullContent;
};
