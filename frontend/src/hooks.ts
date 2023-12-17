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

export interface LotInfo {
  num_row: number
  num_col: number
  num_floor: number
  floor_info: FloorInfo[]
}

interface FloorSummary {
  name: string
  numSlots: number
  numFree: number
}

export interface ParkingLotSummary {
  numSlots: number
  numFree: number
  floors: FloorSummary[]
}

export const useParkingLot = (id: number): { lotInfo?: LotInfo, summary?: ParkingLotSummary } => {
  const [lotInfo, setLotInfo] = useState<LotInfo>()
  const { isGuard } = useContext(AuthContext)
  const [summary, setSummary] = useState<ParkingLotSummary>()

  useEffect(() => {
    axios.get<LotInfo>(`${isGuard ? 'guards' : 'users'}/parkinglots/${id}`, getAxiosConfig())
      .then(response => {
        setLotInfo(response.data)
        const numSlots = response.data.num_row * response.data.num_col
        let numFree = 0
        const floors: FloorSummary[] = []
        for (const item of response.data.floor_info) {
          const free = typeof item.free_slots !== 'undefined'
            ? item.free_slots.length
            : (numSlots - (item.parked_slots?.length ?? 0))
          numFree += free
          floors.push({
            name: item.floor,
            numSlots,
            numFree: free
          })
        }
        setSummary({
          numSlots: numSlots * response.data.floor_info.length,
          numFree,
          floors
        })
      })
      .catch(error => { console.error(error) })
  }, [id])

  return { lotInfo, summary }
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
