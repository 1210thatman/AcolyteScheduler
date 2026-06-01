function getMassDates(year, month) {
  const dates = []
  const daysInMonth = new Date(year, month, 0).getDate()

  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month - 1, d)
    const dayOfWeek = dateObj.getDay()

    if (dayOfWeek === 0 || dayOfWeek === 5) {
      const mm = String(month).padStart(2, '0')
      const dd = String(d).padStart(2, '0')
      dates.push(`${year}-${mm}-${dd}`)
    }
  }

  return dates
}

export function runSchedule(members, year, month) {
  if (members.length === 0) return []

  const massDates = getMassDates(year, month)

  const firstFriday = massDates.find(dateStr => {
    const [y, m, d] = dateStr.split('-').map(Number)
    return new Date(y, m - 1, d).getDay() === 5
  })

  const assignCount = {}
  members.forEach(m => {
    assignCount[m.id] = 0
  })

  const assignments = []

  for (const dateStr of massDates) {
    if (dateStr === firstFriday) {
      assignments.push({
        date: dateStr,
        massTime: '10:30',
        senior: null,
        junior: null,
        temp: null,
        isSpecial: false,
        isAllAttend: true,
        extraSenior: null,
        extraJunior: null,
      })
      continue
    }

    const availableMembers = members.filter(m => !m.unavailableDates.includes(dateStr))

    const availableSeniors = availableMembers
      .filter(m => m.role === 'senior')
      .sort((a, b) => {
        const aTotal = a.prevCount + assignCount[a.id]
        const bTotal = b.prevCount + assignCount[b.id]
        if (aTotal !== bTotal) return aTotal - bTotal
        return a.id < b.id ? -1 : 1
      })

    const availableJuniors = availableMembers
      .filter(m => m.role === 'junior')
      .sort((a, b) => {
        const aTotal = a.prevCount + assignCount[a.id]
        const bTotal = b.prevCount + assignCount[b.id]
        if (aTotal !== bTotal) return aTotal - bTotal
        return a.id < b.id ? -1 : 1
      })

    const availableTemps = availableMembers
      .filter(m => m.role === 'temp')
      .sort((a, b) => {
        const aTotal = a.prevCount + assignCount[a.id]
        const bTotal = b.prevCount + assignCount[b.id]
        if (aTotal !== bTotal) return aTotal - bTotal
        return a.id < b.id ? -1 : 1
      })

    const assignedSenior = availableSeniors[0] || null
    const assignedJunior = availableJuniors[0] || null
    const assignedTemp = availableTemps[0] || null

    if (assignedSenior) assignCount[assignedSenior.id]++
    if (assignedJunior) assignCount[assignedJunior.id]++
    if (assignedTemp) assignCount[assignedTemp.id]++

    assignments.push({
      date: dateStr,
      massTime: '10:30',
      senior: assignedSenior ? assignedSenior.id : null,
      junior: assignedJunior ? assignedJunior.id : null,
      temp: assignedTemp ? assignedTemp.id : null,
      isSpecial: false,
      isAllAttend: false,
      extraSenior: null,
      extraJunior: null,
    })
  }

  return assignments
}
