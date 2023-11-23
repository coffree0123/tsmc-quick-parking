import React from 'react'
import { Button } from 'antd'
import { useMsal } from '@azure/msal-react'

const LogOutButton = (): React.ReactElement => {
  const { instance } = useMsal()
  const activeAccount = instance.getActiveAccount()
  function signOutClickHandler (instance: any): any {
    const logoutRequest = {
      account: activeAccount,
      postLogoutRedirectUri: '/app'
    }
    instance.logoutRedirect(logoutRequest)
  }
  return (
      <Button type='primary' onClick={() => signOutClickHandler(instance)}>Logout</Button>
  )
}

export default LogOutButton
