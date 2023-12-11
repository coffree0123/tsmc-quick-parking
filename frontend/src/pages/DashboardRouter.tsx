import React from 'react'
import { useParkingLotList } from '../hooks'
import { Navigate } from 'react-router-dom'

const DashboardRouter = (): React.ReactElement => {
  const lotList = useParkingLotList()
  return (
    lotList.length > 0
      ? <Navigate to={`/dashboard/${lotList[0].id}`}/>
      : <div>There is no parking lot.</div>
  )
}

export default DashboardRouter
