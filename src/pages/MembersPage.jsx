import { MemberManager } from '../components/MemberManager'
import { UnavailableDatePicker } from '../components/UnavailableDatePicker'

export default function MembersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">단원 관리</h1>
        <MemberManager />
      </div>

      <hr className="border-gray-200" />

      <UnavailableDatePicker />
    </div>
  )
}
