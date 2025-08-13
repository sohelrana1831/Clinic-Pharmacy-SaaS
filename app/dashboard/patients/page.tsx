'use client'

import { useState } from 'react'
import { PatientsTable } from '@/components/patients/patients-table'
import { PatientProfile } from '@/components/patients/patient-profile'
import { PatientFormModal } from '@/components/patients/patient-form-modal'
import { PrescriptionModal } from '@/components/patients/prescription-modal'
import { NewAppointmentModal } from '@/components/modals/modal'
import { samplePatients, sampleAppointments, samplePrescriptions, Patient } from '@/lib/patients-data'

export default function PatientsPage() {
  const [patients, setPatients] = useState(samplePatients)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
  const [prescriptionPatient, setPrescriptionPatient] = useState<Patient | null>(null)
  const [view, setView] = useState<'table' | 'profile'>('table')

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setView('profile')
  }

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient)
  }

  const handleAddPatient = () => {
    setEditingPatient(null)
    setShowAddModal(true)
  }

  const handleSavePatient = (patientData: Omit<Patient, 'id' | 'createdAt'>) => {
    if (editingPatient) {
      // Update existing patient
      setPatients(prev => prev.map(p => 
        p.id === editingPatient.id 
          ? { ...patientData, id: editingPatient.id, createdAt: editingPatient.createdAt }
          : p
      ))
    } else {
      // Add new patient
      const newPatient: Patient = {
        ...patientData,
        id: `P${String(patients.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString()
      }
      setPatients(prev => [...prev, newPatient])
    }
    setEditingPatient(null)
    setShowAddModal(false)
  }

  const handleBackToTable = () => {
    setView('table')
    setSelectedPatient(null)
  }

  const handleNewAppointment = () => {
    setShowAppointmentModal(true)
  }

  const handleNewPrescription = () => {
    // Open prescription modal for selected patient
    if (selectedPatient) {
      setPrescriptionPatient(selectedPatient)
      setShowPrescriptionModal(true)
    } else {
      // Navigate to prescription creation page if no patient selected
      window.location.href = '/prescriptions/editor'
    }
  }

  // Get appointments and prescriptions for selected patient
  const patientAppointments = selectedPatient 
    ? sampleAppointments.filter(apt => apt.patientId === selectedPatient.id)
    : []
  
  const patientPrescriptions = selectedPatient
    ? samplePrescriptions.filter(pres => pres.patientId === selectedPatient.id)
    : []

  return (
    <div className="min-h-screen bg-theme-background flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <Topbar />
        
        {/* Page Content */}
        <main className="flex-1 p-6 bg-theme-background">
          {view === 'table' ? (
            <PatientsTable
              patients={patients}
              onViewPatient={handleViewPatient}
              onEditPatient={handleEditPatient}
              onAddPatient={handleAddPatient}
            />
          ) : (
            selectedPatient && (
              <PatientProfile
                patient={selectedPatient}
                appointments={patientAppointments}
                prescriptions={patientPrescriptions}
                onBack={handleBackToTable}
                onNewAppointment={handleNewAppointment}
                onNewPrescription={handleNewPrescription}
              />
            )
          )}
        </main>
      </div>

      {/* Modals */}
      <PatientFormModal
        isOpen={showAddModal || !!editingPatient}
        onClose={() => {
          setShowAddModal(false)
          setEditingPatient(null)
        }}
        patient={editingPatient}
        onSave={handleSavePatient}
      />

      <NewAppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
      />

      <PrescriptionModal
        isOpen={showPrescriptionModal}
        onClose={() => {
          setShowPrescriptionModal(false)
          setPrescriptionPatient(null)
        }}
        patient={prescriptionPatient}
      />
    </div>
  )
}
