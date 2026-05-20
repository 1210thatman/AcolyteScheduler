import { useState, useEffect } from 'react'
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

const EMPTY_FORM = { name: '', role: 'senior', prevCount: 0 }

export function MemberManager() {
  const { state, addMember, updateMember, deleteMember } = useScheduler()
  const { members } = state

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isModalOpen) return

    function handleKeyDown(e) {
      if (e.key === 'Escape') setIsModalOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen])

  function handleOpenAdd() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setError('')
    setIsModalOpen(true)
  }

  function handleOpenEdit(member) {
    setEditingId(member.id)
    setForm({ name: member.name, role: member.role, prevCount: member.prevCount })
    setError('')
    setIsModalOpen(true)
  }

  function handleClose() {
    setIsModalOpen(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('이름을 입력해주세요.')
      return
    }
    if (form.name.trim().length > 20) {
      setError('이름은 20자 이하로 입력해주세요.')
      return
    }

    if (editingId) {
      updateMember(editingId, {
        name: form.name.trim(),
        role: form.role,
        prevCount: form.prevCount,
      })
    } else {
      addMember({
        id: crypto.randomUUID(),
        name: form.name.trim(),
        role: form.role,
        prevCount: form.prevCount,
        unavailableDates: [],
      })
    }
    setIsModalOpen(false)
  }

  function handleDelete(id) {
    if (!window.confirm('이 단원을 삭제할까요?')) return
    deleteMember(id)
  }

  function handlePrevCountChange(e) {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    if (raw === '') {
      setForm(prev => ({ ...prev, prevCount: 0 }))
      return
    }
    setForm(prev => ({ ...prev, prevCount: parseInt(raw, 10) }))
  }

  return (
    <div>
      <button
        className="w-full min-h-[48px] px-4 py-3 bg-blue-600 text-white text-base font-semibold rounded-lg mb-6"
        onClick={handleOpenAdd}
      >
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
                  <button
                    className="min-h-[40px] px-3 py-2 bg-gray-200 text-gray-800 text-sm font-semibold rounded-lg"
                    onClick={() => handleOpenEdit(member)}
                  >
                    수정
                  </button>
                  <button
                    className="min-h-[40px] px-3 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg"
                    onClick={() => handleDelete(member.id)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50"
          onClick={handleClose}
        >
          <div
            className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 overflow-y-auto max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? '단원 수정' : '단원 추가'}
              </h2>
              <button
                className="min-h-[40px] min-w-[40px] flex items-center justify-center text-gray-500 text-xl"
                onClick={handleClose}
                aria-label="닫기"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">이름</label>
                <input
                  className="min-h-[48px] px-3 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="복사 이름 입력"
                  maxLength={20}
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">역할</label>
                <select
                  className="min-h-[48px] px-3 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={form.role}
                  onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))}
                >
                  <option value="senior">대복사</option>
                  <option value="junior">소복사</option>
                  <option value="temp">임시복사</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">전월 참여 횟수</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="min-h-[48px] px-3 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.prevCount}
                  onChange={handlePrevCountChange}
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  className="flex-1 min-h-[48px] px-4 py-3 bg-gray-200 text-gray-800 text-base font-semibold rounded-lg"
                  onClick={handleClose}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[48px] px-4 py-3 bg-blue-600 text-white text-base font-semibold rounded-lg"
                >
                  {editingId ? '수정 완료' : '추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
