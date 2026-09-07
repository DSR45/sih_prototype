function ScreenShell({ children, className = '', contentClassName = 'content-wrapper' }) {
  return (
    <div className="scrollable-content">
      <div className={contentClassName + (className ? ` ${className}` : '')}>
        {children}
      </div>
    </div>
  )
}

export default ScreenShell
