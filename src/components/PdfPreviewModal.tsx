'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, ExternalLink, FileText } from 'lucide-react'

interface PdfPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  documentUrl: string
  title?: string
}

export default function PdfPreviewModal({
  isOpen,
  onClose,
  documentUrl,
  title = 'Official Document Preview'
}: PdfPreviewModalProps) {
  if (!isOpen || !documentUrl) return null

  // Google Docs PDF Embed fallback if direct PDF preview has cross-origin limitations
  const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(documentUrl)}&embedded=true`

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 shrink-0">
            <div className="flex items-center space-x-3 overflow-hidden mr-4">
              <div className="w-9 h-9 rounded-xl bg-saffron-100 text-saffron-700 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-navy-950 truncate max-w-md">
                  {title}
                </h3>
                <span className="text-[10px] text-slate-500 font-semibold block">
                  Official PDF Document Preview
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <a
                href={documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 text-xs font-bold transition-colors border border-slate-200/60"
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                Open New Tab
              </a>

              <a
                href={documentUrl}
                download
                className="inline-flex items-center px-3.5 py-2 rounded-xl bg-navy-900 hover:bg-navy-850 text-white text-xs font-bold shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Download PDF
              </a>

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-600 cursor-pointer ml-1"
                aria-label="Close document preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* PDF Viewer Body */}
          <div className="flex-1 bg-slate-100 relative w-full h-full">
            <iframe
              src={documentUrl}
              className="w-full h-full border-0 rounded-b-3xl"
              title={title}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
