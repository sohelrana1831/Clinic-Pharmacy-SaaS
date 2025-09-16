import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Clinic & Pharmacy Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Complete solution for clinic and pharmacy management
          </p>
          <div className="space-x-4">
            <Link href="/auth/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block">
              Login
            </Link>
            <Link href="/auth/signup" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 inline-block">
              Sign Up
            </Link>
            <Link href="/dashboard" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 inline-block">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
