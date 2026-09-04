import { Icons } from './Icons'
import './WorkflowComponents.css'

export function WorkflowProgress({ screen, title, eyebrow = 'Care journey' }) {
  const steps = [
    { number: 6, label: 'Review' },
    { number: 7, label: 'Assessment' },
    { number: 8, label: 'Recommendation' },
    { number: 9, label: 'Request' },
    { number: 10, label: 'Matching' },
    { number: 13, label: 'Tracking' },
    { number: 14, label: 'Complete' }
  ]
  const activeIndex = steps.reduce((last, step, index) => screen >= step.number ? index : last, 0)

  return (
    <div className="workflow-progress">
      <div className="workflow-progress-copy">
        <span className="workflow-eyebrow">{eyebrow}</span>
        <strong>{title}</strong>
      </div>
      <div className="workflow-progress-track" aria-label={`Step ${activeIndex + 1} of ${steps.length}`}>
        {steps.map((step, index) => (
          <div className={`workflow-progress-step ${index <= activeIndex ? 'is-done' : ''} ${index === activeIndex ? 'is-active' : ''}`} key={step.number}>
            <span>{index + 1}</span>
            <small>{step.label}</small>
          </div>
        ))}
      </div>
    </div>
  )
}

export function StatusBadge({ tone = 'neutral', children }) {
  return <span className={`status-badge status-${tone}`}><span className="status-dot" />{children}</span>
}

export function UrgencyIndicator({ level = 'Moderate', detail }) {
  const tone = level.toLowerCase().includes('high') || level.toLowerCase().includes('urgent') ? 'urgent' : 'moderate'
  return (
    <div className={`urgency-indicator urgency-${tone}`}>
      <span className="urgency-pulse" aria-hidden="true" />
      <div>
        <span className="workflow-label">Urgency level</span>
        <strong>{level}</strong>
        {detail && <small>{detail}</small>}
      </div>
    </div>
  )
}

export function Timeline({ items, activeIndex = 0, compact = false }) {
  return (
    <div className={`status-timeline ${compact ? 'timeline-compact' : ''}`}>
      {items.map((item, index) => (
        <div className={`timeline-item ${index < activeIndex ? 'is-complete' : ''} ${index === activeIndex ? 'is-current' : ''}`} key={item.label}>
          <div className="timeline-marker">{index < activeIndex ? '✓' : index + 1}</div>
          <div className="timeline-content">
            <strong>{item.label}</strong>
            {item.detail && <span>{item.detail}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

export function DonorCard({ donor, highlighted = false }) {
  return (
    <article className={`donor-card ${highlighted ? 'is-highlighted' : ''}`}>
      <div className="donor-avatar" aria-hidden="true">{donor.initials}</div>
      <div className="donor-main">
        <div className="donor-title-row">
          <div>
            <h3>{donor.label}</h3>
            <span>{donor.match} compatibility</span>
          </div>
          <StatusBadge tone="success">{donor.verification}</StatusBadge>
        </div>
        <div className="donor-meta">
          <span><i className="meta-icon">●</i>{donor.availability}</span>
          <span><i className="meta-icon">⌖</i>{donor.distance}</span>
          <span><i className="meta-icon">★</i>{donor.reliability}</span>
        </div>
      </div>
    </article>
  )
}

export function RequestCard({ request, onOpen }) {
  return (
    <article className="request-card">
      <div className="request-card-top">
        <div>
          <span className="workflow-label">{request.date}</span>
          <h3>{request.type}</h3>
        </div>
        <StatusBadge tone={request.statusTone}>{request.status}</StatusBadge>
      </div>
      <div className="request-card-meta">
        <span>{request.hospital}</span>
        <span>{request.urgency} urgency</span>
      </div>
      <button className="text-button" onClick={onOpen}>View request details <Icons.ArrowRight /></button>
    </article>
  )
}

export function LoadingOrb({ label }) {
  return (
    <div className="loading-orb" aria-label={label} role="status">
      <span /><span /><span />
    </div>
  )
}

export function WorkflowActionBar({ backLabel = 'Back', onBack, primaryLabel, onPrimary, primaryDisabled = false, secondaryLabel, onSecondary }) {
  return (
    <div className="workflow-actions">
      {onBack ? <button className="workflow-button workflow-button-quiet" onClick={onBack}><Icons.ArrowLeft />{backLabel}</button> : <span />}
      <div className="workflow-action-right">
        {onSecondary && <button className="workflow-button workflow-button-outline" onClick={onSecondary}>{secondaryLabel}</button>}
        {onPrimary && <button className="workflow-button workflow-button-primary" disabled={primaryDisabled} onClick={onPrimary}>{primaryLabel}<Icons.ArrowRight /></button>}
      </div>
    </div>
  )
}
