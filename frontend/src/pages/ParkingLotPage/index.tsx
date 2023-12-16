import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ParkingLot from '../../components/ParkingLot'
import UserLayout from '../../components/UserLayout'
import { useParkingLotList } from '../../hooks'

const ParkingLotPage = (): React.ReactElement => {
  const [title, setTitle] = useState<string>()
  const { id } = useParams()
  const lotList = useParkingLotList()

  useEffect(() => {
    for (const lot of lotList) {
      if (String(lot.id) === id) {
        setTitle(lot.name)
        break
      }
    }
  }, [id, lotList])

  return (
    <UserLayout active='parkinglots' title={title} backButton >
      <ParkingLot id={Number(id)} />
    </UserLayout>
  )
}

export default ParkingLotPage
