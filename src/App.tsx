import { useEffect, useRef, type MouseEvent } from 'react'
import styles from './App.module.css'
import { SiteFooter } from './components/layout/SiteFooter'
import { SiteHeader } from './components/layout/SiteHeader'
import { findModule } from './data/modules'
import { useTheme } from './hooks/useTheme'
import { AboutPage } from './pages/AboutPage'
import { CalculatorPage } from './pages/CalculatorPage'
import { CataloguePage } from './pages/CataloguePage'
import { HomePage } from './pages/HomePage'
import { ModulePage } from './pages/ModulePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ScraperPage } from './pages/ScraperPage'
import { useHashPath } from './router/hashRouter'
import { moduleSlugFromPath, paths } from './router/paths'
import { DEFAULT_THEME } from './themes/themes'
import { cx } from './utils/cx'

export default function App() {
  const pathname = useHashPath()
  const mainRef = useRef<HTMLElement>(null)
  const previousPath = useRef(pathname)

  const moduleSlug = moduleSlugFromPath(pathname)
const activeModule =
  moduleSlug != null ? findModule(moduleSlug) : undefined

// Module pages use their own theme; other pages use the default theme.
// Module pages use their own theme; other pages use the default theme.
  const theme = activeModule?.theme ?? DEFAULT_THEME
  useTheme(theme)

// Reset scroll position and move focus when navigating.
  useEffect(() => {
    if (previousPath.current === pathname) return
    previousPath.current = pathname
    window.scrollTo(0, 0)
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname])

  const skipToContent = (event: MouseEvent<HTMLAnchorElement>) => {
    // The hash holds the route, so a normal "#main" link would navigate away.
    event.preventDefault()
mainRef.current?.focus({ preventScroll: true })
mainRef.current?.scrollIntoView({ block: 'start' })
  }

const page =
  pathname === paths.home ? (
    <HomePage />
  ) : pathname === paths.about ? (
    <AboutPage />
  ) : pathname === paths.scraper ? (
    <ScraperPage />
  ) : pathname === paths.calculator ? (
    <CalculatorPage />
  ) : pathname === paths.catalogue ? (
    <CataloguePage />
  ) : activeModule ? (
    <ModulePage module={activeModule} />
  ) : (
    <NotFoundPage />
  )

  return (
    <div className={styles.shell}>
      <a href="#main" className={styles.skip} onClick={skipToContent}>
        Skip to content
      </a>
      <SiteHeader pathname={pathname} />
      {/* The key replays the entry animation on every page change. */}
      <main
        id="main"
        ref={mainRef}
        tabIndex={-1}
        key={pathname}
        className={cx(styles.main, pathname === paths.home && styles.flush)}
      >
        {page}
      </main>
      <SiteFooter />
    </div>
  )
}
