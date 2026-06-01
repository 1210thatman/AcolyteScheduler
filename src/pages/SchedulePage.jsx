import { AutoScheduler } from '../components/AutoScheduler'

export default function SchedulePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">자동 배정</h1>
      <AutoScheduler />
    </div>
  )
}
