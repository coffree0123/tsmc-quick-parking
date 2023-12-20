import React, { useContext } from 'react'
import { Button } from 'antd'
import { useMsal } from '@azure/msal-react'
import { AuthContext } from '../contexts/AuthContext'
import { styles } from '../constants'

const LogOutButton = (props: { style?: React.CSSProperties }): React.ReactElement => {
  const { instance } = useMsal()
  const activeAccount = instance.getActiveAccount()
  const { logout } = useContext(AuthContext)
  function signOutClickHandler (instance: any): any {
    const logoutRequest = {
      account: activeAccount,
      postLogoutRedirectUri: '/parkinglots'
    }
    instance.logoutRedirect(logoutRequest)
    logout()
  }
  return (
      <Button onClick={() => signOutClickHandler(instance)} style={{ backgroundColor: 'transparent', border: `2px solid ${styles.gray}`, ...props.style }}>Logout</Button>
  )
}

export default LogOutButton
