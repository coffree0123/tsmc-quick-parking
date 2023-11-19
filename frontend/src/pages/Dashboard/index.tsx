import React, { useContext } from 'react'
import { Button, Col, Input, Layout, List, Row, Space, Typography } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import ParkingLot from '../../components/ParkingLot'
import { AuthContext } from '../../contexts/AuthContext'

const { Header, Content } = Layout
const { Title } = Typography

interface VehicleProps {
  license: string
  slot: string
  stayTime: string
}

const Vehicle = (props: VehicleProps): React.ReactElement => {
  return (
    <Row style={{ width: '100%' }}>
      <Col span={8}>{props.license}</Col>
      <Col span={8}>{props.slot}</Col>
      <Col span={8} style={{ textAlign: 'end' }}>{props.stayTime}</Col>
    </Row>
  )
}

const Dashboard = (): React.ReactElement => {
  const { logout } = useContext(AuthContext)

  const vehicles: VehicleProps[] = [
    { license: 'ABC-9988', slot: 'B1#105', stayTime: '7 days 18 hours' },
    { license: 'EAH-1677', slot: 'B2#222', stayTime: '1 days 3 hours' },
    { license: 'JDU-9132', slot: 'B2#213', stayTime: '14 hours' },
    { license: 'AKS-5723', slot: 'B3#385', stayTime: '4 hours' }
  ]

  return (
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
        <Button type='primary' onClick={logout}>Logout</Button>
      </Header>
      <Content
        style={{
          height: 'calc(100vh - 64px)'
        }}
      >
        <Row>
          <Col span={12}>
            <Title level={3}>Long-term occupancy</Title>
            <List
              size='large'
              bordered
              dataSource={vehicles}
              renderItem={(item) => (
                <List.Item>
                  <Vehicle license={item.license} slot={item.slot} stayTime={item.stayTime} />
                </List.Item>
              )}
            />
          </Col>
          <Col span={12}>
            <ParkingLot id={1} />
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}

export default Dashboard
