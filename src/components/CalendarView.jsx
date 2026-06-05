import { useScheduler } from '../hooks/useScheduler'

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

const DAY_HEADER_COLORS = [
  'text-red-500',
  'text-gray-500',
  'text-gray-500',
  'text-gray-500',
  'text-gray-500',
  'text-gray-500',
  'text-blue-500',
]

function getDayTextColor(dayOfWeek) {
  if (dayOfWeek === 0) return 'text-red-500'
  if (dayOfWeek === 6) return 'text-blue-500'
  return 'text-gray-900'
}

function getCalendarDays(year, month) {
  const firstDayOfMonth = new Date(year, month - 1, 1)
  const daysInMonth = new Date(year, month, 0).getDate()
  const startWeekday = firstDayOfMonth.getDay()

  const days = []
  for (let i = 0; i < startWeekday; i++) {
    days.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(month).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    days.push(`${year}-${mm}-${dd}`)
  }
  return days
}

export function CalendarView({ onDateClick }) {
  const { state } = useScheduler()
  const { members, assignments, currentYear, currentMonth } = state

  const calendarDays = getCalendarDays(currentYear, currentMonth)

  function getAssignment(dateStr) {
    return assignments.find(a => a.date === dateStr) || null
  }

  function getMemberName(id) {
    if (!id) return null
    const member = members.find(m => m.id === id)
    return member ? member.name : null
  }

  function handleCellClick(dateStr) {
    if (onDateClick) onDateClick(dateStr)
  }

  return (
    <div className="overflow-x-auto">
      <div id="calendar-view" className="bg-white border border-gray-200 rounded-lg overflow-hidden min-w-[392px]">

        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {DAY_LABELS.map((label, index) => (
            <div
              key={label}
              className={`py-2 text-center text-sm font-semibold ${DAY_HEADER_COLORS[index]}`}
            >
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {calendarDays.map((dateStr, index) => {
            if (!dateStr) {
              return (
                <div key={`empty-${index}`} className="border-b border-r border-gray-100 min-h-[48px]" />
              )
            }

            const [yearStr, monthStr, dayStr] = dateStr.split('-')
            const day = parseInt(dayStr, 10)
            const dayOfWeek = new Date(parseInt(yearStr), parseInt(monthStr) - 1, day).getDay()
            const dayTextColor = getDayTextColor(dayOfWeek)
            const assignment = getAssignment(dateStr)

            if (!assignment) {
              return (
                <div key={dateStr} className="border-b border-r border-gray-100 p-1.5 min-h-[48px]">
                  <span className={`text-sm font-semibold ${dayTextColor}`}>{day}</span>
                </div>
              )
            }

            const seniorName = getMemberName(assignment.senior)
            const juniorName = getMemberName(assignment.junior)
            const tempName = getMemberName(assignment.temp)
            const cellBg = assignment.isSpecial ? 'bg-yellow-50' : 'bg-white'

            return (
              <div
                key={dateStr}
                className={`${cellBg} border-b border-r border-gray-200 p-1.5 flex flex-col gap-0.5 cursor-pointer active:opacity-70`}
                onClick={() => handleCellClick(dateStr)}
              >
                <span className={`text-sm font-semibold ${dayTextColor}`}>{day}</span>

                {assignment.isAllAttend ? (
                  <span className="text-sm px-1 py-0.5 bg-blue-100 text-blue-800 font-semibold rounded self-start leading-tight">
                    전체참여
                  </span>
                ) : (
                  <>
                    <span className="text-sm text-gray-500 leading-tight">{assignment.massTime}</span>
                    {assignment.isSpecial && (
                      <span className="text-sm px-1 py-0.5 bg-yellow-100 text-yellow-800 font-semibold rounded self-start leading-tight">
                        특별미사
                      </span>
                    )}
                    <span className={`text-sm font-semibold truncate leading-tight ${seniorName ? 'text-gray-900' : 'text-red-600'}`}>
                      대 {seniorName || '미배정'}
                    </span>
                    <span className={`text-sm font-semibold truncate leading-tight ${juniorName ? 'text-gray-900' : 'text-red-600'}`}>
                      소 {juniorName || '미배정'}
                    </span>
                    {tempName && (
                      <span className="text-sm text-gray-700 truncate leading-tight">
                        임 {tempName}
                      </span>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
