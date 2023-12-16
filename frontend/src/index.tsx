import React, { useContext } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './pages/default'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Home from './pages/Home'

import { PublicClientApplication, EventType } from '@azure/msal-browser'
import { msalConfig } from './authConfig'

import './styles/index.css'
import Dashboard from './pages/Dashboard'
import ParkingLotPage from './pages/ParkingLotPage'
import Setting from './pages/Setting'
import Vehicle from './pages/Vehicle'
import AuthContextProvider, { AuthContext } from './contexts/AuthContext'
import axios from 'axios'
import ParkingLotList from './pages/ParkingLotList'
import DashboardRouter from './pages/DashboardRouter'
import { MsalProvider } from '@azure/msal-react'
import UserLayout from './components/UserLayout'
import { ConfigProvider } from 'antd'
import { styles } from './constants'

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

const PubliceDefaultURL = '/login'
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

axios.defaults.baseURL = process.env.REACT_APP_API_ROOT ?? 'http://localhost:8000/api'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: styles.primaryColor
        }
      }}
    >
      <BrowserRouter>
        <MsalProvider instance={msalInstance}>
          <AuthContextProvider>
            <Routes>
              <Route element={<RestrictedPublicRoutes />}>
                <Route path="/login" element={<App instance={msalInstance}/>} />
              </Route>
              <Route element={<UserRoutes />}>
                <Route path="/" element={<UserLayout active='home'><Home /></UserLayout>} />
                <Route
                  path="/parkinglots"
                  element={<UserLayout active='parkinglots' title='Parking Lots'><ParkingLotList /></UserLayout>}
                />
                {/* Wrap UserLayout inside ParkingLotPage to specify title with parking lot name */}
                <Route path="/parkinglots/:id" element={<ParkingLotPage />} />
                <Route
                  path="/vehicles"
                  element={<UserLayout active='vehicles' title='Vehicles'><Vehicle instance={msalInstance}/></UserLayout>}
                />
                <Route
                  path="/settings"
                  element={<UserLayout active='settings' title='Settings'><Setting instance={msalInstance}/></UserLayout>}
                />
              </Route>
              <Route element={<GuardRoutes />}>
                <Route path='/dashboard' element={<DashboardRouter />} />
                <Route path='/dashboard/:id' element={<Dashboard />} />
              </Route>
            </Routes>
          </AuthContextProvider>
        </MsalProvider>
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
