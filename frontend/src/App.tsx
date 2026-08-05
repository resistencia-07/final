import { useState, useEffect } from 'react'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import CaptureLab from './pages/CaptureLab'
import SessionStats from './pages/SessionStats'
import Athletes from './pages/Athletes'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { useAuth } from './context/AuthContext'

type Page = 'dashboard' | 'capture' | 'session-stats' | 'athletes' | 'reports' | 'settings' | 'profile' | 'login' | 'signup'

const pageConfig: Record<Page, { title: string; subtitle?: string }> = {
  dashboard:     { title: 'Dashboard',           subtitle: 'Ndurance Motion Lab' },
  capture:       { title: 'Capture Studio',      subtitle: 'Left • Back • Right camera sync' },
  'session-stats': { title: 'Session Report',    subtitle: 'Performance insights' },
  athletes:      { title: 'Athletes',            subtitle: 'Profile and motion history' },
  reports:       { title: 'Reports & Analytics', subtitle: 'Performance trends and exports' },
  settings:      { title: 'Settings',            subtitle: 'Studio configuration' },
  profile:       { title: 'Profile',             subtitle: 'Member account and body metrics' },
  login:         { title: 'Sign In',             subtitle: 'Access your Ndurance studio' },
  signup:        { title: 'Sign Up',             subtitle: 'Create your premium account' },
}

// Pages that should NOT show sidebar (full-screen modes)
const AUTH_PAGES: Page[] = ['login', 'signup']

export default function App() {
  const [activePage, setActivePage] = useState<Page>('login')
  const { isAuthenticated, isLoading } = useAuth()

  const navigate = (page: string) => {
    const nextPage = page as Page
    if (pageConfig[nextPage]) {
      setActivePage(nextPage)
    }
  }

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) {
      if (activePage !== 'signup') {
        setActivePage('login')
      }
      return
    }

    if (activePage === 'login' || activePage === 'signup') {
      setActivePage('dashboard')
    }
  }, [isAuthenticated, isLoading, activePage])

  const config = pageConfig[activePage]

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':     return <Dashboard onNavigate={navigate} />
      case 'capture':       return <CaptureLab onNavigate={navigate} />
      case 'session-stats': return <SessionStats onNavigate={navigate} />
      case 'athletes':      return <Athletes onNavigate={navigate} />
      case 'reports':       return <Reports onNavigate={navigate} />
      case 'settings':      return <Settings />
      case 'profile':       return <Profile onNavigate={navigate} />
      case 'login':         return <LoginPage onNavigate={navigate} />
      case 'signup':        return <SignupPage onNavigate={navigate} />
      default:              return <Dashboard onNavigate={navigate} />
    }
  }

  if (AUTH_PAGES.includes(activePage)) {
    return renderPage()
  }

  return (
    <Layout
      activePage={activePage}
      onNavigate={navigate}
      pageTitle={config.title}
      pageSubtitle={config.subtitle}
    >
      {renderPage()}
    </Layout>
  )
}
