import React, { createContext, useState, useEffect } from 'react'

interface AuthContextType {
  token?: string
  isGuard: boolean
  login: (token: string, isGuard: boolean) => void
  logout: () => void
}

const NotImplementedError = new Error('NotImplementedError')

export const AuthContext = createContext<AuthContextType>({
  isGuard: false,
  login: () => { throw NotImplementedError },
  logout: () => { throw NotImplementedError }
})

const AuthContextProvider = (props: { children: React.ReactNode }): React.ReactElement => {
  const [token, setToken] = useState<string | undefined>()
  const [isGuard, setIsGuard] = useState<boolean>(false)

  useEffect(() => {
    if (localStorage.getItem('token') !== null && localStorage.getItem('isGuard') !== null) {
      setIsGuard(JSON.parse(localStorage.getItem('isGuard') ?? '{}'))
      setToken(JSON.stringify(localStorage.getItem('token') ?? '{}'))
    }
  }, [])

  const login = (token: string, isGuard: boolean = false): void => {
    localStorage.setItem('token', token)
    localStorage.setItem('isGuard', isGuard.toString())
    setIsGuard(isGuard)
    setToken(token)
  }

  const logout = (): void => {
    localStorage.removeItem('token')
    localStorage.removeItem('isGuard')
    setToken(undefined)
    setIsGuard(false)
  }

  const value = {
    token,
    isGuard,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
