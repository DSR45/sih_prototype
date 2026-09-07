import { useEffect, useRef, useState } from 'react'
import { Icons } from '@shared/components/Icons'
import { doctorActivity, doctorQueue, mockClinicalRecord, mockDoctor } from '@shared/constants/mockData'
import { getDoctorProfile, getDoctorQueueData } from '../../services/mockDoctorService'
import './styles.css'

const navItems = [
  { id: 'overview', label: 'Overview', icon: Icons.LayoutDashboard },
  { id: 'patients', label: 'Patient queue', icon: Icons.Users },
  { id: 'documents', label: 'Original documents', icon: Icons.FileText },
  { id: 'extracted', label: 'Extracted information', icon: Icons.Scan },
  { id: 'compare', label: 'Compare information', icon: Icons.GitCompare },
  { id: 'summary', label: 'Clinical summary', icon: Icons.Clipboard },
  { id: 'reports', label: 'Reports', icon: Icons.Clipboard },
  { id: 'settings', label: 'Settings', icon: Icons.Settings }
]

const initialNotifications = [
  { id: 1, title: 'New patient intake', message: 'Rahul Sharma is ready for review.', time: '2 min ago', unread: true },
  { id: 2, title: 'Extraction completed', message: 'Patient document MK-1048 is ready.', time: '10 min ago', unread: true },
  { id: 3, title: 'Consultation saved', message: "Sunita Rao's notes were saved.", time: '28 min ago', unread: false }
]

const availableAccounts = [
  { name: 'Dr. Ananya Mehta', specialty: 'General Medicine', initials: 'AM' },
  { name: 'Dr. Rohan Kapoor', specialty: 'Internal Medicine', initials: 'RK' }
]

function DoctorDashboard({ onLogout, onPatientAccess }) {
  const [activeView, setActiveView] = useState('overview')
  const [queueItems, setQueueItems] = useState(doctorQueue)
  const [selectedPatient, setSelectedPatient] = useState(doctorQueue[0])
  const [openMenu, setOpenMenu] = useState(null)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [doctor, setDoctor] = useState(() => JSON.parse(localStorage.getItem('medikiosk-doctor-profile') || JSON.stringify(mockDoctor)))
  const [savedNotes, setSavedNotes] = useState(() => JSON.parse(localStorage.getItem('medikiosk-doctor-notes') || '{}'))
  const [extractedFields, setExtractedFields] = useState(() => JSON.parse(localStorage.getItem('medikiosk-extracted-fields') || JSON.stringify(mockClinicalRecord.extracted.map((field) => ({ ...field, doctorEdited: false })))) )
  const [reviewField, setReviewField] = useState(null)
  const [showNotesEditor, setShowNotesEditor] = useState(false)
  const [consultationPatient, setConsultationPatient] = useState(null)
  const headerActionsRef = useRef(null)

  useEffect(() => {
    async function loadDoctorWorkspaceData() {
      try {
        const [profile, queue] = await Promise.all([getDoctorProfile(), getDoctorQueueData()])
        setDoctor(profile)
        setQueueItems(queue)
        setSelectedPatient((current) => current || queue[0] || doctorQueue[0])
      } catch (error) {
        console.warn('Doctor workspace data load failed:', error)
      }
    }

    loadDoctorWorkspaceData()
  }, [])

  useEffect(() => {
    localStorage.setItem('medikiosk-doctor-profile', JSON.stringify(doctor))
  }, [doctor])

  useEffect(() => {
    localStorage.setItem('medikiosk-doctor-notes', JSON.stringify(savedNotes))
  }, [savedNotes])

  useEffect(() => {
    localStorage.setItem('medikiosk-extracted-fields', JSON.stringify(extractedFields))
  }, [extractedFields])

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (headerActionsRef.current && !headerActionsRef.current.contains(event.target)) {
        setOpenMenu(null)
      }
    }
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpenMenu(null)
        setShowAccountSwitcher(false)
        setShowLogoutConfirm(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const selectPatient = (patient) => {
    setSelectedPatient(patient)
    setActiveView('patients')
  }

  return (
    <main className="doctor-workspace">
      <aside className="doctor-sidebar">
        <div className="workspace-brand"><span><Icons.Heart /></span><strong>MediKiosk</strong></div>
        <div className="workspace-clinic"><span className="clinic-dot" /> {mockDoctor.clinic}</div>
        <nav className="workspace-nav" aria-label="Doctor workspace navigation">
          <p>WORKSPACE</p>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} className={activeView === id ? 'active' : ''} onClick={() => setActiveView(id)}>
              <Icon /><span>{label}</span>{id === 'patients' && <b>3</b>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="patient-kiosk-link" onClick={onPatientAccess}><Icons.ExternalLink /> Open patient kiosk</button>
          <button className="logout-link" onClick={onLogout}><Icons.Logout /> Sign out</button>
          <div className="doctor-mini-profile"><span>{doctor.initials}</span><div><strong>{doctor.name}</strong><small>{doctor.specialty}</small></div><Icons.More /></div>
        </div>
      </aside>

      <section className="workspace-main">
        <header className="workspace-header">
          <div className="mobile-menu-brand"><span><Icons.Heart /></span>MediKiosk</div>
          <div className="header-actions" ref={headerActionsRef}>
            <div className="header-menu-anchor">
              <button className={`icon-action ${openMenu === 'notifications' ? 'menu-open' : ''}`} aria-label="Notifications" aria-expanded={openMenu === 'notifications'} onClick={() => setOpenMenu(openMenu === 'notifications' ? null : 'notifications')}><Icons.Bell />{notifications.some((notification) => notification.unread) && <i />}</button>
              {openMenu === 'notifications' && <NotificationPanel notifications={notifications} onMarkAllRead={() => setNotifications((current) => current.map((notification) => ({ ...notification, unread: false })))} />}
            </div>
            <div className="header-menu-anchor">
              <button className={`header-doctor ${openMenu === 'profile' ? 'menu-open' : ''}`} aria-label="Doctor profile menu" aria-expanded={openMenu === 'profile'} onClick={() => setOpenMenu(openMenu === 'profile' ? null : 'profile')}><span>{doctor.initials}</span><strong>{doctor.name}</strong><Icons.ChevronDown /></button>
              {openMenu === 'profile' && <ProfilePanel doctor={doctor} onProfile={() => { setActiveView('settings'); setOpenMenu(null) }} onAddAccount={() => { setShowAccountSwitcher(true); setOpenMenu(null) }} onLogout={() => { setShowLogoutConfirm(true); setOpenMenu(null) }} />}
            </div>
          </div>
        </header>

        {activeView === 'overview' && <Overview onSelectPatient={selectPatient} onQueue={() => setActiveView('patients')} queueItems={queueItems} />}
        {activeView === 'patients' && <PatientQueue selectedPatient={selectedPatient} onSelectPatient={setSelectedPatient} onOpenRecord={() => setActiveView('documents')} queueItems={queueItems} />}
        {activeView === 'documents' && <OriginalDocuments onNext={() => setActiveView('extracted')} />}
        {activeView === 'extracted' && <ExtractedInformation fields={extractedFields} onFieldsChange={setExtractedFields} focusField={reviewField} onFocusHandled={() => setReviewField(null)} onNext={() => setActiveView('compare')} onBack={() => setActiveView('documents')} />}
        {activeView === 'compare' && <CompareInformation fields={extractedFields} hasComparison={selectedPatient.id === mockClinicalRecord.patientId} onNext={() => setActiveView('summary')} onBack={() => setActiveView('extracted')} onReviewField={() => { setReviewField('Current medication'); setActiveView('extracted') }} />}
        {activeView === 'summary' && <ClinicalSummary patient={selectedPatient} savedNote={savedNotes[selectedPatient.id] || ''} onStartConsultation={() => { setConsultationPatient(selectedPatient); setActiveView('consultation') }} onAddNotes={() => setShowNotesEditor(true)} onReopenComparison={() => setActiveView('compare')} onBack={() => setActiveView('compare')} />}
        {activeView === 'consultation' && <Consultation patient={consultationPatient || selectedPatient} note={savedNotes[selectedPatient.id] || ''} onBack={() => setActiveView('summary')} />}
        {activeView === 'reports' && <Reports />}
        {activeView === 'settings' && <Settings doctor={doctor} onSave={setDoctor} />}
      </section>
      {showAccountSwitcher && <AccountSwitcher currentDoctor={doctor} onClose={() => setShowAccountSwitcher(false)} onSelect={(account) => { setDoctor(account); setShowAccountSwitcher(false) }} />}
      {showLogoutConfirm && <LogoutConfirmation onCancel={() => setShowLogoutConfirm(false)} onConfirm={onLogout} />}
      {showNotesEditor && <DoctorNotesEditor patient={selectedPatient} initialNote={savedNotes[selectedPatient.id] || ''} onCancel={() => setShowNotesEditor(false)} onSave={(note) => { setSavedNotes((current) => ({ ...current, [selectedPatient.id]: note })); setShowNotesEditor(false) }} />}
    </main>
  )
}

function NotificationPanel({ notifications, onMarkAllRead }) {
  return <div className="header-popover notification-panel" role="dialog" aria-label="Notifications"><div className="popover-heading"><div><strong>Notifications</strong><span>{notifications.filter((notification) => notification.unread).length} unread</span></div><button className="popover-action" onClick={onMarkAllRead}>Mark all as read</button></div>{notifications.length ? notifications.map((notification) => <div className={`notification-item ${notification.unread ? 'unread' : ''}`} key={notification.id}><span className="notification-dot" /><div><strong>{notification.title}</strong><p>{notification.message}</p><time>{notification.time}</time></div></div>) : <p className="empty-popover">No new notifications</p>}</div>
}

function ProfilePanel({ doctor, onProfile, onAddAccount, onLogout }) {
  return <div className="header-popover profile-panel" role="menu" aria-label="Doctor profile options"><div className="profile-popover-heading"><span>{doctor.initials}</span><div><strong>{doctor.name}</strong><small>{doctor.specialty}</small></div></div><button role="menuitem" onClick={onProfile}><Icons.User /> Doctor Profile</button><button role="menuitem" onClick={onAddAccount}><Icons.Plus /> Add Another Account</button><button className="danger-menu-item" role="menuitem" onClick={onLogout}><Icons.Logout /> Logout</button></div>
}

function AccountSwitcher({ currentDoctor, onClose, onSelect }) {
  const [email, setEmail] = useState('')
  const accounts = availableAccounts.filter((account) => account.name !== currentDoctor.name)
  const handleSubmit = (event) => {
    event.preventDefault()
    if (email.trim()) {
      onSelect({ name: email.trim(), specialty: 'General Medicine', initials: email.trim().split(/[ .@]/).filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase() })
    }
  }
  return <div className="account-overlay" role="presentation"><section className="account-dialog" role="dialog" aria-modal="true" aria-labelledby="account-switcher-title"><button className="dialog-close" aria-label="Close account switcher" onClick={onClose}>×</button><p className="login-kicker">ACCOUNT ACCESS</p><h2 id="account-switcher-title">Switch doctor account</h2><p className="account-dialog-description">Choose an available account or sign in with another work email.</p><div className="account-list">{accounts.map((account) => <button key={account.name} className="account-option" onClick={() => onSelect(account)}><span>{account.initials}</span><div><strong>{account.name}</strong><small>{account.specialty}</small></div><Icons.ChevronRight /></button>)}</div><div className="account-divider"><span>or</span></div><form onSubmit={handleSubmit} className="account-form"><label htmlFor="account-email">Work email</label><input id="account-email" type="email" placeholder="doctor@hospital.com" value={email} onChange={(event) => setEmail(event.target.value)} required /><button className="primary-action" type="submit">Continue with account <Icons.ArrowRight /></button></form></section></div>
}

function LogoutConfirmation({ onCancel, onConfirm }) {
  return <div className="account-overlay" role="presentation"><section className="logout-dialog" role="dialog" aria-modal="true" aria-labelledby="logout-title"><span className="logout-dialog-icon"><Icons.Logout /></span><h2 id="logout-title">Are you sure you want to logout?</h2><p>Your current doctor session will be ended.</p><div><button className="secondary-action" onClick={onCancel}>Cancel</button><button className="primary-action danger-action" onClick={onConfirm}>Logout</button></div></section></div>
}

function PageHeading({ eyebrow, title, description, action }) {
  return <div className="page-heading"><div><p>{eyebrow}</p><h1>{title}</h1><span>{description}</span></div>{action}</div>
}

function Overview({ onSelectPatient, onQueue, queueItems }) {
  return <div className="workspace-content">
    <PageHeading eyebrow="MONDAY, 05 SEPTEMBER 2026" title="Good morning, Dr. Mehta" description="Here is what needs your attention today." action={<button className="primary-action" onClick={onQueue}><Icons.Users /> View patient queue</button>} />
    <div className="metric-grid"><Metric label="Patients today" value="24" change="+12%" icon={Icons.Users} tone="blue" /><Metric label="Waiting now" value={String(queueItems.filter((patient) => patient.status !== 'Completed').length)} change="Needs attention" icon={Icons.Clock} tone="orange" /><Metric label="Avg. wait time" value="11 min" change="-8%" icon={Icons.Activity} tone="teal" /><Metric label="Completed" value={String(queueItems.filter((patient) => patient.status === 'Completed').length)} change="Daily goal" icon={Icons.CheckCircle} tone="green" /></div>
    <div className="workspace-columns"><section className="surface-card queue-card"><div className="card-heading"><div><h2>Patient queue</h2><p>Review intake details before consultation.</p></div><button className="quiet-button" onClick={onQueue}>View all <Icons.ChevronRight /></button></div><div className="queue-list">{queueItems.slice(0, 3).map((patient) => <QueueRow key={patient.id} patient={patient} onClick={() => onSelectPatient(patient)} />)}</div></section><section className="surface-card activity-card"><div className="card-heading"><div><h2>Recent activity</h2><p>Updates from your workspace.</p></div><Icons.More /></div>{doctorActivity.map((item) => <div className="activity-row" key={item.title}><span className={`activity-dot ${item.tone}`} /><div><strong>{item.title}</strong><p>{item.detail}</p></div><time>{item.time}</time></div>)}</section></div>
  </div>
}

function Metric({ label, value, change, icon: Icon, tone }) { return <div className="metric-card"><span className={`metric-icon ${tone}`}><Icon /></span><p>{label}</p><strong>{value}</strong><small className={tone === 'orange' ? 'attention' : ''}>{change}</small></div> }
function QueueRow({ patient, onClick }) { return <button className="queue-row" onClick={onClick}><span className="patient-avatar">{patient.name.split(' ').map((part) => part[0]).join('')}</span><span className="patient-summary"><strong>{patient.name}</strong><small>{patient.age} yrs · {patient.gender} · {patient.id}</small></span><span className="patient-concern">{patient.concern}</span><span className={`queue-status ${patient.status.toLowerCase()}`}>{patient.status}</span></button> }

function downloadFile(filename, content, mimeType) {
  const file = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function originalDocumentContent(document) {
  return `MediKiosk Patient Intake\nIntake ID: MK-1048\n\nPatient information\nRahul Sharma · 32 years · Male\nMobile: 9876543210\n\nChief complaint\nFever and headache since yesterday\nPatient describes an acute onset of symptoms.\n\nMedical history\nNo known allergies reported\nCurrent medication: Paracetamol 500 mg as needed\n\nSubmitted through patient kiosk · ${document.uploaded}\n`
}

function LegacyPatientQueue({ selectedPatient, onSelectPatient, onOpenRecord }) {
  const [searchQuery, setSearchQuery] = useState('')
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredPatients = doctorQueue.filter((patient) => patient.name.toLowerCase().includes(normalizedQuery))

  return <div className="workspace-content"><PageHeading eyebrow="PATIENT MANAGEMENT" title="Patient queue" description="Review every intake before starting the consultation." action={<button className="secondary-action"><Icons.Download /> Export list</button>} /><div className="queue-toolbar"><div className="search-box"><Icons.Search /><input placeholder="Search patient name or ID" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} /></div><button className="filter-button">All patients <Icons.ChevronDown /></button><span>{filteredPatients.length} {filteredPatients.length === 1 ? 'patient' : 'patients'}</span></div><div className="patient-queue-layout"><section className="surface-card full-queue"><div className="table-heading"><span>Patient</span><span>Concern</span><span>Arrival</span><span>Status</span></div>{filteredPatients.map((patient) => <QueueRow key={patient.id} patient={patient} onClick={() => onSelectPatient(patient)} />)}{filteredPatients.length === 0 && <p className="empty-search-state">No patients found.</p>}</section><PatientDetail patient={selectedPatient} onOpenRecord={onOpenRecord} /></div></div>
}

function LegacyPatientDetail({ patient, onOpenRecord }) { return <aside className="surface-card patient-detail"><div className="detail-top"><span className="large-avatar">{patient.name.split(' ').map((part) => part[0]).join('')}</span><div><h2>{patient.name}</h2><p>{patient.age} years · {patient.gender}</p></div><button className="icon-action"><Icons.More /></button></div><div className="detail-id"><span>INTAKE ID</span><strong>{patient.id}</strong></div><div className="detail-section"><span>PRIMARY CONCERN</span><strong>{patient.concern}</strong><p>Patient submitted this concern through the kiosk intake form.</p></div><div className="detail-section"><span>INTAKE DETAILS</span><div className="detail-line"><b>Arrival time</b><em>{patient.time}</em></div><div className="detail-line"><b>Wait time</b><em>{patient.wait}</em></div></div><button className="primary-action detail-action" onClick={onOpenRecord}><Icons.Clipboard /> Open patient record</button></aside> }

function PatientQueue({ selectedPatient, onSelectPatient, onOpenRecord, queueItems }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const statuses = ['All', 'Ready', 'Waiting', 'Completed']
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredPatients = queueItems.filter((patient) => patient.name.toLowerCase().includes(normalizedQuery) && (statusFilter === 'All' || patient.status === statusFilter))
  const cycleFilter = () => setStatusFilter(statuses[(statuses.indexOf(statusFilter) + 1) % statuses.length])
  const exportPatients = () => downloadFile('medikiosk_patient_queue.txt', filteredPatients.map((patient) => `${patient.id} | ${patient.name} | ${patient.concern} | ${patient.status}`).join('\n'), 'text/plain;charset=utf-8')

  return <div className="workspace-content"><PageHeading eyebrow="PATIENT MANAGEMENT" title="Patient queue" description="Review every intake before starting the consultation." action={<button className="secondary-action" onClick={exportPatients}><Icons.Download /> Export list</button>} /><div className="queue-toolbar"><div className="search-box"><Icons.Search /><input placeholder="Search patient name or ID" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} /></div><button className="filter-button" onClick={cycleFilter} aria-label={`Filter patients, currently ${statusFilter}`}>{statusFilter} patients <Icons.ChevronDown /></button><span>{filteredPatients.length} {filteredPatients.length === 1 ? 'patient' : 'patients'}</span></div><div className="patient-queue-layout"><section className="surface-card full-queue"><div className="table-heading"><span>Patient</span><span>Concern</span><span>Arrival</span><span>Status</span></div>{filteredPatients.map((patient) => <QueueRow key={patient.id} patient={patient} onClick={() => onSelectPatient(patient)} />)}{filteredPatients.length === 0 && <p className="empty-search-state">No patients found.</p>}</section><PatientDetail patient={selectedPatient} onOpenRecord={onOpenRecord} /></div></div>
}

function PatientDetail({ patient, onOpenRecord }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return <aside className="surface-card patient-detail"><div className="detail-top"><span className="large-avatar">{patient.name.split(' ').map((part) => part[0]).join('')}</span><div><h2>{patient.name}</h2><p>{patient.age} years · {patient.gender}</p></div><div className="detail-menu-anchor"><button className="icon-action" aria-label="Patient actions" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><Icons.More /></button>{menuOpen && <div className="detail-action-menu"><button onClick={onOpenRecord}><Icons.FileText /> Open patient record</button><button onClick={() => setMenuOpen(false)}><Icons.Clipboard /> View intake details</button></div>}</div></div><div className="detail-id"><span>INTAKE ID</span><strong>{patient.id}</strong></div><div className="detail-section"><span>PRIMARY CONCERN</span><strong>{patient.concern}</strong><p>Patient submitted this concern through the kiosk intake form.</p></div><div className="detail-section"><span>INTAKE DETAILS</span><div className="detail-line"><b>Arrival time</b><em>{patient.time}</em></div><div className="detail-line"><b>Wait time</b><em>{patient.wait}</em></div></div><button className="primary-action detail-action" onClick={onOpenRecord}><Icons.Clipboard /> Open patient record</button></aside>
}

function WorkflowHeading({ eyebrow, title, description, step, onBack }) {
  return <PageHeading eyebrow={eyebrow} title={title} description={description} action={<div className="workflow-step"><span>STEP {step} OF 4</span><button className="quiet-button" onClick={onBack}><Icons.ArrowLeft /> Back</button></div>} />
}

function WorkflowFooter({ nextLabel, onNext }) {
  return <div className="workflow-footer"><span><Icons.Lock /> Patient data is protected and ready for review</span><button className="primary-action" onClick={onNext}>{nextLabel}<Icons.ArrowRight /></button></div>
}

function LegacyOriginalDocumentScreen({ onNext }) {
  const recordDocument = mockClinicalRecord.document
  const handleDownload = () => downloadFile('Rahul_Sharma_intake.txt', originalDocumentContent(recordDocument), 'text/plain;charset=utf-8')

  return <div className="workspace-content"><WorkflowHeading eyebrow="PATIENT RECORD · MK-1048" title="Original documents" description="Review the source document submitted through the patient kiosk." step="1" onBack={() => {}} /><div className="document-layout"><section className="surface-card document-preview"><div className="document-toolbar"><span><Icons.FileText /> {recordDocument.name}</span><div><button className="icon-action" aria-label="Download document" onClick={handleDownload}><Icons.Download /></button><button className="icon-action" aria-label="More document actions"><Icons.More /></button></div></div><div className="document-sheet"><div className="document-sheet-head"><strong>MediKiosk Patient Intake</strong><span>INTAKE ID: MK-1048</span></div><div className="document-line wide" /><div className="document-line" /><div className="document-line short" /><div className="document-block"><span>Patient information</span><b>Rahul Sharma · 32 years · Male</b><p>Mobile: 9876543210</p></div><div className="document-block"><span>Chief complaint</span><b>Fever and headache since yesterday</b><p>Patient describes an acute onset of symptoms.</p></div><div className="document-block"><span>Medical history</span><b>No known allergies reported</b><p>Current medication: Paracetamol 500 mg as needed</p></div><div className="document-signature">Submitted through patient kiosk · {recordDocument.uploaded}</div></div></section><aside className="surface-card document-meta"><span className="status-pill processed"><Icons.Check /> {recordDocument.status}</span><h2>Source document</h2><p>Uploaded by the patient and processed for clinical review.</p><div className="meta-row"><span>Document type</span><strong>{recordDocument.type}</strong></div><div className="meta-row"><span>Pages</span><strong>{recordDocument.pages} pages</strong></div><div className="meta-row"><span>File size</span><strong>{recordDocument.size}</strong></div><div className="meta-row"><span>Uploaded</span><strong>{recordDocument.uploaded}</strong></div><div className="processing-note"><Icons.Sparkles /><span>Text extraction completed<br /><small>Ready to verify against the original</small></span></div></aside></div><WorkflowFooter nextLabel="Review extracted information" onNext={onNext} /></div>
}

function OriginalDocuments({ onNext }) {
  const recordDocument = mockClinicalRecord.document
  const handleDownload = () => downloadFile('Rahul_Sharma_intake.txt', originalDocumentContent(recordDocument), 'text/plain;charset=utf-8')
  return <div className="workspace-content"><WorkflowHeading eyebrow="PATIENT RECORD · MK-1048" title="Original documents" description="Review the source document submitted through the patient kiosk." step="1" onBack={() => {}} /><div className="document-layout"><section className="surface-card document-preview"><div className="document-toolbar"><span><Icons.FileText /> {recordDocument.name}</span><div><button className="icon-action" aria-label="Download document" onClick={handleDownload}><Icons.Download /></button><button className="icon-action" aria-label="More document actions" onClick={handleDownload}><Icons.More /></button></div></div><div className="document-sheet"><div className="document-sheet-head"><strong>MediKiosk Patient Intake</strong><span>INTAKE ID: MK-1048</span></div><div className="document-line wide" /><div className="document-line" /><div className="document-line short" /><div className="document-block"><span>Patient information</span><b>Rahul Sharma · 32 years · Male</b><p>Mobile: 9876543210</p></div><div className="document-block"><span>Chief complaint</span><b>Fever and headache since yesterday</b><p>Patient describes an acute onset of symptoms.</p></div><div className="document-block"><span>Medical history</span><b>No known allergies reported</b><p>Current medication: Paracetamol 500 mg as needed</p></div><div className="document-signature">Submitted through patient kiosk · {recordDocument.uploaded}</div></div></section><aside className="surface-card document-meta"><span className="status-pill processed"><Icons.Check /> {recordDocument.status}</span><h2>Source document</h2><p>Uploaded by the patient and processed for clinical review.</p><div className="meta-row"><span>Document type</span><strong>{recordDocument.type}</strong></div><div className="meta-row"><span>Pages</span><strong>{recordDocument.pages} pages</strong></div><div className="meta-row"><span>File size</span><strong>{recordDocument.size}</strong></div><div className="meta-row"><span>Uploaded</span><strong>{recordDocument.uploaded}</strong></div><div className="processing-note"><Icons.Sparkles /><span>Text extraction completed<br /><small>Ready to verify against the original</small></span></div></aside></div><WorkflowFooter nextLabel="Review extracted information" onNext={onNext} /></div>
}

function ExtractedInformation({ fields, onFieldsChange, focusField, onFocusHandled, onNext, onBack }) {
  const [editingLabel, setEditingLabel] = useState(null)
  const [draftValue, setDraftValue] = useState('')

  useEffect(() => {
    if (focusField) {
      const field = fields.find((item) => item.label === focusField)
      if (field) {
        setEditingLabel(field.label)
        setDraftValue(field.value)
      }
      onFocusHandled()
    }
  }, [fields, focusField, onFocusHandled])

  const startEditing = (field) => {
    setEditingLabel(field.label)
    setDraftValue(field.value)
  }

  const saveField = (label) => {
    onFieldsChange((current) => current.map((field) => field.label === label ? { ...field, value: draftValue, doctorEdited: true } : field))
    setEditingLabel(null)
  }

  return <div className="workspace-content"><WorkflowHeading eyebrow="PATIENT RECORD · MK-1048" title="Extracted information" description="AI-extracted fields from the original patient document." step="2" onBack={onBack} /><div className="extracted-layout"><section className="surface-card extracted-card"><div className="card-heading"><div><h2>Recognized patient information</h2><p>Review the extracted values before comparison.</p></div><span className="status-pill processed"><Icons.Check /> 7 fields found</span></div><div className="extracted-list">{fields.map((field) => <div className="extracted-row" key={field.label}><div><span>{field.label}</span>{editingLabel === field.label ? <input className="extracted-edit-input" aria-label={`Edit value for ${field.label}`} value={draftValue} onChange={(event) => setDraftValue(event.target.value)} /> : <strong>{field.value}</strong>}<small><Icons.FileText /> {field.source} {field.doctorEdited && <em className="doctor-edited">Doctor Edited</em>}</small></div><span className="confidence"><i style={{ width: `${field.confidence}%` }} />{field.confidence}%</span>{editingLabel === field.label ? <button className="icon-action" aria-label={`Save ${field.label}`} onClick={() => saveField(field.label)}><Icons.Check /></button> : <button className="icon-action" aria-label={`Edit ${field.label}`} onClick={() => startEditing(field)}><Icons.Edit /></button>}</div>)}</div></section><aside className="surface-card extraction-summary"><span className="summary-icon"><Icons.Scan /></span><h2>Extraction quality</h2><strong>94.7%</strong><p>Average confidence across recognized fields</p><div className="quality-bar"><span /></div><div className="quality-row"><span>High confidence</span><b>5 fields</b></div><div className="quality-row"><span>Needs review</span><b>2 fields</b></div></aside></div><WorkflowFooter nextLabel="Compare with original" onNext={onNext} /></div>
}

function CompareInformation({ fields, hasComparison, onNext, onBack, onReviewField }) {
  if (!hasComparison) {
    return <div className="workspace-content"><WorkflowHeading eyebrow="PATIENT RECORD · SELECTED PATIENT" title="Compare information" description="Validate extracted values against the original document." step="3" onBack={onBack} /><section className="surface-card comparison-empty-state"><span className="summary-icon"><Icons.GitCompare /></span><h2>No previous comparison is available for this patient.</h2><p>Complete document extraction and verification before comparing this patient's information.</p><button className="primary-action" onClick={onBack}><Icons.ArrowLeft /> Back to extracted information</button></section></div>
  }
  const comparisonRows = mockClinicalRecord.comparison.map((item) => ({ ...item, extracted: fields.find((field) => field.label === item.field)?.value || item.extracted }))
  return <div className="workspace-content"><WorkflowHeading eyebrow="PATIENT RECORD · MK-1048" title="Compare information" description="Validate extracted values against the original document." step="3" onBack={onBack} /><div className="comparison-card surface-card"><div className="comparison-header"><span>FIELD</span><span>ORIGINAL DOCUMENT</span><span>EXTRACTED INFORMATION</span><span>STATUS</span></div>{comparisonRows.map((item) => <div className="comparison-row" key={item.field}><strong>{item.field}</strong><span>{item.original}</span><span>{item.extracted}</span><span className={`comparison-status ${item.status}`}><Icons.Check /> {item.status === 'match' ? 'Match' : 'Review'}</span></div>)}</div><div className="comparison-callout"><Icons.AlertCircle /><span><strong>One field needs a quick review.</strong> Medication formatting differs slightly, but the meaning appears consistent.</span><button className="quiet-button" onClick={onReviewField}><Icons.Edit /> Review field</button></div><WorkflowFooter nextLabel="Generate clinical summary" onNext={onNext} /></div>
}

function LegacyClinicalSummaryActions({ onBack }) {
  const { summary } = mockClinicalRecord
  const summaryContent = `MediKiosk Clinical Summary\nPatient: Rahul Sharma\nAge: 32 years\nGender: Male\nIntake ID: MK-1048\n\nClinical overview\n${summary.overview}\n\nKey findings\n${summary.keyFindings.map((item) => `- ${item}`).join('\n')}\n\nSuggested checks\n${summary.suggestedChecks.map((item) => `- ${item}`).join('\n')}\n\nGenerated from verified patient intake\n${summary.generatedAt}\n`
  const handleDownload = () => downloadFile('Rahul_Sharma_clinical_summary.txt', summaryContent, 'text/plain;charset=utf-8')

  return <div className="workspace-content"><WorkflowHeading eyebrow="PATIENT RECORD · MK-1048" title="Clinical summary" description="A concise review of the patient's submitted information." step="4" onBack={onBack} /><div className="summary-layout"><section className="surface-card clinical-summary-card"><div className="summary-card-top"><div><span className="status-pill ready"><Icons.Check /> Verified record</span><h2>Rahul Sharma</h2><p>32 years · Male · MK-1048</p></div><button className="secondary-action" onClick={handleDownload}><Icons.Download /> Download summary</button></div><div className="summary-overview"><span>CLINICAL OVERVIEW</span><p>{summary.overview}</p></div><div className="summary-columns"><SummaryList title="Key findings" items={summary.keyFindings} /><SummaryList title="Suggested checks" items={summary.suggestedChecks} /></div><div className="summary-signoff"><span>Generated from verified patient intake</span><time>{summary.generatedAt}</time></div></section><aside className="surface-card next-actions"><h2>Next actions</h2><p>This summary is ready to support your consultation.</p><button className="primary-action"><Icons.Clipboard /> Start consultation</button><button className="secondary-action"><Icons.Edit /> Add doctor notes</button><button className="quiet-button" onClick={onBack}><Icons.GitCompare /> Re-open comparison</button></aside></div></div>
}

function ClinicalSummary({ patient, savedNote, onStartConsultation, onAddNotes, onReopenComparison, onBack }) {
  const { summary } = mockClinicalRecord
  const patientOverview = patient.id === mockClinicalRecord.patientId
    ? summary.overview
    : `${patient.name} is a ${patient.age}-year-old ${patient.gender} presenting with ${patient.concern.toLowerCase()}.`
  const summaryContent = `MediKiosk Clinical Summary\nPatient: ${patient.name}\nAge: ${patient.age} years\nGender: ${patient.gender}\nIntake ID: ${patient.id}\n\nClinical overview\n${patientOverview}\n\nDoctor notes\n${savedNote || 'No doctor notes added.'}\n\nKey findings\n${summary.keyFindings.map((item) => `- ${item}`).join('\n')}\n\nSuggested checks\n${summary.suggestedChecks.map((item) => `- ${item}`).join('\n')}\n\nGenerated from verified patient intake\n${summary.generatedAt}\n`
  const handleDownload = () => downloadFile(`${patient.name.replace(/\s+/g, '_')}_clinical_summary.txt`, summaryContent, 'text/plain;charset=utf-8')

  return <div className="workspace-content"><WorkflowHeading eyebrow={`PATIENT RECORD · ${patient.id}`} title="Clinical summary" description="A concise review of the patient's submitted information." step="4" onBack={onBack} /><div className="summary-layout"><section className="surface-card clinical-summary-card"><div className="summary-card-top"><div><span className="status-pill ready"><Icons.Check /> Verified record</span><h2>{patient.name}</h2><p>{patient.age} years · {patient.gender} · {patient.id}</p></div><button className="secondary-action" onClick={handleDownload}><Icons.Download /> Download summary</button></div><div className="summary-overview"><span>CLINICAL OVERVIEW</span><p>{patientOverview}</p></div>{savedNote && <div className="summary-overview doctor-note-preview"><span>DOCTOR NOTES</span><p>{savedNote}</p></div>}<div className="summary-columns"><SummaryList title="Key findings" items={summary.keyFindings} /><SummaryList title="Suggested checks" items={summary.suggestedChecks} /></div><div className="summary-signoff"><span>Generated from verified patient intake</span><time>{summary.generatedAt}</time></div></section><aside className="surface-card next-actions"><h2>Next actions</h2><p>This summary is ready to support your consultation.</p><button className="primary-action" onClick={onStartConsultation}><Icons.Clipboard /> Start consultation</button><button className="secondary-action" onClick={onAddNotes}><Icons.Edit /> {savedNote ? 'Edit doctor notes' : 'Add doctor notes'}</button><button className="quiet-button" onClick={onReopenComparison}><Icons.GitCompare /> Re-open comparison</button></aside></div></div>
}

function Consultation({ patient, note, onBack }) {
  return <div className="workspace-content"><PageHeading eyebrow={`CONSULTATION · ${patient.id}`} title={`Consultation with ${patient.name}`} description="Review the patient context and record the consultation outcome." action={<button className="secondary-action" onClick={onBack}><Icons.ArrowLeft /> Back to summary</button>} /><div className="consultation-layout"><section className="surface-card consultation-card"><div className="consultation-patient"><span className="large-avatar">{patient.name.split(' ').map((part) => part[0]).join('')}</span><div><h2>{patient.name}</h2><p>{patient.age} years · {patient.gender} · {patient.concern}</p></div><span className="status-pill ready">In consultation</span></div><div className="consultation-section"><span>INTAKE SUMMARY</span><p>{patient.concern} reported through the patient kiosk. Review the verified intake and document your clinical assessment.</p></div><div className="consultation-section"><span>DOCTOR NOTES</span><p>{note || 'No doctor notes have been saved for this patient yet.'}</p></div><button className="primary-action" onClick={onBack}><Icons.Check /> Complete consultation</button></section></div></div>
}

function DoctorNotesEditor({ patient, initialNote, onCancel, onSave }) {
  const [note, setNote] = useState(initialNote)
  return <div className="account-overlay" role="presentation"><section className="notes-dialog" role="dialog" aria-modal="true" aria-labelledby="doctor-notes-title"><button className="dialog-close" aria-label="Close doctor notes" onClick={onCancel}>×</button><p className="login-kicker">PATIENT RECORD · {patient.id}</p><h2 id="doctor-notes-title">Doctor notes</h2><p className="account-dialog-description">Add notes for {patient.name}. Saved notes remain available from this patient's summary.</p><label className="notes-label" htmlFor="doctor-notes-input">Clinical notes</label><textarea id="doctor-notes-input" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Enter consultation notes..." rows="7" /><div className="notes-actions"><button className="secondary-action" onClick={onCancel}>Cancel</button><button className="primary-action" onClick={() => onSave(note)}>Save notes</button></div></section></div>
}

function LegacyOriginalDocuments({ onNext }) {
  const { document } = mockClinicalRecord
  const handleDownload = () => downloadFile(document.name.replace(/\.pdf$/i, '.txt'), originalDocumentContent(document), 'text/plain;charset=utf-8')
  return <div className="workspace-content"><WorkflowHeading eyebrow="PATIENT RECORD · MK-1048" title="Original documents" description="Review the source document submitted through the patient kiosk." step="1" onBack={() => {}} /><div className="document-layout"><section className="surface-card document-preview"><div className="document-toolbar"><span><Icons.FileText /> {document.name}</span><div><button className="icon-action" aria-label="Download document"><Icons.Download /></button><button className="icon-action" aria-label="More document actions"><Icons.More /></button></div></div><div className="document-sheet"><div className="document-sheet-head"><strong>MediKiosk Patient Intake</strong><span>INTAKE ID: MK-1048</span></div><div className="document-line wide" /><div className="document-line" /><div className="document-line short" /><div className="document-block"><span>Patient information</span><b>Rahul Sharma · 32 years · Male</b><p>Mobile: 9876543210</p></div><div className="document-block"><span>Chief complaint</span><b>Fever and headache since yesterday</b><p>Patient describes an acute onset of symptoms.</p></div><div className="document-block"><span>Medical history</span><b>No known allergies reported</b><p>Current medication: Paracetamol 500 mg as needed</p></div><div className="document-signature">Submitted through patient kiosk · {document.uploaded}</div></div></section><aside className="surface-card document-meta"><span className="status-pill processed"><Icons.Check /> {document.status}</span><h2>Source document</h2><p>Uploaded by the patient and processed for clinical review.</p><div className="meta-row"><span>Document type</span><strong>{document.type}</strong></div><div className="meta-row"><span>Pages</span><strong>{document.pages} pages</strong></div><div className="meta-row"><span>File size</span><strong>{document.size}</strong></div><div className="meta-row"><span>Uploaded</span><strong>{document.uploaded}</strong></div><div className="processing-note"><Icons.Sparkles /><span>Text extraction completed<br /><small>Ready to verify against the original</small></span></div></aside></div><WorkflowFooter nextLabel="Review extracted information" onNext={onNext} /></div>
}

function LegacyExtractedInformation({ onNext, onBack }) {
  return <div className="workspace-content"><WorkflowHeading eyebrow="PATIENT RECORD · MK-1048" title="Extracted information" description="AI-extracted fields from the original patient document." step="2" onBack={onBack} /><div className="extracted-layout"><section className="surface-card extracted-card"><div className="card-heading"><div><h2>Recognized patient information</h2><p>Review the extracted values before comparison.</p></div><span className="status-pill processed"><Icons.Check /> 7 fields found</span></div><div className="extracted-list">{mockClinicalRecord.extracted.map((field) => <div className="extracted-row" key={field.label}><div><span>{field.label}</span><strong>{field.value}</strong><small><Icons.FileText /> {field.source}</small></div><span className="confidence"><i style={{ width: `${field.confidence}%` }} />{field.confidence}%</span><button className="icon-action" aria-label={`Edit ${field.label}`}><Icons.Edit /></button></div>)}</div></section><aside className="surface-card extraction-summary"><span className="summary-icon"><Icons.Scan /></span><h2>Extraction quality</h2><strong>94.7%</strong><p>Average confidence across recognized fields</p><div className="quality-bar"><span /></div><div className="quality-row"><span>High confidence</span><b>5 fields</b></div><div className="quality-row"><span>Needs review</span><b>2 fields</b></div></aside></div><WorkflowFooter nextLabel="Compare with original" onNext={onNext} /></div>
}

function LegacyCompareInformation({ onNext, onBack }) {
  return <div className="workspace-content"><WorkflowHeading eyebrow="PATIENT RECORD · MK-1048" title="Compare information" description="Validate extracted values against the original document." step="3" onBack={onBack} /><div className="comparison-card surface-card"><div className="comparison-header"><span>FIELD</span><span>ORIGINAL DOCUMENT</span><span>EXTRACTED INFORMATION</span><span>STATUS</span></div>{mockClinicalRecord.comparison.map((item) => <div className="comparison-row" key={item.field}><strong>{item.field}</strong><span>{item.original}</span><span>{item.extracted}</span><span className={`comparison-status ${item.status}`}><Icons.Check /> {item.status === 'match' ? 'Match' : 'Review'}</span></div>)}</div><div className="comparison-callout"><Icons.AlertCircle /><span><strong>One field needs a quick review.</strong> Medication formatting differs slightly, but the meaning appears consistent.</span><button className="quiet-button">Review field</button></div><WorkflowFooter nextLabel="Generate clinical summary" onNext={onNext} /></div>
}

function LegacyClinicalSummary({ onBack }) {
  const { summary } = mockClinicalRecord
  return <div className="workspace-content"><WorkflowHeading eyebrow="PATIENT RECORD · MK-1048" title="Clinical summary" description="A concise review of the patient's submitted information." step="4" onBack={onBack} /><div className="summary-layout"><section className="surface-card clinical-summary-card"><div className="summary-card-top"><div><span className="status-pill ready"><Icons.Check /> Verified record</span><h2>Rahul Sharma</h2><p>32 years · Male · MK-1048</p></div><button className="secondary-action"><Icons.Download /> Download summary</button></div><div className="summary-overview"><span>CLINICAL OVERVIEW</span><p>{summary.overview}</p></div><div className="summary-columns"><SummaryList title="Key findings" items={summary.keyFindings} /><SummaryList title="Suggested checks" items={summary.suggestedChecks} /></div><div className="summary-signoff"><span>Generated from verified patient intake</span><time>{summary.generatedAt}</time></div></section><aside className="surface-card next-actions"><h2>Next actions</h2><p>This summary is ready to support your consultation.</p><button className="primary-action"><Icons.Clipboard /> Start consultation</button><button className="secondary-action"><Icons.Edit /> Add doctor notes</button><button className="quiet-button" onClick={onBack}><Icons.GitCompare /> Re-open comparison</button></aside></div></div>
}

function SummaryList({ title, items }) { return <div className="summary-list"><span>{title}</span>{items.map((item) => <p key={item}><Icons.CheckCircle /> {item}</p>)}</div> }
function Reports() { return <div className="workspace-content"><PageHeading eyebrow="INSIGHTS" title="Reports" description="Understand your clinic's intake and consultation trends." /><div className="report-grid"><div className="surface-card report-large"><h2>Patient volume</h2><p>Consultations completed this week</p><div className="fake-chart"><span style={{ height: '48%' }} /><span style={{ height: '67%' }} /><span style={{ height: '54%' }} /><span style={{ height: '82%' }} /><span style={{ height: '72%' }} /><span style={{ height: '94%' }} /><span style={{ height: '76%' }} /></div><div className="chart-labels"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div><div className="surface-card report-summary"><h2>This month</h2><strong>186</strong><p>total patient intakes</p><div className="report-rule" /><span className="report-up">↑ 14.8%</span><small>compared with last month</small></div></div></div> }
function Settings({ doctor, onSave }) {
  const [profile, setProfile] = useState(doctor)
  const [saved, setSaved] = useState(false)
  const updateProfile = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }))
    setSaved(false)
  }
  const saveProfile = () => {
    onSave({ ...profile, initials: profile.name.split(/[ .]/).filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase() })
    setSaved(true)
  }
  return <div className="workspace-content"><PageHeading eyebrow="PREFERENCES" title="Settings" description="Manage your workspace and notification preferences." /><div className="surface-card settings-card"><h2>Profile details</h2><p>These details are shown to your clinic team.</p><label>Full name<input value={profile.name} onChange={(event) => updateProfile('name', event.target.value)} /></label><label>Specialty<input value={profile.specialty} onChange={(event) => updateProfile('specialty', event.target.value)} /></label><label>Clinic<input value={profile.clinic} onChange={(event) => updateProfile('clinic', event.target.value)} /></label><button className="primary-action" onClick={saveProfile}>{saved ? 'Changes saved' : 'Save changes'}</button></div></div>
}

export default DoctorDashboard