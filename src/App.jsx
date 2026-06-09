import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ThemeProvider } from './context/ThemeContext'
import { LocaleProvider } from './context/LocaleContext'
import { DataProvider, useData } from './context/DataContext'
import { Layout } from './components/Layout'
import Onboarding from './features/onboarding/Onboarding'

// Code splitting: each route is loaded on demand.
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Expenses = lazy(() => import('./pages/Expenses'))
const Income = lazy(() => import('./pages/Income'))
const Budgets = lazy(() => import('./pages/Budgets'))
const Goals = lazy(() => import('./pages/Goals'))
const FixedExpenses = lazy(() => import('./pages/FixedExpenses'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Settings = lazy(() => import('./pages/Settings'))

function PageFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent"
        style={{ color: 'var(--accent)' }}
        aria-label="Loading"
      />
    </div>
  )
}

function AppRoutes() {
  const { state } = useData()

  if (!state.onboarded) {
    return <Onboarding />
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          index
          element={
            <Suspense fallback={<PageFallback />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route
          path="expenses"
          element={
            <Suspense fallback={<PageFallback />}>
              <Expenses />
            </Suspense>
          }
        />
        <Route
          path="income"
          element={
            <Suspense fallback={<PageFallback />}>
              <Income />
            </Suspense>
          }
        />
        <Route
          path="budgets"
          element={
            <Suspense fallback={<PageFallback />}>
              <Budgets />
            </Suspense>
          }
        />
        <Route
          path="goals"
          element={
            <Suspense fallback={<PageFallback />}>
              <Goals />
            </Suspense>
          }
        />
        <Route
          path="fixed"
          element={
            <Suspense fallback={<PageFallback />}>
              <FixedExpenses />
            </Suspense>
          }
        />
        <Route
          path="analytics"
          element={
            <Suspense fallback={<PageFallback />}>
              <Analytics />
            </Suspense>
          }
        />
        <Route
          path="settings"
          element={
            <Suspense fallback={<PageFallback />}>
              <Settings />
            </Suspense>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LocaleProvider>
          <DataProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </DataProvider>
        </LocaleProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
