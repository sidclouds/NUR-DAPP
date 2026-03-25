import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import logoImage from '../assets/logo.png'
import { localeOptions, useI18n } from '../lib/i18n'

export function MobileLayout() {
  const { locale, setLocale, messages, direction } = useI18n()
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const languagePickerRef = useRef<HTMLLabelElement | null>(null)
  const activeLocale = useMemo(
    () => localeOptions.find((option) => option.value === locale) ?? localeOptions[0],
    [locale],
  )

  const navItems = [
    { to: '/', label: messages.navigation.home },
    { to: '/routes', label: messages.navigation.routes },
    { to: '/wallet', label: messages.navigation.vault, isLogo: true },
    { to: '/community', label: messages.navigation.network },
    { to: '/node', label: messages.navigation.node },
  ]

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!languagePickerRef.current?.contains(event.target as Node)) {
        setLanguageMenuOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setLanguageMenuOpen(false)
      }
    }

    window.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

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
              <strong>{messages.common.projectName}</strong>
            </div>
          </div>
          <div className="banner-side">
            <div className="network-pill">
              <span className="network-dot" />
              {messages.common.networkName}
            </div>
            <label
              ref={languagePickerRef}
              className={`language-picker ${languageMenuOpen ? 'open' : ''}`.trim()}
            >
              <span className="language-select-shell">
                <button
                  type="button"
                  className="language-select-trigger"
                  aria-haspopup="listbox"
                  aria-expanded={languageMenuOpen}
                  aria-label={activeLocale.nativeLabel}
                  onClick={() => setLanguageMenuOpen((open) => !open)}
                >
                  <span className="language-select-value">{activeLocale.nativeLabel}</span>
                </button>
                <span className="language-select-caret" aria-hidden="true">
                  ▾
                </span>
              </span>
              {languageMenuOpen ? (
                <span className="language-menu" role="listbox" aria-label="Language options">
                  {localeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={option.value === locale}
                      className={`language-option ${option.value === locale ? 'active' : ''}`.trim()}
                      onClick={() => {
                        setLocale(option.value)
                        setLanguageMenuOpen(false)
                      }}
                    >
                      <span className="language-option-native">{option.nativeLabel}</span>
                      <span className="language-option-label">{option.label}</span>
                    </button>
                  ))}
                </span>
              ) : null}
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
              onClick={() => setLanguageMenuOpen(false)}
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
