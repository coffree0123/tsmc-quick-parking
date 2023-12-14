import React, { useEffect, useState } from 'react'
import { Col, Input, Layout, List, Row, Space, Typography, Select, DatePicker, InputNumber, Modal, Form, Button, notification } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { Line } from '@ant-design/charts'
import ParkingLot from '../../components/ParkingLot'
import LogOutButton from '../../components/LogOutButton'
import axios from 'axios'
import dayjs from 'dayjs'
import { getAxiosConfig } from '../../utils/api'
import { useNavigate, useParams } from 'react-router-dom'
import { useParkingLot, useParkingLotList } from '../../hooks'

const { Header, Content } = Layout
const { Title } = Typography
const { RangePicker } = DatePicker

interface VehicleProps {
  license: string
  position: string
  stayTime: number
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

const Vehicle = (props: VehicleProps): React.ReactElement => {
  const days = Math.floor(props.stayTime / (1000 * 60 * 60 * 24))
  const hours = Math.floor(props.stayTime / (1000 * 60 * 60) - days * 24)
  const minutes = Math.round(props.stayTime / (1000 * 60) - (days * 24 + hours) * 60)
  return (
    <Row style={{ width: '100%', cursor: 'pointer' }} onClick={props.onClick}>
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
  position: string
  license_plate_no: string
  start_time: string
}

interface TimeRecordInfo {
  time: string
  value: number
}

interface TimeRecordQuery {
  floor: number
  start_time: string
  end_time: string
  interval: number
  time_unit: string
}

const Occupants = (props: { id: number, openCarInfo: (id: string) => void }): React.ReactElement => {
  const [occupants, setOccupants] = useState<OccupantInfo[]>([])

  useEffect(() => {
    axios.get<OccupantRes[]>(`guards/parkinglots/${props.id}/long-term-occupants`, getAxiosConfig())
      .then(response => {
        setOccupants(response.data.map(item => ({
          position: item.position,
          license: item.license_plate_no,
          startTime: Date.parse(item.start_time)
        })))
      })
      .catch(error => { console.error(error) })
  }, [props.id])

  return (
    <List
      size='large'
      bordered
      dataSource={occupants}
      renderItem={(item) => (
        <List.Item>
          <Vehicle license={item.license} position={item.position} stayTime={Date.now() - item.startTime} onClick={() => { props.openCarInfo(item.license) }} />
        </List.Item>
      )}
    />
  )
}
const Chart = (props: { id: number }): React.ReactElement => {
  const [timeRecords, setTimeRecords] = useState<TimeRecordInfo[]>([])
  const [query, setQuery] = useState<TimeRecordQuery>({
    floor: 1,
    start_time: dayjs().subtract(1, 'day').toString(),
    end_time: dayjs().toString(),
    interval: 1,
    time_unit: 'H'
  })
  const lotInfo = useParkingLot(props.id)

  const changeQuery = (identifier: any, value: any): void => {
    setQuery((prevQuery) => ({ ...prevQuery, [identifier]: value }))
  }
  useEffect(() => {
    if (lotInfo !== undefined && query.floor <= lotInfo.num_floor) {
      axios.get<TimeRecordInfo[]>(`guards/dashboard/time-records?parkinglot_id=${props.id}&floor=${query.floor}&start_time=${query.start_time}&end_time=${query.end_time}&interval=${query.interval}${query.time_unit}`, getAxiosConfig())
        .then(response => {
          setTimeRecords(response.data.map(item => {
            const date = new Date(item.time + '+00:00')
            return ({
              time: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`,
              value: item.value
            })
          }))
        })
        .catch(error => { console.error(error) })
    } else {
      setQuery({ ...query, floor: 1 })
    }
  }, [query, props.id, lotInfo])

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
          Floor
          <Select
            value={query.floor}
            style={{ width: 120 }}
            options={
              lotInfo === undefined
                ? []
                : lotInfo.floor_info.map((item, index) => ({ value: index + 1, label: item.floor }))
            }
            onChange={(val) => { changeQuery('floor', val) }}
          />
        </Space>
        <Space wrap>
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            defaultValue={[dayjs().subtract(1, 'day'), dayjs()]}
            onChange={(time, timeString) => {
              changeQuery('start_time', timeString[0])
              changeQuery('end_time', timeString[1])
            }}
          />
          every
          <InputNumber min={1} defaultValue={1} onChange={(val) => { changeQuery('interval', val) }} />
          <Select
            defaultValue="H"
            style={{ width: 120 }}
            options={[
              { value: 'D', label: 'Day' },
              { value: 'H', label: 'Hour' },
              { value: 'T', label: 'Minute' },
              { value: 'S', label: 'Second' }
            ]}
            onChange={(val) => { changeQuery('time_unit', val) }}
          />
        </Space>
        <Line {...config} />
      </Space>
    </React.Fragment>
  )
}

interface SearchInterface {
  query?: string
}

const Dashboard = (): React.ReactElement => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [carId, setCarId] = useState('')
  const [noti, notiContextHolder] = notification.useNotification()
  const { id } = useParams()
  const lotList = useParkingLotList()
  const navigate = useNavigate()
  const switchLot = (value: number): void => {
    if (Number(id) !== value) {
      navigate(`/dashboard/${value}`)
    }
  }
  const openCarInfo = (id: string): void => {
    // Mocking not found
    if (id === 'no') {
      noti.error({
        message: 'License not found.',
        placement: 'bottomRight',
        duration: 4.5
      })
    } else {
      setCarId(id)
      setIsModalOpen(true)
    }
  }
  return (
    <Layout>
      {notiContextHolder}
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
          <Form onFinish={(values: SearchInterface) => { values.query !== undefined && openCarInfo(values.query) }}>
            <Form.Item<SearchInterface>
              name='query'
              style={{ marginBottom: 0 }}
            >
              <Input
                prefix={<SearchOutlined />}
                suffix={<Button size='small' htmlType='submit'>Search</Button>}
                placeholder='Search the vehicles'
                style={{ width: '250px' }}
              />
            </Form.Item>
          </Form>
        </Space>
        <Space>
          <Select
            value={Number(id)}
            style={{ width: 120 }}
            options={lotList.map(item => ({ value: item.id, label: item.name }))}
            onChange={switchLot}
          />
          <LogOutButton />
        </Space>
      </Header>
      <Content
        style={{
          height: 'calc(100vh - 64px)'
        }}
      >
        <Row>
          <Col span={18} offset={6}>
            <Chart id={Number(id)} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Title level={3}>Long-term occupants</Title>
            <Occupants id={Number(id)} openCarInfo={openCarInfo} />
          </Col>
          <Col span={12}>
            <ParkingLot id={Number(id)} openCarInfo={openCarInfo} />
          </Col>
        </Row>
        <Modal
          open={isModalOpen}
          footer={null}
          onCancel={() => { setIsModalOpen(false) }}
        >
          Car Info: {carId}
        </Modal>
      </Content>
    </Layout>
  )
}

export default Dashboard
