import React, { useEffect } from 'react'
import { useMsal, MsalProvider } from '@azure/msal-react'

const TokenRefresh = (props: { children: React.ReactNode, instance: any }): React.ReactElement => {
  const { instance } = useMsal()

  useEffect(() => {
    const TokenRequest = {
      scopes: ['445f1017-2318-4b79-a470-9164afe1738b/token.refresh'],
      account: instance.getActiveAccount() ?? undefined,
      forceRefresh: true
    }

    instance
      .acquireTokenSilent(TokenRequest)
      .then(function (TokenResponse: any) {
        // Acquire token silent success
        localStorage.setItem('token', TokenResponse.idToken)
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
