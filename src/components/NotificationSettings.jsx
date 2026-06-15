import { useState } from 'react'

export function NotificationSettings() {
  const [enabled, setEnabled] = useState(false)
  const [sent, setSent] = useState(false)

  function handleToggle() {
    setEnabled(!enabled)
    setSent(false)
  }

  function handleTestSend() {
    setSent(true)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">알림 설정</h3>
        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded">
          개발 예정
        </span>
      </div>

      <p className="text-sm text-gray-500">
        배정이 확정되면 단원들에게 푸시 알림을 보냅니다. (현재는 화면 구성만 제공되며 실제로 전송되지 않습니다)
      </p>

      <button
        type="button"
        className={`w-full min-h-[48px] px-4 py-3 text-base font-semibold rounded-lg ${
          enabled ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'
        }`}
        onClick={handleToggle}
      >
        확정 시 알림 보내기: {enabled ? '켜짐' : '꺼짐'}
      </button>

      {enabled && (
        <button
          type="button"
          className="w-full min-h-[48px] px-4 py-3 bg-blue-600 text-white text-base font-semibold rounded-lg"
          onClick={handleTestSend}
        >
          테스트 알림 보내기
        </button>
      )}

      {sent && (
        <p className="text-green-600 text-sm">알림을 보냈습니다. (모의 기능)</p>
      )}
    </div>
  )
}
