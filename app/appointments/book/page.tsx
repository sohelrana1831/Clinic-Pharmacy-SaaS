'use client'

import { PublicBookingWidget } from '@/components/appointments/public-booking-widget'
import { AppointmentBooking } from '@/lib/appointments-data'

export default function BookAppointmentPage() {
  const handleBookingComplete = (booking: AppointmentBooking) => {
    console.log('Booking completed:', booking)
    // In a real app, this would save to database and send SMS
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <PublicBookingWidget onBookingComplete={handleBookingComplete} />
        </div>
      </div>
    </div>
  )
}
