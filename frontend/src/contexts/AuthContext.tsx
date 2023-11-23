import React, { createContext, useState } from 'react'

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

  const login = (token: string, isGuard: boolean = false): void => {
    setIsGuard(isGuard)
    setToken(token)
  }

  const logout = (): void => {
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
