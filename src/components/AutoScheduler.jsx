import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useScheduler } from '../hooks/useScheduler'
import { runSchedule } from '../utils/scheduler'
import { MemberManager } from './MemberManager'
import { PriorityAssignment } from './PriorityAssignment'
import { NotificationSettings } from './NotificationSettings'

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

function formatDateLabel(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const dayOfWeek = new Date(year, month - 1, day).getDay()
  return `${month}월 ${day}일 (${DAY_LABELS[dayOfWeek]})`
}

export function AutoScheduler() {
  const { state, runAutoSchedule } = useScheduler()
  const { members, currentYear, currentMonth } = state
  const navigate = useNavigate()

  const [preview, setPreview] = useState(null)
  const [showMemberManager, setShowMemberManager] = useState(false)

  function getMemberName(id) {
    if (!id) return null
    const member = members.find(m => m.id === id)
    return member ? member.name : null
  }

  function handleRunSchedule() {
    const result = runSchedule(members, currentYear, currentMonth)
    setPreview(result)
  }

  function handleConfirm() {
    runAutoSchedule(preview)
    navigate('/')
  }

  if (members.length === 0) {
    return (
      <div className="space-y-6">
        <p className="text-center text-gray-500 py-8 text-base">
          단원이 등록되어 있지 않습니다. 아래에서 단원을 추가해주세요.
        </p>
        <MemberManager />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <p className="text-base text-gray-500">
        {currentYear}년 {currentMonth}월 배정을 자동으로 생성합니다.
      </p>

      <div>
        <button
          className="w-full min-h-[48px] px-4 py-3 bg-gray-200 text-gray-800 text-base font-semibold rounded-lg"
          onClick={() => setShowMemberManager(!showMemberManager)}
        >
          {showMemberManager ? '단원 정보 닫기' : '단원 정보 수정'}
        </button>

        {showMemberManager && (
          <div className="mt-4">
            <MemberManager />
          </div>
        )}
      </div>

      <PriorityAssignment members={members} />

      {!preview && (
        <button
          className="w-full min-h-[48px] px-4 py-3 bg-blue-600 text-white text-base font-semibold rounded-lg"
          onClick={handleRunSchedule}
        >
          자동 배정 시작
        </button>
      )}

      {preview && (
        <>
          <ul className="space-y-2">
            {preview.map(assignment => {
              const seniorName = getMemberName(assignment.senior)
              const juniorName = getMemberName(assignment.junior)
              const tempName = getMemberName(assignment.temp)

              return (
                <li key={assignment.date} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-base font-semibold text-gray-900 shrink-0">
                      {formatDateLabel(assignment.date)}
                    </span>

                    {assignment.isAllAttend ? (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-sm font-semibold rounded">
                        전체참여
                      </span>
                    ) : (
                      <div className="text-sm text-right space-y-1">
                        <div>
                          <span className="text-gray-500">대복사 </span>
                          <span className={seniorName ? 'text-gray-900 font-semibold' : 'text-red-600 font-semibold'}>
                            {seniorName || '미배정'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">소복사 </span>
                          <span className={juniorName ? 'text-gray-900 font-semibold' : 'text-red-600 font-semibold'}>
                            {juniorName || '미배정'}
                          </span>
                        </div>
                        {tempName && (
                          <div>
                            <span className="text-gray-500">임시복사 </span>
                            <span className="text-gray-900 font-semibold">{tempName}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="flex gap-3">
            <button
              className="flex-1 min-h-[48px] px-4 py-3 bg-gray-200 text-gray-800 text-base font-semibold rounded-lg"
              onClick={handleRunSchedule}
            >
              다시 배정
            </button>
            <button
              className="flex-1 min-h-[48px] px-4 py-3 bg-blue-600 text-white text-base font-semibold rounded-lg"
              onClick={handleConfirm}
            >
              확정
            </button>
          </div>
        </>
      )}

      <NotificationSettings />
    </div>
  )
}
