import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { MobileLayout } from './components/MobileLayout'
import { CommunityPage } from './pages/CommunityPage'
import { HomePage } from './pages/HomePage'
import { NodePage } from './pages/NodePage'
import { RoutesPage } from './pages/RoutesPage'
import { WalletPage } from './pages/WalletPage'
import './app.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MobileLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/node" element={<NodePage />} />
          <Route path="/wallet" element={<WalletPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
