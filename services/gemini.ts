
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { RapStyle, RapLength, RhymeScheme, LyricResponse, RapTone, RhymeComplexity, ImageSize, StructureRule, SingerGender } from "../types";

// Tonal modules to provide context to the model for different rap styles
const TONE_MODULES = {
  [RapTone.Aggressive]: "واژگان تند، بیانی قاطع و حماسی، استفاده از کلمات کوبنده.",
  [RapTone.Philosophical]: "تصویرسازی‌های انتزاعی، تفکر در مورد جامعه و خود، واژگان ادبی و سنگین‌تر.",
  [RapTone.Humorous]: "کنایه، بازی با کلمات خنده‌دار، استفاده از اسلنگ‌های فان و روزمره.",
  [RapTone.Dark]: "فضاسازی سرد، ناامیدی، استفاده از ایهام‌های سیاه و گنگ.",
  [RapTone.Melodic]: "جملات کشیده‌تر، تمرکز روی واکه‌ها (Vowels)، حس آرامش و ریتمیک.",
  [RapTone.Epic]: "بیانی حماسی و پیروزمندانه، استفاده از واژگان قدرتمند، ریتم کوبنده و تاثیرگذار.",
  [RapTone.Nostalgic]: "حس دلتنگی و مرور خاطرات، استفاده از کلمات نوستالژیک، بیانی ملایم و با مکث‌های بلند.",
  [RapTone.Underground]: "فضای مستقل و خام، دوری از کلمات پرزرق و برق، استفاده از اسلنگ‌های خیابانی عمیق و واقعی.",
  [RapTone.Experimental]: "ساختارشکنی در وزن و قافیه، استعاره‌های نامتعارف، فلوهای غیرمنتظره و تجربی.",
  [RapTone.Cynical]: "نگاهی منتقدانه، تلخ و گزنده به مسائل، استفاده از کنایه‌های تند و ایهام‌های سیاه.",
  [RapTone.Mystical]: "استفاده از سمبولیسم کلاسیک ایرانی (نور، سایه، جام، رند)، تصاویر انتزاعی و روحانی.",
  [RapTone.Savage]: "انرژی بالا، عصیان، بی‌پروایی در بیان حقایق، جملات کوتاه و بریده‌بریده.",
  [RapTone.Melancholic]: "فضای خواب‌گونه و سورئال، تکرار کلمات برای ایجاد حس گیجی، تمرکز بر دردهای درونی.",
  [RapTone.Satirical]: "هجو هجوآمیز و گزنده، استفاده از پارادوکس‌های خنده‌دار اما تلخ، نقد قدرت با زبان رپ.",
  [RapTone.Braggadocio]: "تکنیک‌های خودستایی، تحقیر حریف (بَتِل)، فخر فروختن به مهارت‌ها و دستاوردها."
};

/**
 * Generates rap lyrics based on several parameters using the Gemini model.
 */
export const generateRapLyrics = async (
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
): Promise<LyricResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = useThinking ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
  
  const systemInstruction = `You are a world-class Persian Rap Lyricist and Flow Engineer. 
  Your goal is to produce high-quality, rhythmically complex rap lyrics in Persian.
  The lyrics should be written specifically for a ${singerGender === SingerGender.Male ? 'MALE' : 'FEMALE'} rap artist.
  Tonal module for current request: ${TONE_MODULES[tone]}
  Strictly follow these rules:
  1. Do NOT include Intro or Outro sections. Only use Verse, Chorus, and Bridge.
  2. Use multisyllabic rhymes and complex internal rhyme schemes where appropriate.
  3. Format the output as a JSON object with 'title', 'content', and 'aiAnalysis'.
  4. 'content' should contain the lyrics with section headers in brackets like [Verse 1].
  5. 'aiAnalysis' should be a professional breakdown of the flow, rhythm, and lyrical techniques used.`;

  const prompt = `Write a Persian rap song.
  Topic: ${topic}
  ${additionalNotes ? `User Specific Instructions/Notes: ${additionalNotes}` : ''}
  Singer Gender: ${singerGender}
  Style: ${style} (${subStyle})
  Tone: ${tone}
  Rhyme Complexity: ${rhymeComplexity}
  Length: ${length}
  Rhyme Scheme: ${rhymeScheme}
  Target BPM: ${targetBpm}
  Flow Speed: ${flowSpeed}
  Stress Level: ${stressLevel}
  Rhythmic Variety: ${rhythmicVariety}
  Keywords to include: ${keywords}
  ${structureRules && structureRules.length > 0 ? `Structure Rules: ${JSON.stringify(structureRules)}` : ''}
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      temperature: creativity,
      topK,
      topP,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          aiAnalysis: { type: Type.STRING }
        },
        required: ["title", "content", "aiAnalysis"]
      },
      thinkingConfig: useThinking ? { thinkingBudget: 4000 } : undefined
    }
  });

  const result = JSON.parse(response.text || '{}');
  return {
    title: result.title || "Untitled Rap",
    content: result.content || "",
    aiAnalysis: result.aiAnalysis || "",
    variant: 'Standard_Flow_v1',
    suggestedBpm: targetBpm
  };
};

/**
 * Regenerates specific lines of a rap lyric while keeping the rest intact.
 */
export const regenerateRapLines = async (
  fullContent: string,
  lineIndices: number[],
  style: string,
  topic: string,
  instruction: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Full Lyrics:\n${fullContent}\n\nTask: Rewrite lines ${lineIndices.join(', ')} based on this instruction: "${instruction}". Keep the rest of the lyrics unchanged. Only return the full updated lyrics.`,
    config: {
      systemInstruction: "You are a lyric editor. Return ONLY the updated full text of the lyrics, nothing else."
    }
  });
  return response.text || fullContent;
};

/**
 * Transforms text into audio using the Gemini TTS model.
 */
export const generateRapAudio = async (text: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Say with a rap flow rhythm: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
};

/**
 * Generates an album cover art using the Gemini Image generation model.
 */
export const generateRapCoverArt = async (title: string, style: string, size: ImageSize): Promise<string> => {
  const model = (size === '2K' || size === '4K') ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  
  // Mandatory API Key selection for high-quality models
  if (model === 'gemini-3-pro-image-preview' && window.aistudio) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
    }
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // imageSize is only supported for gemini-3-pro-image-preview
  const imageConfig: any = {
    aspectRatio: "1:1"
  };
  
  if (model === 'gemini-3-pro-image-preview') {
    imageConfig.imageSize = size === '1K' ? '1K' : (size === '2K' ? '2K' : '4K');
  }

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { text: `Album cover art for a Persian rap song titled "${title}". Style: ${style}. Professional hip-hop aesthetic, cinematic lighting, high detail.` }
      ]
    },
    config: {
      imageConfig
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return "";
};
