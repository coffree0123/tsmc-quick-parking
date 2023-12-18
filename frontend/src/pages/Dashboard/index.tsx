import React, { useEffect, useState } from 'react'
import { Col, Input, Layout, List, Row, Space, Typography, Select, DatePicker, InputNumber, Switch, Modal, Form, Button, notification, Flex } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { Area } from '@ant-design/charts'
import ParkingLot from '../../components/ParkingLot'
import LogOutButton from '../../components/LogOutButton'
import TokenRefresh from '../../components/TokenRefresh'
import axios from 'axios'
import dayjs from 'dayjs'
import { getAxiosConfig } from '../../utils/api'
import { useNavigate, useParams } from 'react-router-dom'
import { useParkingLot, useParkingLotList } from '../../hooks'
import { styles } from '../../constants'

const { Header, Content } = Layout
const { Title } = Typography
const { RangePicker } = DatePicker

interface VehicleProps {
  license: string
  position: string
  stayTime: number
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

export const formatStayTime = (stayTime: number): string => {
  const days = Math.floor(stayTime / (1000 * 60 * 60 * 24))
  const hours = Math.floor(stayTime / (1000 * 60 * 60) - days * 24)
  const minutes = Math.round(stayTime / (1000 * 60) - (days * 24 + hours) * 60)
  return `${days > 0 ? `${days} day${days > 1 ? 's' : ''} ` : ''}${hours > 0 ? `${hours} hr${hours > 1 ? 's' : ''} ` : ''}${minutes > 0 ? `${minutes} min${minutes > 1 ? 's' : ''}` : ''}`
}

const Vehicle = (props: VehicleProps): React.ReactElement => {
  return (
    <Row style={{ width: '100%', cursor: 'pointer' }} onClick={props.onClick}>
      <Col span={8}>{props.license}</Col>
      <Col span={8}>{props.position}</Col>
      <Col span={8} style={{ textAlign: 'end' }}>{formatStayTime(props.stayTime)}</Col>
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
interface TimeRecordDisplay {
  label: string
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
  const [timeRecords, setTimeRecords] = useState<TimeRecordDisplay[]>([])
  const [query, setQuery] = useState<TimeRecordQuery>({
    floor: 1,
    start_time: dayjs().subtract(1, 'day').toString(),
    end_time: dayjs().toString(),
    interval: 1,
    time_unit: 'H'
  })
  const lotInfo = useParkingLot(props.id)
  const [isPercent, setIsPercent] = useState<boolean>(false)

  const changeQuery = (identifier: any, value: any): void => {
    setQuery((prevQuery) => ({ ...prevQuery, [identifier]: value }))
  }
  useEffect(() => {
    if (lotInfo !== undefined && query.floor <= lotInfo.num_floor) {
      axios.get<TimeRecordInfo[]>(`guards/dashboard/time-records?parkinglot_id=${props.id}&floor=${query.floor}&start_time=${query.start_time}&end_time=${query.end_time}&interval=${query.interval}${query.time_unit}`, getAxiosConfig())
        .then(response => {
          const tmp: TimeRecordDisplay[] = []
          response.data.forEach((item) => {
            const date = new Date(item.time + '+00:00')
            const year = date.getFullYear()
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            const day = date.getDate().toString().padStart(2, '0')
            const hour = date.getHours().toString().padStart(2, '0')
            const minute = date.getMinutes().toString().padStart(2, '0')
            const value = item.value
            tmp.push({
              label: 'Occupied',
              time: `${year}/${month}/${day} ${hour}:${minute}`,
              value
            })
            tmp.push({
              label: 'Free',
              time: `${year}/${month}/${day} ${hour}:${minute}`,
              value: lotInfo.num_row * lotInfo.num_col - value
            })
          })
          setTimeRecords(tmp)
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
    isStack: true,
    isPercent,
    seriesField: 'label',
    color: ['#82d1de', '#cb302d'],
    areaStyle: {
      fillOpacity: 0.7
    },
    meta: {
      label: {
        values: ['Free', 'Occupied']
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
          <Switch checked={isPercent} onChange={(val) => { setIsPercent(val) }} />Percentage
        </Space>
        <Area {...config} />
      </Space>
    </React.Fragment>
  )
}

interface SearchInterface {
  query?: string
}

interface VehicleRecords {
  license_plate_no: string
  parkinglot_name: string
  position: string
  start_time: string
  end_time?: string
}

interface OwnerInfo {
  id?: string
  name?: string
  job_title?: string
  email?: string
  phone?: string
  priority?: string
}

interface OtherVehicleInfo {
  license_plate_no: string
  model: string
  start_time: string
  parkinglot_name: string
  position: string
}

interface VehicleInfo {
  vehicle_records: VehicleRecords[]
  owner_info: OwnerInfo
  owner_other_vehicle: OtherVehicleInfo[]
}

const RecordItem = (props: { position: string, stayTime: number }): React.ReactElement => {
  return (
    <Row style={{ width: '100%' }}>
      <Col span={12}>{props.position}</Col>
      <Col span={12} style={{ textAlign: 'end' }}>{formatStayTime(props.stayTime)}</Col>
    </Row>
  )
}

const OtherVehicleItem = (props: { license: string, position?: string }): React.ReactElement => {
  return (
    <Row style={{ width: '100%' }}>
      <Col span={8}>{props.license}</Col>
      <Col span={8} style={{ textAlign: 'end' }}>{props.position}</Col>
    </Row>
  )
}

export const getStayTime = (startTime: string, endTime?: string | null): number => (
  endTime === undefined || endTime === null
    ? Date.now()
    : Date.parse(endTime)
) - Date.parse(startTime)

const VehicleModal = (props: { id: string, vehicleInfo: VehicleInfo }): React.ReactElement => {
  let currentPosition: string | undefined
  for (const item of props.vehicleInfo.vehicle_records) {
    if (typeof item.end_time === 'undefined') {
      currentPosition = item.position
      break
    }
  }
  return (
    <Row>
      <Col span={12} style={{ paddingRight: '12px' }} >
        <Title
          level={3}
          style={{
            textAlign: 'center',
            color: styles.white,
            backgroundColor: styles.primaryColor
          }}
        >
          Vehicle: {props.id}
        </Title>
        <Title level={4}>Current Position: <span style={{ fontWeight: 'normal' }}>{currentPosition ?? 'Not parked'}</span></Title>
        {
          props.vehicleInfo.vehicle_records.length > 0 && (
            <Title level={4}>Average Parking Time: <span style={{ fontWeight: 'normal' }}>{
              formatStayTime(props.vehicleInfo.vehicle_records.reduce((acc, item) => acc + getStayTime(item.start_time, item.end_time), 0) / props.vehicleInfo.vehicle_records.length)
            }</span></Title>
          )
        }
        <Title level={4}>Historical Parking Records:</Title>
        <List
          size='large'
          bordered
          dataSource={props.vehicleInfo.vehicle_records}
          renderItem={(item) => (
            <List.Item>
              <RecordItem
                position={item.position}
                stayTime={getStayTime(item.start_time, item.end_time)}
              />
            </List.Item>
          )}
        />
      </Col>
      <Col span={12} style={{ paddingLeft: '12px' }} >
        {
          props.vehicleInfo.owner_info.id !== null
            ? (
              <>
                <Title
                  level={3}
                  style={{
                    textAlign: 'center'
                  }}
                >
                  Owner: {props.vehicleInfo.owner_info.name}
                </Title>
                <Title level={4}>Role: <span style={{ fontWeight: 'normal' }}>{
                  props.vehicleInfo.owner_info.job_title ?? 'Unknown'
                }</span></Title>
                <Title level={4}>Email: {
                  props.vehicleInfo.owner_info.email !== undefined && props.vehicleInfo.owner_info.email !== ''
                    ? <a href={`mailto:${props.vehicleInfo.owner_info.email}`} style={{ fontWeight: 'normal' }}>{props.vehicleInfo.owner_info.email}</a>
                    : <span style={{ fontWeight: 'normal' }}>Unknown</span>
                }</Title>
                <Title level={4}>Phone: {
                  props.vehicleInfo.owner_info.phone !== undefined && props.vehicleInfo.owner_info.phone !== ''
                    ? <a href={`tel:${props.vehicleInfo.owner_info.phone}`} style={{ fontWeight: 'normal' }}>{props.vehicleInfo.owner_info.phone}</a>
                    : <span style={{ fontWeight: 'normal' }}>Unknown</span>
                }</Title>
                <Title level={4}>Priority: <span style={{ fontWeight: 'normal' }}>{props.vehicleInfo.owner_info.priority ?? 'Unknown'}</span></Title>
                <Title level={4}>Other Vehicles:</Title>
                <List
                  size='large'
                  bordered
                  dataSource={props.vehicleInfo.owner_other_vehicle}
                  renderItem={(item) => (
                    <List.Item>
                      <OtherVehicleItem
                        license={item.license_plate_no}
                        position={item.position}
                      />
                    </List.Item>
                  )}
                />
              </>
              )
            : <Flex align='center' justify='center' style={{ width: '100%', height: '100%' }}>Owner not registered.</Flex>
        }
      </Col>
    </Row>
  )
}

const Dashboard = ({ instance }: any): React.ReactElement => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [carId, setCarId] = useState('')
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo>()
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
    axios.get<VehicleInfo>(`guards/vehicles/${id}`, getAxiosConfig())
      .then(response => {
        setVehicleInfo(response.data)
        setCarId(id)
        setIsModalOpen(true)
      })
      .catch(error => {
        if (error.response.status === 404) {
          noti.error({
            message: `License Plate Number "${id}" not found.`,
            placement: 'bottomRight',
            duration: 3
          })
        } else {
          console.error(error)
        }
      })
  }
  return (
    <TokenRefresh instance={instance}>
    <Layout>
      {notiContextHolder}
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          backgroundColor: styles.white,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Space>
          <span style={{ width: '150px', color: styles.primaryColor, fontWeight: 'bold' }} >Quick Parking</span>
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
          open={isModalOpen && typeof vehicleInfo !== 'undefined'}
          footer={null}
          onCancel={() => { setIsModalOpen(false) }}
          width='80%'
        >
          {
            typeof vehicleInfo !== 'undefined'
              ? <VehicleModal id={carId} vehicleInfo={vehicleInfo} />
              : undefined
          }
        </Modal>
      </Content>
    </Layout>
    </TokenRefresh>
  )
}

export default Dashboard
