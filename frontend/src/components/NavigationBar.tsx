import React, { useContext } from 'react'
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react'
import { Navbar, Button } from 'react-bootstrap'
import { loginRequest } from '../authConfig'
import { AuthContext } from '../contexts/AuthContext'

export const NavigationBar = (): any => {
  const { instance } = useMsal()
  const idTokenClaims = instance.getActiveAccount()?.idTokenClaims
  const { login } = useContext(AuthContext)

  const handleLoginRedirect = (): any => {
    instance.loginRedirect(loginRequest).catch((error) => { console.log(error) })
  }

  const handleLogoutRedirect = (): any => {
    instance.logoutRedirect().catch((error) => { console.log(error) })
  }

  const handleUserLogin = (): void => {
    if (idTokenClaims != null && typeof idTokenClaims.sub === 'string') {
      login(idTokenClaims.sub, false)
      console.log(idTokenClaims.sub)
    }
  }

  const handleGuardLogin = (): void => {
    login('abc123', true)
  }

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
                        <Button onClick={handleUserLogin}>
                            User Proceed
                        </Button>
                        <Button onClick={handleGuardLogin}>
                            Guard Proceed
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
