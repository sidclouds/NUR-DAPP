import { NavLink, Outlet } from 'react-router-dom'
import logoImage from '../assets/logo.png'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/routes', label: 'Routes' },
  { to: '/wallet', label: 'Vault', isLogo: true },
  { to: '/community', label: 'Network' },
  { to: '/node', label: 'Node' },
]

export function MobileLayout() {
  return (
    <div className="mobile-shell">
      <div className="mobile-frame">
        <div className="theme-orbit theme-orbit-left" />
        <div className="theme-orbit theme-orbit-right" />
        <img className="brand-watermark" src={logoImage} alt="" aria-hidden="true" />

        <header className="theme-banner">
          <div className="brand-block">
            <div className="brand-logo-wrap">
              <img className="brand-logo" src={logoImage} alt="NUR" />
            </div>
            <div className="brand-copy">
              <span className="brand-name">NUR</span>
              <strong>Polygon Energy Access</strong>
            </div>
          </div>
          <div className="network-pill">
            <span className="network-dot" />
            Polygon
          </div>
        </header>

        <main className="mobile-content">
          <Outlet />
        </main>

        <nav className="bottom-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `nav-item ${item.isLogo ? 'nav-item-logo' : ''} ${isActive ? 'active' : ''}`.trim()
              }
            >
              {item.isLogo ? (
                <span className="nav-logo-badge" aria-label="Vault">
                  <img src={logoImage} alt="NUR Vault" />
                </span>
              ) : (
                <span className="nav-item-text">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
