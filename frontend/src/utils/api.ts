import { type AxiosRequestConfig } from 'axios'

export const getAxiosConfig = (): AxiosRequestConfig<any> | undefined => {
  const idToken = localStorage.getItem('idToken')
  return idToken === null ? undefined : { headers: { Authorization: `Bearer ${idToken}` } }
}
