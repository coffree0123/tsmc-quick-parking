import React, { useEffect, useState } from 'react'
import { Col, Input, Layout, List, Row, Space, Typography } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import ParkingLot from '../../components/ParkingLot'
import LogOutButton from '../../components/LogOutButton'
import { MsalProvider } from '@azure/msal-react'
import axios from 'axios'

const { Header, Content } = Layout
const { Title } = Typography

interface VehicleProps {
  license: string
  position: string
  stayTime: number
}

const Vehicle = (props: VehicleProps): React.ReactElement => {
  const days = Math.floor(props.stayTime / (1000 * 60 * 60 * 24))
  const hours = Math.floor(props.stayTime / (1000 * 60 * 60) - days * 24)
  const minutes = Math.round(props.stayTime / (1000 * 60) - (days * 24 + hours) * 60)
  return (
    <Row style={{ width: '100%' }}>
      <Col span={8}>{props.license}</Col>
      <Col span={8}>{props.position}</Col>
      <Col span={8} style={{ textAlign: 'end' }}>{days > 0 ? `${days} day${days > 1 ? 's' : ''} ` : ''}{hours > 0 ? `${hours} hr${hours > 1 ? 's' : ''} ` : ''}{minutes > 0 ? `${minutes} min${minutes > 1 ? 's' : ''}` : ''}</Col>
    </Row>
  )
}

interface OccupantInfo {
  position: string
  license: string
  startTime: number
}

interface OccupantRes {
  postion: string
  license_plate_no: string
  start_time: string
}

const Occupants = (props: { id: number }): React.ReactElement => {
  const [occupants, setOccupants] = useState<OccupantInfo[]>([])

  useEffect(() => {
    axios.get<OccupantRes[]>(`parkinglots/${props.id}/long-term-occupants`)
      .then(response => {
        setOccupants(response.data.map(item => ({
          position: item.postion,
          license: item.license_plate_no,
          startTime: Date.parse(item.start_time)
        })))
      })
      .catch(error => { console.error(error) })
  }, [])

  return (
    <List
      size='large'
      bordered
      dataSource={occupants}
      renderItem={(item) => (
        <List.Item>
          <Vehicle license={item.license} position={item.position} stayTime={Date.now() - item.startTime} />
        </List.Item>
      )}
    />
  )
}

const Dashboard = ({ instance }: any): React.ReactElement => {
  return (
    <MsalProvider instance={instance}>
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Space>
          <span style={{ width: '150px', color: '#B32A2A', fontWeight: 'bold' }} >Quick Parking</span>
          <Input prefix={<SearchOutlined />} placeholder='Search the vehicles' style={{ width: '250px' }} />
        </Space>
        <LogOutButton />
      </Header>
      <Content
        style={{
          height: 'calc(100vh - 64px)'
        }}
      >
        <Row>
          <Col span={12}>
            <Title level={3}>Long-term occupants</Title>
            <Occupants id={1} />
          </Col>
          <Col span={12}>
            <ParkingLot id={1} />
          </Col>
        </Row>
      </Content>
    </Layout>
    </MsalProvider>
  )
}

export default Dashboard
