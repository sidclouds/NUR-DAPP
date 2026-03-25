import { NavLink, Outlet } from 'react-router-dom'
import logoImage from '../assets/logo.png'
import { localeOptions, useI18n } from '../lib/i18n'

export function MobileLayout() {
  const { locale, setLocale, messages, direction } = useI18n()
  const navItems = [
    { to: '/', label: messages.navigation.home },
    { to: '/routes', label: messages.navigation.routes },
    { to: '/wallet', label: messages.navigation.vault, isLogo: true },
    { to: '/community', label: messages.navigation.network },
    { to: '/node', label: messages.navigation.node },
  ]

  return (
    <div className="mobile-shell">
      <div className="mobile-frame" dir={direction}>
        <div className="theme-orbit theme-orbit-left" />
        <div className="theme-orbit theme-orbit-right" />
        <img className="brand-watermark" src={logoImage} alt="" aria-hidden="true" />

        <header className="theme-banner">
          <div className="brand-block">
            <div className="brand-logo-wrap">
              <img className="brand-logo" src={logoImage} alt="NUR" />
            </div>
            <div className="brand-copy">
              <span className="brand-name">{messages.common.brand}</span>
              <strong>{messages.common.brandTagline}</strong>
            </div>
          </div>
          <div className="banner-side">
            <div className="network-pill">
              <span className="network-dot" />
              {messages.common.networkName}
            </div>
            <label className="language-picker">
              <span className="language-label">{messages.common.language}</span>
              <span className="language-select-shell">
                <select value={locale} onChange={(event) => setLocale(event.target.value as typeof locale)}>
                  {localeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.nativeLabel}
                    </option>
                  ))}
                </select>
                <span className="language-select-caret" aria-hidden="true">
                  ▾
                </span>
              </span>
            </label>
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
              aria-label={item.label}
            >
              {item.isLogo ? (
                <span className="nav-logo-badge" aria-label={messages.navigation.vault}>
                  <img src={logoImage} alt={messages.navigation.vault} />
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
