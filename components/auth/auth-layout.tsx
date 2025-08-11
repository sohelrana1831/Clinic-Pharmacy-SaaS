import { Card } from "@/components/ui/card"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
        <Card className="p-6 shadow-lg">
          {children}
        </Card>
      </div>
    </div>
  )
}
