import React from 'react'
import { useParams } from 'react-router-dom'
import ParkingLot from '../../components/ParkingLot'

const ParkingLotPage = (): React.ReactElement => {
  const { id } = useParams()

  return (<ParkingLot id={Number(id)} />)
}

export default ParkingLotPage
