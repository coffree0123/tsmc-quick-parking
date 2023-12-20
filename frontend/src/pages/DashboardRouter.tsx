import React from 'react'
import { useParkingLotList } from '../hooks'
import { Navigate } from 'react-router-dom'
import { Skeleton } from 'antd'
import TokenRefresh from '../components/TokenRefresh'

const DashboardRouter = ({ instance }: any): React.ReactElement => {
  const lotList = useParkingLotList()
  return (
    lotList.length > 0
      ? <Navigate to={`/dashboard/${lotList[0].id}`}/>
      : <TokenRefresh instance={instance}><Skeleton active /></TokenRefresh>
  )
}

export default DashboardRouter
