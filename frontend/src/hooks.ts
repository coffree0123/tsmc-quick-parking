import { useEffect, useState } from 'react'
import axios from 'axios'

import { getAxiosConfig } from './utils/api'

interface LotInfo {
  id: number
  name: string
}

export const useParkingLotList = (): LotInfo[] => {
  const [lotList, setLotList] = useState<LotInfo[]>([])
  useEffect(() => {
    axios.get<LotInfo[]>('users/parkinglots/list', getAxiosConfig())
      .then(response => {
        setLotList(response.data)
      })
      .catch(error => { console.error(error) })
  }, [])
  return lotList
}
