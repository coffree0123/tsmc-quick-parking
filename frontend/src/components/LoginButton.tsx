import { useMsal } from '@azure/msal-react'
import { Button } from 'antd'
import React, { useContext, useEffect } from 'react'
import { loginRequest } from '../authConfig'
import { EventType } from '@azure/msal-browser'
import { getAxiosConfig } from '../utils/api'
import axios from 'axios'
import { AuthContext } from '../contexts/AuthContext'

const LoginButton = (): React.ReactElement => {
  const { login } = useContext(AuthContext)
  const { instance } = useMsal()
  const handleLoginRedirect = (): void => {
    instance.loginRedirect(loginRequest).catch((error) => { console.error(error) })
  }

  useEffect(() => {
    // This will be run on component mount
    const callbackId = instance.addEventCallback((event: any) => {
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account != null) {
        const idTokenClaims = event.payload.idTokenClaims
        const idToken = event.payload.idToken

        if (typeof idTokenClaims.roles === 'undefined') {
          login(idToken, false)
        } else {
          login(idToken, true)
        }

        axios.get('users/', getAxiosConfig())
          .catch(() => {
            axios.post('users/', {
              user_id: idTokenClaims.oid,
              name: idTokenClaims.name,
              email: idTokenClaims.preferred_username,
              phone_num: idTokenClaims.phone_num,
              gender: idTokenClaims.gender,
              age: idTokenClaims.age,
              job_title: idTokenClaims.job_title,
              priority: idTokenClaims.priority
            }, getAxiosConfig())
              .catch(function (error) {
                console.error(error)
              })
          })
      }
    })

    return () => {
      // This will be run on component unmount
      if (callbackId != null) {
        instance.removeEventCallback(callbackId)
      }
    }
  }, [])

  return (
    <Button
      type='primary'
      onClick={handleLoginRedirect}
      style={{ boxShadow: '3px 5px 5px rgba(0, 0, 0, 0.3)' }}
    >
      Login
    </Button>
  )
}

export default LoginButton
