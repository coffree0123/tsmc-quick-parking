import { Col, Flex, List, Row, Skeleton, Typography } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LogOutButton from '../../components/LogOutButton'
import axios from 'axios'
import { getAxiosConfig } from '../../utils/api'
import { getStayTime, formatStayTime } from '../Dashboard'
import { useUserInfo } from '../../hooks'
import { styles } from '../../constants'

const { Title } = Typography

interface SlotCardProps {
  title: string
  value: number
  id: number
}

const LotCard = (props: SlotCardProps): React.ReactElement => {
  return (
    <Flex
      vertical
      align='center'
      justify='space-around'
      style={{
        backgroundColor: styles.primaryColor,
        color: 'white',
        height: '150px',
        width: '150px',
        borderRadius: '20px'
      }}
    >
      <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{props.title}</div>
      <div style={{ fontSize: '3em', fontWeight: 'bold' }}>{props.value}</div>
      <Flex justify='flex-end' style={{ width: '80%' }}>
        <Link to={`/parkinglots/${props.id}`} style={{ color: 'white' }}>
          <ArrowRightOutlined style={{ fontSize: '1.5em' }} />
        </Link>
      </Flex>
    </Flex>
  )
}

interface BuildingInfo {
  build_id: number
  building_name: string
  free_num: string
}

interface VehicleInfo {
  license_plate_no: string
  model: string
  start_time: string
  parkinglot_name: string
  position: string
}

export interface PageInfo {
  favorite_buildings: BuildingInfo[]
  parked_vehicles: VehicleInfo[]
}

const Home = (): React.ReactElement => {
  const [pageInfo, setPageInfo] = useState<PageInfo>()
  const userInfo = useUserInfo()

  useEffect(() => {
    axios.get<PageInfo>('users/page_info/', getAxiosConfig())
      .then(response => {
        setPageInfo(response.data)
      })
      .catch(error => { console.error(error) })
  }, [])

  return (
    <Flex vertical style={{ overflow: 'hidden' }}>
      <Title>Hi{typeof userInfo !== 'undefined' && userInfo.name !== '' && ` ${userInfo.name}`}!</Title>
      <div>
        <Title level={2}>Your favorites</Title>
        <div style={{ overflowX: 'scroll' }}>
          {
            pageInfo === undefined
              ? <Skeleton active />
              : (
                <Flex gap='large' style={{ width: '150%' }}>
                  {
                    pageInfo.favorite_buildings.map((item, index) => (
                      <LotCard key={index} title={item.building_name} value={Number(item.free_num)} id={item.build_id} />
                    ))
                  }
                </Flex>
                )
          }
        </div>
      </div>
      <div>
        <Title level={2}>Parked Vehicles</Title>
        {
          pageInfo === undefined
            ? <Skeleton active />
            : (
              <List
                size='large'
                bordered
                dataSource={pageInfo.parked_vehicles}
                renderItem={(item) => (
                  <List.Item style={{ justifyContent: 'center', paddingLeft: '10px', paddingRight: '10px' }}>
                    <Row style={{ width: '100%' }}>
                      <Col span={6}>{item.model !== '' ? item.model : item.license_plate_no}</Col>
                      <Col span={9}>{item.parkinglot_name}, <span style={{ color: 'gray' }}>{item.position}</span></Col>
                      <Col span={9} style={{ textAlign: 'right' }}>{formatStayTime(getStayTime(item.start_time))}</Col>
                    </Row>
                  </List.Item>
                )}
              />
              )
        }
      </div>
      <LogOutButton />
    </Flex>
  )
}

export default Home
