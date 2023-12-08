import React from 'react'
import { useParams } from 'react-router-dom'
import ParkingLot from '../../components/ParkingLot'
import { MsalProvider } from '@azure/msal-react'

const ParkingLotPage = ({ instance }: any): React.ReactElement => {
  const { id } = useParams()

  return (
    <MsalProvider instance={instance}>
    <ParkingLot id={Number(id)} />
    </MsalProvider>
  )
}

export default ParkingLotPage
