import React, { useEffect, useRef, useState } from 'react'

const CONFIRM_TEXT = 'Reset data'

const ResetConfirm = ({ open, onCancel, onConfirm }) => {
  const [typed, setTyped] = useState('')
  const inputRef = useRef(null)
  const canReset = typed.trim() === CONFIRM_TEXT

  useEffect(() => {
    if (!open) {
      setTyped('')
      return undefined
    }

    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus()
    }, 0)

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onCancel])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!canReset) return
    onConfirm()
  }

  if (!open) return null

  return (
    <div className="modal-backdrop" role="presentation" onClick={onCancel}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="reset-title">Erase all data?</h3>
        <p>
          This removes every transaction saved in this browser. You cannot undo
          this action.
        </p>
        <form className="reset-confirm-form" onSubmit={handleSubmit}>
          <label htmlFor="reset-confirm-input">
            Type <strong>{CONFIRM_TEXT}</strong> to confirm
          </label>
          <input
            id="reset-confirm-input"
            ref={inputRef}
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder={CONFIRM_TEXT}
            autoComplete="off"
            spellCheck="false"
            aria-describedby="reset-confirm-hint"
          />
          <p id="reset-confirm-hint" className="reset-confirm-hint">
            The reset button stays locked until the text matches exactly.
          </p>
          <div className="modal-actions">
            <button type="button" className="ghost-btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="danger-btn" disabled={!canReset}>
              Yes, reset
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetConfirm
