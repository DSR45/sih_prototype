import { useMemo } from 'react'
import { createPatientSessionDraft } from '../services/mockPatientService'

export function usePatientSession(patientData) {
  return useMemo(() => {
    return createPatientSessionDraft(patientData)
  }, [patientData])
}
