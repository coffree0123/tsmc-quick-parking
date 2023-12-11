import { useEffect, useState } from 'react'
import axios from 'axios'

import { getAxiosConfig } from './utils/api'

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

interface FloorInfo {
  floor: string
  free_slots: Slots
  priority_slots: Slots
}

interface LotInfo {
  num_row: number
  num_col: number
  num_floor: number
  floor_info: FloorInfo[]
}

export const useParkingLot = (id: number): LotInfo | undefined => {
  const [lotInfo, setLotInfo] = useState<LotInfo>()
  useEffect(() => {
    axios.get<LotInfo>(`users/parkinglots/${id}`, getAxiosConfig())
      .then(response => {
        setLotInfo(response.data)
      })
      .catch(error => { console.error(error) })
  }, [id])
  return lotInfo
}
