import { useContext } from 'react'
import { SchedulerContext } from '../context/SchedulerContext'

export function useScheduler() {
  const context = useContext(SchedulerContext)
  if (!context) {
    throw new Error('useScheduler는 SchedulerProvider 안에서만 사용할 수 있습니다.')
  }
  return context
}
