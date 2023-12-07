import React, { useContext, useEffect } from 'react'
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react'
import { Button, Layout } from 'antd'
import { loginRequest } from '../authConfig'
import { AuthContext } from '../contexts/AuthContext'
import { EventType } from '@azure/msal-browser'
import axios from 'axios'
import { getAxiosConfig } from '../utils/api'

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

  useEffect(() => {
    // This will be run on component mount
    const callbackId = instance.addEventCallback((event: any) => {
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account != null) {
        console.log(event)
        const idTokenClaims = event.payload.idTokenClaims
        const idToken = event.payload.idToken
        localStorage.setItem('idToken', idToken)
        axios.get('users/', getAxiosConfig())
          .then(response => {
            console.log('user exists ' + idTokenClaims.sub)
          })
          .catch(error => {
            console.error(error)
            console.log('new user')
            axios.post('users/', {
              user_id: idTokenClaims.sub,
              name: idTokenClaims.name,
              email: idTokenClaims.preferred_username,
              phone_num: idTokenClaims.phone_num,
              gender: idTokenClaims.gender,
              age: idTokenClaims.age,
              job_title: idTokenClaims.job_title,
              special_role: idTokenClaims.special_role
            }, getAxiosConfig())
              .then(function (response) {
                console.log(response)
              })
              .catch(function (error) {
                console.log(error)
              })
          })
        if (typeof idTokenClaims.roles === 'undefined') {
          login(idTokenClaims.sub, false)
        } else {
          login(idTokenClaims.sub, true)
        }
      }
    })

    return () => {
      // This will be run on component unmount
      if (callbackId != null) {
        instance.removeEventCallback(callbackId)
      }
    }
  }, [])

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
