import { useState, useEffect } from 'react'
import { useScheduler } from '../hooks/useScheduler'

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

const ROLE_LABEL = {
  senior: '대복사',
  junior: '소복사',
  temp: '임시복사',
}

export function EditModal({ date, onClose }) {
  const { state, updateAssignment } = useScheduler()
  const { members, assignments } = state

  const assignment = assignments.find(a => a.date === date)

  const [form, setForm] = useState({
    massTime: assignment?.massTime || '10:30',
    senior: assignment?.senior || '',
    junior: assignment?.junior || '',
    temp: assignment?.temp || '',
    isSpecial: assignment?.isSpecial || false,
    extraSenior: assignment?.extraSenior || '',
    extraJunior: assignment?.extraJunior || '',
  })

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  function handleSubmit(e) {
    e.preventDefault()
    updateAssignment(date, {
      massTime: form.massTime,
      senior: form.senior || null,
      junior: form.junior || null,
      temp: form.temp || null,
      isSpecial: form.isSpecial,
      extraSenior: form.isSpecial ? (form.extraSenior || null) : null,
      extraJunior: form.isSpecial ? (form.extraJunior || null) : null,
    })
    onClose()
  }

  if (!assignment) return null

  const [year, month, day] = date.split('-').map(Number)
  const dayOfWeek = new Date(year, month - 1, day).getDay()
  const dateLabel = `${month}월 ${day}일 (${DAY_LABELS[dayOfWeek]})`

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl p-6 overflow-y-auto max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">{dateLabel} 수정</h2>
          <button
            className="min-h-[40px] min-w-[40px] flex items-center justify-center text-gray-500 text-xl"
            onClick={onClose}
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">미사 시간</label>
            <input
              type="text"
              className="min-h-[48px] px-3 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.massTime}
              onChange={e => setForm(prev => ({ ...prev, massTime: e.target.value }))}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">대복사</label>
            <select
              className="min-h-[48px] px-3 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={form.senior}
              onChange={e => setForm(prev => ({ ...prev, senior: e.target.value }))}
            >
              <option value="">없음</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({ROLE_LABEL[m.role]})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">소복사</label>
            <select
              className="min-h-[48px] px-3 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={form.junior}
              onChange={e => setForm(prev => ({ ...prev, junior: e.target.value }))}
            >
              <option value="">없음</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({ROLE_LABEL[m.role]})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">임시복사</label>
            <select
              className="min-h-[48px] px-3 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={form.temp}
              onChange={e => setForm(prev => ({ ...prev, temp: e.target.value }))}
            >
              <option value="">없음</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({ROLE_LABEL[m.role]})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">특별 미사</label>
            <button
              type="button"
              className={`w-full min-h-[48px] px-4 py-3 text-base font-semibold rounded-lg ${
                form.isSpecial
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-200 text-gray-800'
              }`}
              onClick={() => setForm(prev => ({ ...prev, isSpecial: !prev.isSpecial }))}
            >
              특별 미사: {form.isSpecial ? '켜짐' : '꺼짐'}
            </button>
          </div>

          {form.isSpecial && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">추가 대복사</label>
                <select
                  className="min-h-[48px] px-3 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={form.extraSenior}
                  onChange={e => setForm(prev => ({ ...prev, extraSenior: e.target.value }))}
                >
                  <option value="">없음</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({ROLE_LABEL[m.role]})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">추가 소복사</label>
                <select
                  className="min-h-[48px] px-3 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={form.extraJunior}
                  onChange={e => setForm(prev => ({ ...prev, extraJunior: e.target.value }))}
                >
                  <option value="">없음</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({ROLE_LABEL[m.role]})
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              className="flex-1 min-h-[48px] px-4 py-3 bg-gray-200 text-gray-800 text-base font-semibold rounded-lg"
              onClick={onClose}
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 min-h-[48px] px-4 py-3 bg-blue-600 text-white text-base font-semibold rounded-lg"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
