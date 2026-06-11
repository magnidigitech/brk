export function detectLanguage(text: string): 'te' | 'en' | 'mixed' {
  if (!text) return 'en';
  const hasTelugu = /[\u0C00-\u0C7F]/.test(text);
  const hasEnglish = /[a-zA-Z]/.test(text);
  if (hasTelugu && hasEnglish) return 'mixed';
  if (hasTelugu) return 'te';
  return 'en';
}

// Predefined dictionary for political / public representative terms
const englishToTeluguDict: Record<string, string> = {
  "meeting": "సమావేశం",
  "office": "కార్యాలయం",
  "development": "అభివృద్ధి",
  "grievance": "ఫిర్యాదు",
  "people": "ప్రజలు",
  "public": "ప్రజలు",
  "citizen": "పౌరుడు",
  "leader": "నాయకుడు",
  "representative": "ప్రతినిధి",
  "parliament": "పార్లమెంట్",
  "education": "విద్య",
  "health": "ఆరోగ్యం",
  "road": "రహదారి",
  "water": "తాగునీరు",
  "funds": "నిధులు",
  "state": "రాష్ట్రం",
  "review": "సమీక్ష",
  "inspect": "తనిఖీ",
  "welfare": "సంక్షేమం",
  "scheme": "పథకం",
  "committee": "కమిటీ",
  "infrastructure": "మౌలిక సదుపాయాలు",
  "agriculture": "వ్యవసాయం",
  "employment": "ఉపాధి",
  "digital": "డిజిటల్",
  "environment": "పర్యావరణం",
  "services": "సేవలు",
  "portal": "పోర్టల్",
  "official": "అధికారిక",
  "vision": "దూరదృష్టి",
  "chairman": "చైర్మన్",
  "nominee": "అభ్యర్థి",
  "candidate": "అభ్యర్థి",
  "youth": "యువత",
  "discipline": "క్రమశిక్షణ"
};

const teluguToEnglishDict: Record<string, string> = {};
Object.entries(englishToTeluguDict).forEach(([en, te]) => {
  teluguToEnglishDict[te] = en;
  // Handle simple plurals and suffixes
  teluguToEnglishDict[te + "లను"] = en + "s";
  teluguToEnglishDict[te + "ల"] = en + "s";
  teluguToEnglishDict[te + "ను"] = en;
  teluguToEnglishDict[te + "కి"] = "to " + en;
  teluguToEnglishDict[te + "లో"] = "in " + en;
});

// Phonetical transliterator map from Telugu to Latin characters
const teluguPhoneticMap: Record<string, string> = {
  'అ': 'a', 'ఆ': 'aa', 'ఇ': 'i', 'ఈ': 'ee', 'ఉ': 'u', 'ఊ': 'oo', 'ఋ': 'ru', 'ఎ': 'e', 'ఏ': 'ae', 'ఐ': 'ai', 'ఒ': 'o', 'ఓ': 'oe', 'ఔ': 'au',
  'క': 'ka', 'ఖ': 'kha', 'గ': 'ga', 'ఘ': 'gha',
  'చ': 'cha', 'ఛ': 'chha', 'జ': 'ja', 'ఝ': 'jha',
  'ట': 'ta', 'ఠ': 'tha', 'డ': 'da', 'ఢ': 'dha', 'ణ': 'na',
  'త': 'ta', 'థ': 'tha', 'ద': 'da', 'ధ': 'dha', 'న': 'na',
  'ప': 'pa', 'ఫ': 'pha', 'బ': 'ba', 'భ': 'bha', 'మ': 'ma',
  'య': 'ya', 'ర': 'ra', 'ల': 'la', 'వ': 'va', 'శ': 'sha', 'ష': 'sha', 'స': 'sa', 'హ': 'ha', 'ళ': 'la', 'క్ష': 'ksha', 'ఱ': 'ra',
  'ం': 'm', 'ః': 'h',
  // Matras
  'ా': 'aa', 'ి': 'i', 'ీ': 'ee', 'ు': 'u', 'ూ': 'oo', 'ృ': 'ru', 'ె': 'e', 'ే': 'ae', 'ై': 'ai', 'ొ': 'o', 'ో': 'oe', 'ౌ': 'au', '్': ''
};

// Transliterate pure Telugu string to English characters
export function transliterateTelugu(text: string): string {
  let result = '';
  let i = 0;
  while (i < text.length) {
    const char = text[i];
    
    // Check if it's a Telugu character
    if (char >= '\u0C00' && char <= '\u0C7F') {
      const nextChar = i + 1 < text.length ? text[i + 1] : '';
      
      // Handle consonant-vowel junctions
      if (teluguPhoneticMap[char] !== undefined) {
        let mapped = teluguPhoneticMap[char];
        
        // If it's a consonant and next is a vowel sign (matra)
        if (nextChar && teluguPhoneticMap[nextChar] && nextChar >= '\u0C3E' && nextChar <= '\u0C56') {
          // Remove the default 'a' at the end of the consonant mapping and attach the vowel sign mapping
          if (mapped.endsWith('a') && mapped.length > 1) {
            mapped = mapped.slice(0, -1);
          }
          mapped += teluguPhoneticMap[nextChar];
          i += 2;
        } else if (nextChar === '్') {
          // Halant (silent vowel)
          if (mapped.endsWith('a') && mapped.length > 1) {
            mapped = mapped.slice(0, -1);
          }
          i += 2;
        } else {
          i += 1;
        }
        result += mapped;
      } else {
        result += char;
        i += 1;
      }
    } else {
      result += char;
      i += 1;
    }
  }
  
  // Clean up double vowels and standardize spelling
  return result
    .replace(/aaa/g, 'aa')
    .replace(/eee/g, 'ee')
    .replace(/ooo/g, 'oo')
    .replace(/gaaru/g, 'garu')
    .replace(/prathini/g, 'prathinidhi')
    .trim();
}

// Convert proper Telugu text to natural, mixed Tenglish
export function convertToTenglish(teluguText: string): string {
  if (!teluguText) return '';
  
  // 1. Split into words
  let words = teluguText.split(/\s+/);
  
  // 2. Map known nouns and replace them with English counterparts
  const processedWords = words.map(word => {
    // Strip punctuation
    const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    const punctuation = word.slice(cleanWord.length);
    
    // Check direct dictionary
    if (teluguToEnglishDict[cleanWord]) {
      return teluguToEnglishDict[cleanWord] + punctuation;
    }
    
    // Check sub-word replacement
    for (const [te, en] of Object.entries(teluguToEnglishDict)) {
      if (cleanWord.includes(te)) {
        // e.g. "సమావేశంలో" -> "meeting lo"
        const suffix = cleanWord.replace(te, '');
        let englishSuffix = suffix;
        if (suffix === 'లో') englishSuffix = ' lo';
        if (suffix === 'తో') englishSuffix = ' to';
        if (suffix === 'లు' || suffix === 'లను') englishSuffix = 's';
        if (suffix === 'గారు') englishSuffix = ' garu';
        return en + englishSuffix + punctuation;
      }
    }
    
    // Default: transliterate the word
    return transliterateTelugu(word);
  });
  
  return processedWords.join(' ');
}

// Perform Google Translate call with static fallbacks
export async function translateText(
  text: string, 
  targetLang: 'en' | 'te' | 'ten'
): Promise<string> {
  if (!text || text.trim() === '') return '';
  
  const detected = detectLanguage(text);
  
  // 1. If target is same as detected, return as is
  if (targetLang === 'en' && detected === 'en') return text;
  if (targetLang === 'te' && detected === 'te') return text;
  
  // 2. Handle Tenglish specifically
  if (targetLang === 'ten') {
    let baseTelugu = text;
    if (detected === 'en') {
      baseTelugu = await translateGoogle(text, 'te');
    }
    return convertToTenglish(baseTelugu);
  }
  
  // 3. Perform Google Translate
  const googleTarget = targetLang === 'te' ? 'te' : 'en';
  try {
    return await translateGoogle(text, googleTarget);
  } catch (err) {
    console.error('Google Translate failed, using fallback dictionary:', err);
    // Simple word replacement fallback
    return fallbackTranslate(text, targetLang);
  }
}

// Google Translation scraper helper
async function translateGoogle(text: string, targetCode: string): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetCode}&dt=t&q=${encodeURIComponent(text)}`;
  
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    next: { revalidate: 86400 } // Cache translation queries for 24h
  });

  if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
  
  const data = await res.json();
  if (data && data[0]) {
    // Google returns chunks: data[0] is array of sentence chunks
    let translated = '';
    for (let chunk of data[0]) {
      if (chunk && chunk[0]) {
        translated += chunk[0];
      }
    }
    return translated;
  }
  throw new Error("Invalid response structure");
}

// Fallback dictionary-based translation in case of offline/network issues
function fallbackTranslate(text: string, targetLang: 'en' | 'te' | 'ten'): string {
  if (targetLang === 'ten') {
    const te = fallbackTranslate(text, 'te');
    return convertToTenglish(te);
  }
  
  let translatedText = text;
  const dict = targetLang === 'te' ? englishToTeluguDict : teluguToEnglishDict;
  
  for (const [key, value] of Object.entries(dict)) {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    translatedText = translatedText.replace(regex, value);
  }
  return translatedText;
}
