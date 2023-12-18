import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ParkingLot from '../components/ParkingLot'
import UserLayout, { footerHeight } from '../components/UserLayout'
import { useParkingLot, useParkingLotList } from '../hooks'
import { Typography } from 'antd'
import { styles } from '../constants'
import TokenRefresh from '../components/TokenRefresh'

const { Title } = Typography

const titleHeight = 96

const ParkingLotPage = ({ instance }: any): React.ReactElement => {
  const [title, setTitle] = useState<string>()
  const { id } = useParams()
  const lotList = useParkingLotList()
  const { lotInfo, summary } = useParkingLot(Number(id))

  useEffect(() => {
    for (const lot of lotList) {
      if (String(lot.id) === id) {
        setTitle(lot.name)
        break
      }
    }
  }, [id, lotList])

  return (
    <TokenRefresh instance={instance}>
    <UserLayout active='parkinglots' title={title} backButton >
      {
        summary !== undefined &&
        <div style={{ height: `${titleHeight}px`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Title
            level={4}
            style={{
              textAlign: 'center',
              backgroundColor: styles.white,
              padding: '10px 0',
              boxShadow: '3px 5px 5px rgba(0, 0, 0, 0.3)',
              margin: 0
            }}
          >
            Free Slots: {summary.numFree}/{summary.numSlots}
          </Title>
        </div>
      }
      <div style={{ height: `calc(100% - ${footerHeight + (summary === undefined ? 0 : titleHeight)}px)` }}>
        <ParkingLot lotInfo={lotInfo} summary={summary} />
      </div>
    </UserLayout>
    </TokenRefresh>
  )
}

export default ParkingLotPage
