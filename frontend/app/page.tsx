"use client"
import { AuthForms } from "../components/auth-forms"
import { AdminPanel } from "../components/admin-panel"
import { useApiStore } from "@/hooks/use-api-store"

function AppContent() {
  const user = useApiStore((state) => state.user)

  return user ? <AdminPanel /> : <AuthForms />
}

export default function App() {
  return (
    <AppContent />
  )
}
