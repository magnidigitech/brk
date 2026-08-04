'use client'

import React from 'react'

interface RichTextRendererProps {
  content: any[] | string | undefined | null
  ttsState?: string
  currentCharIndex?: number
  className?: string
}

interface TextToken {
  text: string
  start: number
  end: number
  isBold?: boolean
}

// Tokenize text into words with global character offsets for Speech-to-Text highlighting
function tokenizeString(text: string, globalOffset: number): TextToken[] {
  const tokens: TextToken[] = []
  let currentWord = ''
  let wordStart = -1

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (/\S/.test(char)) {
      if (wordStart === -1) wordStart = i
      currentWord += char
    } else {
      if (currentWord) {
        tokens.push({
          text: currentWord,
          start: globalOffset + wordStart,
          end: globalOffset + i
        })
        currentWord = ''
        wordStart = -1
      }
    }
  }
  if (currentWord) {
    tokens.push({
      text: currentWord,
      start: globalOffset + wordStart,
      end: globalOffset + text.length
    })
  }

  return tokens
}

// Format bold text markdown (**bold**) or heading titles (Title:)
function renderFormattedLine(
  text: string, 
  ttsActive: boolean, 
  currentCharIndex: number, 
  globalOffsetRef: { current: number }
) {
  // Check if line matches sub-heading pattern: "Heading Title: rest of paragraph"
  const colonHeadingMatch = text.match(/^([A-Z0-9\s&/\-–—"']{3,60}:)([\s\S]*)$/)

  if (colonHeadingMatch) {
    const headingText = colonHeadingMatch[1]
    const bodyText = colonHeadingMatch[2]

    const hOffset = globalOffsetRef.current
    const hTokens = tokenizeString(headingText, hOffset)
    globalOffsetRef.current += headingText.length

    const bOffset = globalOffsetRef.current
    const bTokens = tokenizeString(bodyText, bOffset)
    globalOffsetRef.current += bodyText.length

    return (
      <div className="mb-4">
        <span className="font-bold text-navy-950 text-base sm:text-lg border-l-4 border-saffron-500 pl-3 py-0.5 mb-1.5 block leading-snug">
          {ttsActive ? (
            hTokens.map((t, i) => {
              const isH = currentCharIndex >= t.start && currentCharIndex < t.end
              return (
                <span key={i} className={isH ? 'bg-saffron-200 text-saffron-950 px-0.5 rounded' : ''}>
                  {t.text}{' '}
                </span>
              )
            })
          ) : (
            headingText
          )}
        </span>
        {bodyText.trim() && (
          <p className="text-slate-800 text-sm sm:text-base leading-relaxed pl-3">
            {ttsActive ? (
              bTokens.map((t, i) => {
                const isH = currentCharIndex >= t.start && currentCharIndex < t.end
                return (
                  <span key={i} className={isH ? 'bg-saffron-200 text-saffron-950 px-0.5 rounded' : ''}>
                    {t.text}{' '}
                  </span>
                )
              })
            ) : (
              bodyText.trim()
            )}
          </p>
        )}
      </div>
    )
  }

  // Check if line is a bullet item starting with -, *, •, or numbered list
  const bulletMatch = text.match(/^([\-•*]|\d+\.)\s+(.*)$/)
  if (bulletMatch) {
    const itemText = bulletMatch[2]
    const offset = globalOffsetRef.current
    const tokens = tokenizeString(itemText, offset)
    globalOffsetRef.current += text.length

    return (
      <li className="flex items-start gap-2.5 my-1.5 text-slate-800 text-sm sm:text-base leading-relaxed pl-2">
        <span className="inline-block w-2 h-2 rounded-full bg-saffron-500 mt-2 shrink-0" />
        <div>
          {ttsActive ? (
            tokens.map((t, i) => {
              const isH = currentCharIndex >= t.start && currentCharIndex < t.end
              return (
                <span key={i} className={isH ? 'bg-saffron-200 text-saffron-950 px-0.5 rounded' : ''}>
                  {t.text}{' '}
                </span>
              )
            })
          ) : (
            itemText
          )}
        </div>
      </li>
    )
  }

  // Check if line starts with ### or ## or # Markdown Heading
  const markdownHeadingMatch = text.match(/^(#{1,3})\s+(.*)$/)
  if (markdownHeadingMatch) {
    const headingText = markdownHeadingMatch[2]
    const offset = globalOffsetRef.current
    const tokens = tokenizeString(headingText, offset)
    globalOffsetRef.current += text.length

    return (
      <h3 className="text-base sm:text-lg font-black text-navy-950 border-l-4 border-saffron-500 pl-3 py-1 my-4 tracking-tight">
        {ttsActive ? (
          tokens.map((t, i) => {
            const isH = currentCharIndex >= t.start && currentCharIndex < t.end
            return (
              <span key={i} className={isH ? 'bg-saffron-200 text-saffron-950 px-0.5 rounded' : ''}>
                {t.text}{' '}
              </span>
            )
          })
        ) : (
          headingText
        )}
      </h3>
    )
  }

  // Normal Paragraph (with support for bold **markers**)
  const offset = globalOffsetRef.current
  const tokens = tokenizeString(text, offset)
  globalOffsetRef.current += text.length + 1

  // Handle inline **bold** text replacement if not TTS
  if (!ttsActive && text.includes('**')) {
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return (
      <p className="text-slate-800 text-sm sm:text-base leading-relaxed my-3">
        {parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="font-bold text-navy-950">
                {part.slice(2, -2)}
              </strong>
            )
          }
          return part
        })}
      </p>
    )
  }

  return (
    <p className="text-slate-800 text-sm sm:text-base leading-relaxed my-3">
      {ttsActive ? (
        tokens.map((t, i) => {
          const isH = currentCharIndex >= t.start && currentCharIndex < t.end
          return (
            <span key={i} className={isH ? 'bg-saffron-200 text-saffron-950 px-0.5 rounded' : ''}>
              {t.text}{' '}
            </span>
          )
        })
      ) : (
        text
      )}
    </p>
  )
}

export default function RichTextRenderer({
  content,
  ttsState = 'idle',
  currentCharIndex = -1,
  className = ''
}: RichTextRendererProps) {
  if (!content) return null

  const ttsActive = ttsState !== 'idle'
  const globalOffsetRef = { current: 0 }

  // Case A: Sanity PortableText array blocks
  if (Array.isArray(content)) {
    return (
      <div className={`space-y-3 ${className}`}>
        {content.map((block: any, blockIdx: number) => {
          if (!block) return null

          // Image block
          if (block._type === 'image' && block.asset?.url) {
            return (
              <div key={block._key || blockIdx} className="my-6 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={block.asset.url} alt="" className="w-full h-auto object-cover" />
              </div>
            )
          }

          // PortableText block
          if (block._type === 'block' && Array.isArray(block.children)) {
            const blockStyle = block.style || 'normal'
            const isListItem = block.listItem === 'bullet'

            const blockText = block.children.map((c: any) => c.text || '').join('')
            if (!blockText.trim()) return null

            // Block Headings
            if (blockStyle === 'h1' || blockStyle === 'h2' || blockStyle === 'h3' || blockStyle === 'h4') {
              const offset = globalOffsetRef.current
              const tokens = tokenizeString(blockText, offset)
              globalOffsetRef.current += blockText.length + 1

              return (
                <h3 key={block._key || blockIdx} className="text-base sm:text-xl font-black text-navy-950 border-l-4 border-saffron-500 pl-3.5 py-1 mt-6 mb-3 tracking-tight">
                  {ttsActive ? (
                    tokens.map((t, i) => {
                      const isH = currentCharIndex >= t.start && currentCharIndex < t.end
                      return (
                        <span key={i} className={isH ? 'bg-saffron-200 text-saffron-950 px-0.5 rounded' : ''}>
                          {t.text}{' '}
                        </span>
                      )
                    })
                  ) : (
                    blockText
                  )}
                </h3>
              )
            }

            // Bullet List Item
            if (isListItem) {
              const offset = globalOffsetRef.current
              const tokens = tokenizeString(blockText, offset)
              globalOffsetRef.current += blockText.length + 1

              return (
                <li key={block._key || blockIdx} className="flex items-start gap-2.5 my-1.5 text-slate-800 text-sm sm:text-base leading-relaxed pl-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-saffron-500 mt-2 shrink-0" />
                  <div>
                    {ttsActive ? (
                      tokens.map((t, i) => {
                        const isH = currentCharIndex >= t.start && currentCharIndex < t.end
                        return (
                          <span key={i} className={isH ? 'bg-saffron-200 text-saffron-950 px-0.5 rounded' : ''}>
                            {t.text}{' '}
                          </span>
                        )
                      })
                    ) : (
                      blockText
                    )}
                  </div>
                </li>
              )
            }

            // Normal Block Paragraph with child mark formatting
            const offset = globalOffsetRef.current
            const tokens = tokenizeString(blockText, offset)
            globalOffsetRef.current += blockText.length + 1

            return (
              <div key={block._key || blockIdx}>
                {renderFormattedLine(blockText, ttsActive, currentCharIndex, { current: offset })}
              </div>
            )
          }

          return null
        })}
      </div>
    )
  }

  // Case B: Plain string content (parsed lines & paragraphs)
  if (typeof content === 'string') {
    // Standardize newlines and split by double or single newlines
    const rawLines = content
      .replace(/\r\n/g, '\n')
      .split(/\n\s*\n/)
      .filter((line) => line.trim().length > 0)

    return (
      <div className={`space-y-3 ${className}`}>
        {rawLines.map((lineGroup, idx) => {
          // If paragraph has single line breaks, process line by line
          const lines = lineGroup.split('\n').filter((l) => l.trim())
          return (
            <div key={idx}>
              {lines.map((line, lIdx) => (
                <React.Fragment key={lIdx}>
                  {renderFormattedLine(line.trim(), ttsActive, currentCharIndex, globalOffsetRef)}
                </React.Fragment>
              ))}
            </div>
          )}
        )}
      </div>
    )
  }

  return null
}
