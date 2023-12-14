import { useContext, useEffect, useState } from 'react'
import axios from 'axios'

import { getAxiosConfig } from './utils/api'
import { AuthContext } from './contexts/AuthContext'

interface LotItem {
  id: number
  name: string
}

export const useParkingLotList = (): LotItem[] => {
  const [lotList, setLotList] = useState<LotItem[]>([])
  useEffect(() => {
    axios.get<LotItem[]>('users/parkinglots/list', getAxiosConfig())
      .then(response => {
        setLotList(response.data)
      })
      .catch(error => { console.error(error) })
  }, [])
  return lotList
}

export type Slots = number[]

export interface ParkingInfo {
  index: number
  license_plate_no: string
  illegally_parked: boolean
  car_owner_enrolled: boolean
}

interface FloorInfo {
  floor: string
  free_slots?: Slots
  priority_slots: Slots
  parked_slots?: ParkingInfo[]
}

interface LotInfo {
  num_row: number
  num_col: number
  num_floor: number
  floor_info: FloorInfo[]
}

export const useParkingLot = (id: number): LotInfo | undefined => {
  const [lotInfo, setLotInfo] = useState<LotInfo>()
  const { isGuard } = useContext(AuthContext)
  useEffect(() => {
    axios.get<LotInfo>(`${isGuard ? 'guards' : 'users'}/parkinglots/${id}`, getAxiosConfig())
      .then(response => {
        setLotInfo(response.data)
      })
      .catch(error => { console.error(error) })
  }, [id])
  return lotInfo
}

interface UserInfo {
  age: number
  email: string
  gender: string
  job_title: string
  name: string
  phone_num: string
  priority: string
  user_id: string
}

export const useUserInfo = (): UserInfo | undefined => {
  const [userInfo, setUserInfo] = useState<UserInfo>()

  useEffect(() => {
    axios.get<UserInfo>('users/', getAxiosConfig())
      .then(response => {
        setUserInfo(response.data)
      })
      .catch(error => { console.error(error) })
  }, [])

  return userInfo
}
