import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './pages/default'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

import { PublicClientApplication, EventType } from '@azure/msal-browser'
import { msalConfig } from './authConfig'

import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/index.css'
import Dashboard from './pages/Dashboard'
import ParkingLotPage from './pages/ParkingLotPage'

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

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/parkingLot/:id" element={<ParkingLotPage />} />
        <Route path="/app" element={<App instance={msalInstance}/>} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
