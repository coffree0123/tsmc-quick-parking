import React, { useContext } from 'react'
import { Button } from 'antd'
import { useMsal } from '@azure/msal-react'
import { AuthContext } from '../contexts/AuthContext'

const LogOutButton = (): React.ReactElement => {
  const { instance } = useMsal()
  const activeAccount = instance.getActiveAccount()
  const { logout } = useContext(AuthContext)
  function signOutClickHandler (instance: any): any {
    const logoutRequest = {
      account: activeAccount,
      postLogoutRedirectUri: '/login'
    }
    instance.logoutRedirect(logoutRequest)
    logout()
  }
  return (
      <Button type='primary' onClick={() => signOutClickHandler(instance)}>Logout</Button>
  )
}

export default LogOutButton
