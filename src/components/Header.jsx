import { NavLink } from 'react-router-dom'

export function Header() {
  function navClass({ isActive }) {
    const base = 'px-4 py-3 text-base font-semibold border-b-2 whitespace-nowrap'
    if (isActive) {
      return `${base} border-blue-600 text-blue-600`
    }
    return `${base} border-transparent text-gray-500`
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-2xl mx-auto px-4">
        <nav className="flex gap-1">
          <NavLink to="/" end className={navClass}>달력</NavLink>
          <NavLink to="/members" className={navClass}>단원 관리</NavLink>
          <NavLink to="/schedule" className={navClass}>자동 배정</NavLink>
        </nav>
      </div>
    </header>
  )
}
