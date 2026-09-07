function StepNavigation({
  onBack,
  onContinue,
  backLabel,
  continueLabel,
  currentStep = 0,
  totalSteps = 4,
  continueDisabled = false,
  hidePagination = false,
  showBack = true,
  showContinue = true,
  className = ''
}) {
  return (
    <div className={`action-buttons ${className}`.trim()}>
      {showBack && (
        <button className="back-button" onClick={onBack} type="button">
          ← {backLabel}
        </button>
      )}

      {!hidePagination && (
        <div className="pagination" aria-label="Step progress">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <span
              key={index}
              className={`page-dot ${index < currentStep ? 'completed' : index === currentStep ? 'active' : ''}`}
            />
          ))}
        </div>
      )}

      {showContinue && (
        <button
          className={`continue-button ${continueDisabled ? 'disabled' : ''}`}
          onClick={onContinue}
          disabled={continueDisabled}
          type="button"
        >
          {continueLabel} →
        </button>
      )}
    </div>
  )
}

export default StepNavigation
