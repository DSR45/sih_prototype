import { doctorQueue, mockClinicalRecord, mockDoctor } from '../../../data/mockData'

export function getDefaultDoctorState() {
  return {
    doctor: { ...mockDoctor },
    queue: [...doctorQueue],
    activity: [
      { title: 'Patient intake completed', detail: 'Rahul Sharma submitted symptoms', time: '2 min ago', tone: 'teal' },
      { title: 'New patient in queue', detail: 'Priya Nair is ready for review', time: '10 min ago', tone: 'blue' },
      { title: 'Consultation completed', detail: "Sunita Rao's notes were saved", time: '28 min ago', tone: 'green' }
    ],
    clinicalRecord: JSON.parse(JSON.stringify(mockClinicalRecord))
  }
}

export function getSelectedPatient(queue = []) {
  return queue[0] || null
}
