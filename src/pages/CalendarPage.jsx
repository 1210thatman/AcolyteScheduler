import { useScheduler } from '../hooks/useScheduler'
import { CalendarView } from '../components/CalendarView'

export default function CalendarPage() {
  const { state, setMonth } = useScheduler()
  const { currentYear, currentMonth, assignments } = state

  function handlePrevMonth() {
    if (currentMonth === 1) {
      setMonth(currentYear - 1, 12)
    } else {
      setMonth(currentYear, currentMonth - 1)
    }
  }

  function handleNextMonth() {
    if (currentMonth === 12) {
      setMonth(currentYear + 1, 1)
    } else {
      setMonth(currentYear, currentMonth + 1)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {currentYear}년 {currentMonth}월
        </h1>
        <div className="flex gap-2">
          <button
            className="min-h-[48px] px-4 py-3 bg-gray-200 text-gray-800 text-base font-semibold rounded-lg"
            onClick={handlePrevMonth}
          >
            이전
          </button>
          <button
            className="min-h-[48px] px-4 py-3 bg-gray-200 text-gray-800 text-base font-semibold rounded-lg"
            onClick={handleNextMonth}
          >
            다음
          </button>
        </div>
      </div>

      {assignments.length === 0 ? (
        <p className="text-center text-gray-500 py-16 text-base">
          배정된 일정이 없습니다. 자동 배정 탭에서 먼저 배정을 실행해주세요.
        </p>
      ) : (
        <CalendarView />
      )}
    </div>
  )
}
