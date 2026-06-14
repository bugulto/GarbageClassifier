import { NavLink } from 'react-router-dom'
import { Leaf, UploadCloud, History, MessageCircle } from 'lucide-react'

export const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Leaf size={24} />
        WasteVision
      </div>
      <div className="navbar-links">
        <NavLink to="/upload" className={({ isActive }) => isActive ? 'nav-link-active' : ''}>
          <UploadCloud size={16} /> Upload
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => isActive ? 'nav-link-active' : ''}>
          <History size={16} /> History
        </NavLink>
        <NavLink to="/chat" className={({ isActive }) => isActive ? 'nav-link-active' : ''}>
          <MessageCircle size={16} /> Chatbot
        </NavLink>
      </div>
    </nav>
  )
}
