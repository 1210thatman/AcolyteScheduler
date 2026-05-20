import { createContext, useState, useEffect } from 'react'

export const SchedulerContext = createContext(null)

const STORAGE_KEY = 'acolyte-scheduler'

const initialState = {
  members: [],
  assignments: [],
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth() + 1,
}

export function SchedulerProvider({ children }) {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
    return initialState
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  function addMember(member) {
    setState(prev => ({
      ...prev,
      members: [...prev.members, member],
    }))
  }

  function updateMember(id, partial) {
    setState(prev => ({
      ...prev,
      members: prev.members.map(m => {
        if (m.id !== id) return m
        return { ...m, ...partial }
      }),
    }))
  }

  function deleteMember(id) {
    setState(prev => ({
      ...prev,
      members: prev.members.filter(m => m.id !== id),
    }))
  }

  function toggleUnavailableDate(memberId, dateStr) {
    setState(prev => ({
      ...prev,
      members: prev.members.map(m => {
        if (m.id !== memberId) return m
        const alreadyIn = m.unavailableDates.includes(dateStr)
        if (alreadyIn) {
          return { ...m, unavailableDates: m.unavailableDates.filter(d => d !== dateStr) }
        }
        return { ...m, unavailableDates: [...m.unavailableDates, dateStr] }
      }),
    }))
  }

  function updateAssignment(date, partial) {
    setState(prev => ({
      ...prev,
      assignments: prev.assignments.map(a => {
        if (a.date !== date) return a
        return { ...a, ...partial }
      }),
    }))
  }

  function toggleSpecialMass(date) {
    setState(prev => ({
      ...prev,
      assignments: prev.assignments.map(a => {
        if (a.date !== date) return a
        return { ...a, isSpecial: !a.isSpecial }
      }),
    }))
  }

  function setMonth(year, month) {
    setState(prev => ({ ...prev, currentYear: year, currentMonth: month }))
  }

  // 5주차에 구현 예정
  function runAutoSchedule() {}

  const value = {
    state,
    addMember,
    updateMember,
    deleteMember,
    toggleUnavailableDate,
    runAutoSchedule,
    updateAssignment,
    toggleSpecialMass,
    setMonth,
  }

  return (
    <SchedulerContext.Provider value={value}>
      {children}
    </SchedulerContext.Provider>
  )
}
