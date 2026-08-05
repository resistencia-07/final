import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

interface LayoutProps {
  children: ReactNode
  activePage: string
  onNavigate: (page: string) => void
  pageTitle: string
  pageSubtitle?: string
}

export default function Layout({ children, activePage, onNavigate, pageTitle, pageSubtitle }: LayoutProps) {
  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <div className="app-main">
        <TopBar title={pageTitle} subtitle={pageSubtitle} onNavigate={onNavigate} />
        <main className="app-body">
          {children}
        </main>
      </div>
    </div>
  )
}
