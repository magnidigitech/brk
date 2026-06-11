import { useState } from 'react'
import { useDocumentOperation, DocumentActionProps } from 'sanity'

async function translateObject(val: any): Promise<any> {
  if (!val || typeof val !== 'object') return val;

  // Check if it's a localeString or localeText
  const isLocaleField = ('en' in val || 'te' in val || 'ten' in val) && 
    (typeof val.en === 'string' || typeof val.te === 'string' || typeof val.ten === 'string');

  if (isLocaleField) {
    const sourceText = val.en || val.te || val.ten;
    if (sourceText && sourceText.trim()) {
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: sourceText }),
        });
        if (res.ok) {
          const data = await res.json();
          return {
            ...val,
            en: data.en || val.en || '',
            te: data.te || val.te || '',
            ten: data.ten || val.ten || '',
          };
        }
      } catch (err) {
        console.error('Translation failed for value:', sourceText, err);
      }
    }
    return val;
  }

  if (Array.isArray(val)) {
    return Promise.all(val.map(item => translateObject(item)));
  }

  const res: any = {};
  for (const key of Object.keys(val)) {
    if (key.startsWith('_') && key !== '_type') {
      res[key] = val[key];
    } else {
      res[key] = await translateObject(val[key]);
    }
  }
  return res;
}

export function TranslateDocumentAction(props: DocumentActionProps) {
  const { patch } = useDocumentOperation(props.id, props.type)
  const [isTranslating, setIsTranslating] = useState(false)

  const doc = props.draft || props.published
  if (!doc) return null

  const handleTranslate = async () => {
    setIsTranslating(true)
    try {
      const updatedDoc = await translateObject(doc)
      const patchData = { ...updatedDoc }
      delete patchData._id
      delete patchData._type
      delete patchData._rev
      delete patchData._updatedAt
      delete patchData._createdAt

      patch.execute([{ set: patchData }])
    } catch (err) {
      console.error('Document auto-translate failed:', err)
    } finally {
      setIsTranslating(false)
    }
  }

  return {
    label: isTranslating ? 'Translating...' : 'Auto-Translate (EN/TE/TEN)',
    disabled: isTranslating,
    onHandle: handleTranslate,
  }
}
