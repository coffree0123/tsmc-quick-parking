import { type AxiosRequestConfig } from 'axios'

export const getAxiosConfig = (): AxiosRequestConfig<any> | undefined => {
  const token = localStorage.getItem('token')
  return token === null ? undefined : { headers: { Authorization: `Bearer ${token}` } }
}
