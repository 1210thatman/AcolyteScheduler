import { useState, useRef } from 'react'
import { useScheduler } from '../hooks/useScheduler'

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

const ROLE_LABEL = {
  senior: '대복사',
  junior: '소복사',
  temp: '임시복사',
}

function getCalendarDays(year, month) {
  const firstDayOfMonth = new Date(year, month - 1, 1)
  const daysInMonth = new Date(year, month, 0).getDate()
  const startWeekday = firstDayOfMonth.getDay() // 0: 일요일

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

export function UnavailableDatePicker() {
  const { state, setMonth } = useScheduler()
  const { members, currentYear, currentMonth } = state

  const [selectedMemberId, setSelectedMemberId] = useState('')

  const calendarDays = getCalendarDays(currentYear, currentMonth)

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
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">참여 불가 날짜 설정</h2>

      <div className="flex flex-col gap-1 mb-4">
        <label className="text-sm font-semibold text-gray-700">단원 선택</label>
        {members.length === 0 ? (
          <p className="text-gray-500 text-sm py-2">
            등록된 단원이 없습니다. 먼저 단원을 추가해주세요.
          </p>
        ) : (
          <select
            className="min-h-[48px] px-3 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={selectedMemberId}
            onChange={e => setSelectedMemberId(e.target.value)}
          >
            <option value="">단원을 선택하세요</option>
            {members.map(member => (
              <option key={member.id} value={member.id}>
                {member.name} ({ROLE_LABEL[member.role]})
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex items-center justify-between mb-3">
        <button
          className="min-h-[48px] px-4 py-3 bg-gray-200 text-gray-800 text-base font-semibold rounded-lg"
          onClick={handlePrevMonth}
        >
          이전 달
        </button>
        <span className="text-base font-semibold text-gray-900">
          {currentYear}년 {currentMonth}월
        </span>
        <button
          className="min-h-[48px] px-4 py-3 bg-gray-200 text-gray-800 text-base font-semibold rounded-lg"
          onClick={handleNextMonth}
        >
          다음 달
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-200">
          {DAY_LABELS.map(label => (
            <div key={label} className="py-2 text-center text-sm font-semibold text-gray-500">
              {label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {calendarDays.map((dateStr, index) => {
            if (!dateStr) {
              return <div key={`empty-${index}`} className="aspect-square" />
            }
            const day = parseInt(dateStr.split('-')[2], 10)
            return (
              <div
                key={dateStr}
                className="aspect-square flex items-center justify-center text-sm text-gray-400"
              >
                {day}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
