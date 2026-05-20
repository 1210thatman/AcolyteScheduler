import { useScheduler } from '../hooks/useScheduler'

const ROLE_LABEL = {
  senior: '대복사',
  junior: '소복사',
  temp: '임시복사',
}

const ROLE_BADGE_CLASS = {
  senior: 'bg-blue-100 text-blue-800',
  junior: 'bg-green-100 text-green-800',
  temp: 'bg-yellow-100 text-yellow-800',
}

export function MemberManager() {
  const { state } = useScheduler()
  const { members } = state

  return (
    <div>
      <button className="w-full min-h-[48px] px-4 py-3 bg-blue-600 text-white text-base font-semibold rounded-lg mb-6">
        단원 추가
      </button>

      {members.length === 0 ? (
        <p className="text-center text-gray-500 py-16 text-base">
          아직 등록된 단원이 없습니다.
        </p>
      ) : (
        <ul className="space-y-3">
          {members.map(member => (
            <li key={member.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-base font-semibold text-gray-900 truncate">
                    {member.name}
                  </span>
                  <span className={`shrink-0 px-2 py-0.5 rounded text-sm font-semibold ${ROLE_BADGE_CLASS[member.role]}`}>
                    {ROLE_LABEL[member.role]}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm text-gray-500">전월 {member.prevCount}회</span>
                  <button className="min-h-[40px] px-3 py-2 bg-gray-200 text-gray-800 text-sm font-semibold rounded-lg">
                    수정
                  </button>
                  <button className="min-h-[40px] px-3 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg">
                    삭제
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
