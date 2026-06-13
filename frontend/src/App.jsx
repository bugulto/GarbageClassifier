import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import { UploadPage } from './pages/UploadPage'
import { HistoryPage } from './pages/HistoryPage'
import { ResultDetailPage } from './pages/ResultDetailPage'
import { ChatPage } from './pages/ChatPage'
import './styles.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/:jobId" element={<ResultDetailPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="*" element={<Navigate to="/upload" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
