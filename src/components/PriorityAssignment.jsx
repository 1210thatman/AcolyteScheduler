import { useState } from 'react'

export function PriorityAssignment({ members }) {
  const [priorityIds, setPriorityIds] = useState([])

  function handleToggle(id) {
    if (priorityIds.includes(id)) {
      setPriorityIds(priorityIds.filter(p => p !== id))
    } else {
      setPriorityIds([...priorityIds, id])
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">우선순위 배정</h3>
        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded">
          개발 예정
        </span>
      </div>

      <p className="text-sm text-gray-500">
        체크한 단원을 자동 배정 시 우선적으로 배정합니다. (현재는 화면 구성만 제공되며 실제 배정 결과에는 반영되지 않습니다)
      </p>

      <ul className="space-y-2">
        {members.map(member => (
          <li key={member.id}>
            <label className="flex items-center gap-3 min-h-[48px] px-3 py-2 border border-gray-200 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5"
                checked={priorityIds.includes(member.id)}
                onChange={() => handleToggle(member.id)}
              />
              <span className="text-base text-gray-900">{member.name}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}
