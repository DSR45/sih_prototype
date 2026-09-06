import { supabaseDoctorAdapter } from '../../shared/services/supabaseAdapter'

const mockDoctor = {
  name: 'Dr. Ananya Mehta',
  specialty: 'General Medicine',
  clinic: 'MediKiosk Care Centre',
  initials: 'AM'
}

const mockDoctorQueue = [
  { id: 'MK-1048', name: 'Rahul Sharma', age: 32, gender: 'Male', concern: 'Fever and headache', wait: 'Now', status: 'Ready', severity: 'moderate', time: '10:24 AM' },
  { id: 'MK-1047', name: 'Priya Nair', age: 28, gender: 'Female', concern: 'Persistent cough', wait: '8 min', status: 'Waiting', severity: 'low', time: '10:16 AM' }
]

export async function getDoctorProfile() {
  try {
    const doctor = await supabaseDoctorAdapter.getDoctorProfile()
    return doctor || { ...mockDoctor }
  } catch (error) {
    console.warn('Supabase doctor profile fetch failed; using local fallback.', error)
    return { ...mockDoctor }
  }
}

export async function getDoctorQueueData() {
  try {
    const queue = await supabaseDoctorAdapter.getQueue()
    return queue.length ? queue : [...mockDoctorQueue]
  } catch (error) {
    console.warn('Supabase queue fetch failed; using local fallback.', error)
    return [...mockDoctorQueue]
  }
}

export function getDoctorActivityFeed() {
  return [
    { title: 'Patient intake completed', detail: 'Rahul Sharma submitted symptoms', time: '2 min ago', tone: 'teal' },
    { title: 'New patient in queue', detail: 'Priya Nair is ready for review', time: '10 min ago', tone: 'blue' }
  ]
}

export function getClinicalRecord() {
  return {
    patientId: 'MK-1048',
    document: {
      name: 'Rahul_Sharma_intake.pdf',
      type: 'Patient intake document',
      uploaded: 'Today, 10:24 AM',
      pages: 2,
      size: '248 KB',
      status: 'Processed'
    },
    extracted: [
      { label: 'Patient name', value: 'Rahul Sharma', confidence: 99, source: 'Page 1 · Header' }
    ],
    summary: {
      overview: 'Rahul Sharma is a 32-year-old male presenting with fever and headache.',
      keyFindings: ['Acute fever with headache'],
      suggestedChecks: ['Record current temperature'],
      generatedAt: 'Today, 10:26 AM'
    }
  }
}

export async function getDoctorDashboardState() {
  const [doctor, queue, activity, clinicalRecord] = await Promise.all([
    getDoctorProfile(),
    getDoctorQueueData(),
    Promise.resolve(getDoctorActivityFeed()),
    Promise.resolve(getClinicalRecord())
  ])

  return {
    doctor,
    queue,
    activity,
    clinicalRecord
  }
}
