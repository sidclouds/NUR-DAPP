import { useEffect } from 'react'

type FeedbackTone = 'info' | 'success' | 'warning' | 'error'

interface FeedbackDialogProps {
  open: boolean
  tone?: FeedbackTone
  title: string
  message: string
  toneLabel?: string
  confirmLabel?: string
  onClose: () => void
}

export function FeedbackDialog({
  open,
  tone = 'info',
  title,
  message,
  toneLabel,
  confirmLabel = 'OK',
  onClose,
}: FeedbackDialogProps) {
  useEffect(() => {
    if (!open) return undefined

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, open])

  if (!open) return null

  return (
    <div className="feedback-dialog-backdrop" onClick={onClose}>
      <div
        className={`feedback-dialog feedback-dialog-${tone}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="feedback-dialog-head">
          <div className="feedback-dialog-chip">{toneLabel || tone}</div>
          <button className="feedback-dialog-close" type="button" onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </div>
        <h3 id="feedback-dialog-title" className="feedback-dialog-title">{title}</h3>
        <p className="feedback-dialog-message">{message}</p>
        <div className="feedback-dialog-actions">
          <button className="primary-button" type="button" onClick={onClose}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export type { FeedbackTone }
