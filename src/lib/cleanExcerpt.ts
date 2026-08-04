/**
 * Cleans raw markdown syntax and extra whitespace from summary/excerpt strings
 * for clean display in card previews, list items, and search snippets.
 */
export function cleanExcerpt(text: any): string {
  if (!text) return ''
  
  let str = text
  if (typeof str !== 'string') {
    if (typeof str === 'object') {
      str = str.en || str.te || Object.values(str)[0] || ''
    } else {
      str = String(str)
    }
  }
  
  if (!str || typeof str !== 'string') return ''

  return str
    // Remove markdown headers: ### Header -> Header
    .replace(/(^|\n)\s*#{1,6}\s*/g, ' ')
    .replace(/#{1,6}\s*/g, '')
    // Remove bold/italic markdown delimiters: **bold** -> bold, *italic* -> italic, __bold__ -> bold
    .replace(/\*{1,3}(.*?)\*{1,3}/g, '$1')
    .replace(/_{1,3}(.*?)_{1,3}/g, '$1')
    // Remove list bullet markers: - item, * item, • item, or ' - '
    .replace(/(^|\n)\s*[\-•*]\s+/g, ' ')
    .replace(/\s+[\-•*]\s+/g, ' ')
    // Remove link markup: [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Replace multiple spaces/newlines with single space
    .replace(/\s+/g, ' ')
    .trim()
}
