import React, { useEffect, useState } from 'react'
import { Col, Input, Layout, List, Row, Space, Typography, Select, DatePicker } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { Line } from '@ant-design/charts'
import ParkingLot from '../../components/ParkingLot'
import LogOutButton from '../../components/LogOutButton'
import { MsalProvider } from '@azure/msal-react'
import axios from 'axios'
import dayjs from 'dayjs'
import { getAxiosConfig } from '../../utils/api'

const { Header, Content } = Layout
const { Title } = Typography
const { RangePicker } = DatePicker

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

interface TimeRecordInfo {
  time: string
  value: number
}

const Occupants = (props: { id: number }): React.ReactElement => {
  const [occupants, setOccupants] = useState<OccupantInfo[]>([])

  useEffect(() => {
    axios.get<OccupantRes[]>(`guards/parkinglots/${props.id}/long-term-occupants`, getAxiosConfig())
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
const Chart = (): React.ReactElement => {
  const [timeRecords, setTimeRecords] = useState<TimeRecordInfo[]>([])
  const [parkingLotID, setParkingLotID] = useState<string>('1')
  const [floor, setFloor] = useState<string>('1')
  const [timeRange, setTimeRange] = useState<string[]>([dayjs().subtract(1, 'day').toString(), dayjs().toString()])
  // const [interval, setInterval] = useState<string>('1H')

  useEffect(() => {
    axios.get<TimeRecordInfo[]>(`guards/dashboard/time-records?parkinglot_id=${parkingLotID}&floor=${floor}&start_time=${timeRange[0]}&end_time=${timeRange[1]}&interval=1H`, getAxiosConfig())
      .then(response => {
        setTimeRecords(response.data.map(item => ({
          time: item.time,
          value: item.value
        })))
      })
      .catch(error => { console.error(error) })
  }, [parkingLotID, floor, timeRange])

  const config = {
    data: timeRecords,
    width: 800,
    height: 400,
    autoFit: false,
    xField: 'time',
    yField: 'value',
    point: {
      size: 5,
      shape: 'diamond'
    },
    label: {
      style: {
        fill: '#aaa'
      }
    }
  }
  return (
    <React.Fragment>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Space wrap>
          Pakring Lot
          <Select
            defaultValue="1"
            style={{ width: 120 }}
            options={[
              { value: '1', label: '1' },
              { value: '2', label: '2' }
            ]}
            onChange={(val) => { setParkingLotID(val) }}
          />
          Floor
          <Select
            defaultValue="1"
            style={{ width: 120 }}
            options={[
              { value: '1', label: '1' },
              { value: '2', label: '2' }
            ]}
            onChange={(val) => { setFloor(val) }}
          />
        </Space>
        <Space wrap>
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            defaultValue={[dayjs().subtract(1, 'day'), dayjs()]}
            onChange={(time, timeString) => { setTimeRange(timeString) }}
          />
        </Space>
        <Line {...config} />
      </Space>
    </React.Fragment>
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
          <Col span={18} offset={6}>
            <Chart />
          </Col>
        </Row>
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
