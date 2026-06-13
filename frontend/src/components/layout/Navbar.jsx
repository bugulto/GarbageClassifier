import { Link } from 'react-router-dom'

export const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">GarbageClassifier</div>
      <div className="navbar-links">
        <Link to="/upload">Upload</Link>
        <Link to="/history">History</Link>
        <Link to="/chat">Chatbot</Link>
      </div>
    </nav>
  )
}
