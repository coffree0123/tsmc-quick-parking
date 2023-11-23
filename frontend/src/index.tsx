import React, { useContext } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './pages/default'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Home from './pages/Home'

import { PublicClientApplication, EventType } from '@azure/msal-browser'
import { msalConfig } from './authConfig'

import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/index.css'
import Dashboard from './pages/Dashboard'
import ParkingLotPage from './pages/ParkingLotPage'
import Login from './pages/Login'
import AuthContextProvider, { AuthContext } from './contexts/AuthContext'

/**
 * MSAL should be instantiated outside of the component tree to prevent it from being re-instantiated on re-renders.
 * For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
export const msalInstance: any = new PublicClientApplication(msalConfig)

// Default to using the first account if no account is active on page load
if (msalInstance.getActiveAccount() === null && msalInstance.getAllAccounts().length > 0) {
  // Account selection logic is app dependent. Adjust as needed for different use cases.
  msalInstance.setActiveAccount(msalInstance.getActiveAccount()[0])
}

// Listen for sign-in event and set active account
msalInstance.addEventCallback((event: any) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account != null) {
    const account = event.payload.account
    msalInstance.setActiveAccount(account)
  }
})

const PubliceDefaultURL = '/app'
const UserDefaultURL = '/'
const GuardDefaultURL = '/dashboard'

const RestrictedPublicRoutes = (): React.ReactElement => {
  const { token, isGuard } = useContext(AuthContext)
  return token === undefined ? <Outlet /> : <Navigate to={isGuard ? GuardDefaultURL : UserDefaultURL} replace />
}

const UserRoutes = (): React.ReactElement => {
  const { token, isGuard } = useContext(AuthContext)
  return token === undefined
    ? <Navigate to={PubliceDefaultURL} replace />
    : (isGuard ? <Navigate to={GuardDefaultURL} replace /> : <Outlet />)
}

const GuardRoutes = (): React.ReactElement => {
  const { token, isGuard } = useContext(AuthContext)
  return token === undefined
    ? <Navigate to={PubliceDefaultURL} replace />
    : (isGuard ? <Outlet /> : <Navigate to={UserDefaultURL} replace />)
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route element={<RestrictedPublicRoutes />}>
            <Route path="/login" element={<Login />} />
            <Route path="/app" element={<App instance={msalInstance}/>} />
          </Route>
          <Route element={<UserRoutes />}>
            <Route path="/" element={<Home instance={msalInstance}/>} />
            <Route path="/parkingLot/:id" element={<ParkingLotPage />} />
          </Route>
          <Route element={<GuardRoutes />}>
            <Route path='/dashboard' element={<Dashboard instance={msalInstance}/>} />
          </Route>
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
