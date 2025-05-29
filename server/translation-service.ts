// Translation service that supports multiple providers
export interface TranslationProvider {
  name: string;
  translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<TranslationResult>;
  isConfigured(): boolean;
}

export interface TranslationResult {
  translatedText: string;
  confidence: number;
  provider: string;
}

// Google Translate API provider
class GoogleTranslateProvider implements TranslationProvider {
  name = "Google Translate";

  isConfigured(): boolean {
    return !!process.env.GOOGLE_TRANSLATE_API_KEY;
  }

  async translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<TranslationResult> {
    if (!this.isConfigured()) {
      throw new Error("Google Translate API key not configured");
    }

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          source: sourceLanguage,
          target: targetLanguage,
          format: "text",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Google Translate API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      translatedText: data.data.translations[0].translatedText,
      confidence: 0.95,
      provider: this.name,
    };
  }
}

// Azure Translator provider
class AzureTranslatorProvider implements TranslationProvider {
  name = "Azure Translator";

  isConfigured(): boolean {
    return !!(process.env.AZURE_TRANSLATOR_KEY && process.env.AZURE_TRANSLATOR_REGION);
  }

  async translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<TranslationResult> {
    if (!this.isConfigured()) {
      throw new Error("Azure Translator credentials not configured");
    }

    const response = await fetch(
      `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${sourceLanguage}&to=${targetLanguage}`,
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.AZURE_TRANSLATOR_KEY!,
          "Ocp-Apim-Subscription-Region": process.env.AZURE_TRANSLATOR_REGION!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{ text }]),
      }
    );

    if (!response.ok) {
      throw new Error(`Azure Translator API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      translatedText: data[0].translations[0].text,
      confidence: data[0].translations[0].confidence || 0.95,
      provider: this.name,
    };
  }
}

// Fallback provider with demo phrases
class DemoTranslationProvider implements TranslationProvider {
  name = "Demo Translation";

  isConfigured(): boolean {
    return true;
  }

  private translations: Record<string, Record<string, string>> = {
    "hello": {
      "zh": "你好",
      "es": "hola",
      "fr": "bonjour",
      "de": "hallo",
      "ja": "こんにちは",
      "ko": "안녕하세요",
      "it": "ciao"
    },
    "good morning": {
      "zh": "早上好",
      "es": "buenos días",
      "fr": "bonjour",
      "de": "guten Morgen",
      "ja": "おはようございます",
      "ko": "좋은 아침",
      "it": "buongiorno"
    },
    "thank you": {
      "zh": "谢谢",
      "es": "gracias",
      "fr": "merci",
      "de": "danke",
      "ja": "ありがとう",
      "ko": "감사합니다",
      "it": "grazie"
    },
    "how are you": {
      "zh": "你好吗",
      "es": "¿cómo estás?",
      "fr": "comment allez-vous?",
      "de": "wie geht es dir?",
      "ja": "元気ですか？",
      "ko": "어떻게 지내세요?",
      "it": "come stai?"
    },
    "goodbye": {
      "zh": "再见",
      "es": "adiós",
      "fr": "au revoir",
      "de": "auf wiedersehen",
      "ja": "さようなら",
      "ko": "안녕히 가세요",
      "it": "arrivederci"
    },
    "please": {
      "zh": "请",
      "es": "por favor",
      "fr": "s'il vous plaît",
      "de": "bitte",
      "ja": "お願いします",
      "ko": "부탁합니다",
      "it": "per favore"
    },
    "excuse me": {
      "zh": "对不起",
      "es": "disculpe",
      "fr": "excusez-moi",
      "de": "entschuldigung",
      "ja": "すみません",
      "ko": "실례합니다",
      "it": "scusi"
    },
    "where is": {
      "zh": "在哪里",
      "es": "¿dónde está?",
      "fr": "où est",
      "de": "wo ist",
      "ja": "どこですか",
      "ko": "어디에 있습니까",
      "it": "dove è"
    }
  };

  async translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<TranslationResult> {
    const lowerText = text.toLowerCase().trim();
    const translatedText = this.translations[lowerText]?.[targetLanguage];
    
    if (!translatedText) {
      throw new Error(`Translation not available for: "${text}". Available phrases: ${Object.keys(this.translations).join(", ")}`);
    }

    return {
      translatedText,
      confidence: 0.95,
      provider: this.name,
    };
  }
}

// Translation service manager
export class TranslationService {
  private providers: TranslationProvider[] = [
    new GoogleTranslateProvider(),
    new AzureTranslatorProvider(),
    new DemoTranslationProvider(), // Always last as fallback
  ];

  async translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<TranslationResult> {
    let lastError: Error | null = null;

    for (const provider of this.providers) {
      if (!provider.isConfigured()) {
        continue;
      }

      try {
        return await provider.translate(text, sourceLanguage, targetLanguage);
      } catch (error) {
        lastError = error as Error;
        console.warn(`Translation failed with ${provider.name}:`, error);
        continue;
      }
    }

    throw lastError || new Error("No translation providers available");
  }

  getAvailableProviders(): string[] {
    return this.providers
      .filter(provider => provider.isConfigured())
      .map(provider => provider.name);
  }

  getConfigurationStatus() {
    return {
      google: !!process.env.GOOGLE_TRANSLATE_API_KEY,
      azure: !!(process.env.AZURE_TRANSLATOR_KEY && process.env.AZURE_TRANSLATOR_REGION),
      demo: true,
    };
  }
}

export const translationService = new TranslationService();