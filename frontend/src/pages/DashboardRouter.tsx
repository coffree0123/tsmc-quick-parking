import React from 'react'
import { useParkingLotList } from '../hooks'
import { Navigate } from 'react-router-dom'
import { Skeleton } from 'antd'

const DashboardRouter = (): React.ReactElement => {
  const lotList = useParkingLotList()
  return (
    lotList.length > 0
      ? <Navigate to={`/dashboard/${lotList[0].id}`}/>
      : <Skeleton active />
  )
}

export default DashboardRouter
