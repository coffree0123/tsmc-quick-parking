import React, { useContext } from 'react'
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react'
import { Navbar, Button } from 'react-bootstrap'
import { loginRequest } from '../authConfig'
import { AuthContext } from '../contexts/AuthContext'
import { EventType } from '@azure/msal-browser'

export const NavigationBar = (): any => {
  const { instance } = useMsal()
  const { login } = useContext(AuthContext)

  const handleLoginRedirect = (): any => {
    instance.loginRedirect(loginRequest).catch((error) => { console.log(error) })
  }

  const handleLogoutRedirect = (): any => {
    instance.logoutRedirect().catch((error) => { console.log(error) })
  }

  // Listen for sign-in event and set active account
  instance.addEventCallback((event: any) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account != null) {
      const idTokenClaims = event.payload.account.idTokenClaims
      console.log(idTokenClaims.roles)
      if (typeof idTokenClaims.roles === 'undefined') {
        login(idTokenClaims.sub, false)
      } else {
        login(idTokenClaims.sub, true)
      }
    }
  })

  /**
     * Most applications will need to conditionally render certain components based on whether a user is signed in or not.
     * msal-react provides 2 easy ways to do this. AuthenticatedTemplate and UnauthenticatedTemplate components will
     * only render their children if a user is authenticated or unauthenticated, respectively.
     */
  return (
        <>
            <Navbar bg="primary" variant="dark" className="navbarStyle">
                <a className="navbar-brand" href="/">
                    Microsoft identity platform
                </a>
                <AuthenticatedTemplate>
                    <div className="collapse navbar-collapse justify-content-end">
                        <Button variant="warning" onClick={handleLogoutRedirect}>
                            Sign out
                        </Button>
                    </div>
                </AuthenticatedTemplate>
                <UnauthenticatedTemplate>
                    <div className="collapse navbar-collapse justify-content-end">
                        <Button onClick={handleLoginRedirect}>Sign in</Button>
                    </div>
                </UnauthenticatedTemplate>
            </Navbar>
        </>
  )
}
