import { Button } from 'antd'
import React, { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'

const Login = (): React.ReactElement => {
  const { login } = useContext(AuthContext)

  const handleUserLogin = (): void => {
    login('abc123', false)
  }

  const handleGuardLogin = (): void => {
    login('abc123', true)
  }

  return (
    <>
      <Button type='primary' onClick={handleUserLogin}>Login as user</Button>
      <Button type='primary' onClick={handleGuardLogin}>Login as guard</Button>
    </>
  )
}

export default Login
