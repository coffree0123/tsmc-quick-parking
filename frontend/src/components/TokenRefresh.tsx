import React, { useEffect } from 'react'
import { useMsal, MsalProvider } from '@azure/msal-react'

const TokenRefresh = (props: { children: React.ReactNode, instance: any }): React.ReactElement => {
  const { instance } = useMsal()

  useEffect(() => {
    const TokenRequest = {
      scopes: ['user.read'],
      account: instance.getAllAccounts()[0],
      forceRefresh: true,
      refreshTokenExpirationOffsetSeconds: 86400
    }

    instance
      .acquireTokenSilent(TokenRequest)
      .then(function (TokenResponse: any) {
        // Acquire token silent success
        console.log(TokenResponse)
      })
      .catch(function (error: any) {
        // Acquire token silent failure
        console.log(error)
      })
  }, [])

  return (
    <MsalProvider instance={instance}>
      {props.children}
    </MsalProvider>
  )
}

export default TokenRefresh
