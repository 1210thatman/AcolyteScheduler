import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SchedulerProvider } from './context/SchedulerContext'
import { Header } from './components/Header'
import CalendarPage from './pages/CalendarPage'
import MembersPage from './pages/MembersPage'
import SchedulePage from './pages/SchedulePage'

export default function App() {
  return (
    <SchedulerProvider>
      <BrowserRouter>
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<CalendarPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </SchedulerProvider>
  )
}
