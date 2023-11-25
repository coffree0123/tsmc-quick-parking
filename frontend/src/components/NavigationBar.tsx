import React, { useContext } from 'react'
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react'
import { Button, Layout } from 'antd'
import { loginRequest } from '../authConfig'
import { AuthContext } from '../contexts/AuthContext'
import { EventType } from '@azure/msal-browser'

export const NavigationBar = (): any => {
  const { instance } = useMsal()
  const { login } = useContext(AuthContext)
  const { Header } = Layout

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
    <Layout className="layout">
      <Header style={{ display: 'flex', alignItems: 'center' }}>
      <AuthenticatedTemplate>
              <Button onClick={handleLogoutRedirect}>
                  Sign out
              </Button>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
              <Button onClick={handleLoginRedirect}>Sign in</Button>
      </UnauthenticatedTemplate>
      </Header>
      </Layout>
  )
}
