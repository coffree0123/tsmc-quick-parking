import { Col, Flex, List, Row, Skeleton, Typography } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { getAxiosConfig } from '../../utils/api'
import { getStayTime, formatStayTime } from '../Dashboard'
import { useUserInfo } from '../../hooks'
import { styles } from '../../constants'
import background from '../../assets/background.svg'

const { Title, Text } = Typography

interface SlotCardProps {
  title: string
  value: number
  id: number
}

const cardSize = 150

const LotCard = (props: SlotCardProps): React.ReactElement => {
  return (
    <Flex
      vertical
      align='center'
      justify='space-around'
      style={{
        backgroundColor: styles.primaryColor,
        color: styles.white,
        height: `${cardSize}px`,
        width: `${cardSize}px`,
        borderRadius: '20px',
        boxShadow: '3px 5px 5px rgba(0, 0, 0, 0.3)'
      }}
    >
      <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{props.title}</div>
      <div style={{ fontSize: '3em', fontWeight: 'bold' }}>{props.value}</div>
      <Flex justify='flex-end' style={{ width: '80%' }}>
        <Link to={`/parkinglots/${props.id}`} style={{ color: styles.white }}>
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

const cardGap = 30
const padding = 30

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

  const favoriteWidth = pageInfo === undefined || pageInfo.favorite_buildings.length === 0
    ? '100%'
    : `${
        cardSize * pageInfo.favorite_buildings.length +
        cardGap * (pageInfo.favorite_buildings.length - 1) +
        padding
      }px`

  return (
    <Flex vertical style={{
      height: '100%',
      overflow: 'hidden',
      backgroundImage: `url(${background})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      paddingTop: '80px'
    }}>
      <Title style={{ padding: `0 ${padding}px` }}>
        Hi{typeof userInfo !== 'undefined' && userInfo.name !== '' && ` ${userInfo.name}`}!
      </Title>
      <div>
        <Title level={2} style={{ padding: `0 ${padding}px` }}>Your favorites</Title>
        <div style={{ overflowX: 'auto' }}>
          {
            pageInfo === undefined
              ? <Skeleton active style={{ padding: `0 ${padding}px` }} />
              : (
                <Flex gap='large' style={{ width: favoriteWidth, padding: `10px ${padding}px` }}>
                  {
                    pageInfo.favorite_buildings.length === 0
                      ? (
                          <Text>
                            {'You haven\'t added favorite parking lot yet'},
                            check <Link to='/parkinglots'>Parking Lots</Link> to add some.
                          </Text>
                        )
                      : (
                          pageInfo.favorite_buildings.map((item, index) => (
                            <LotCard key={index} title={item.building_name} value={Number(item.free_num)} id={item.build_id} />
                          ))
                        )
                  }
                </Flex>
                )
          }
        </div>
      </div>
      <div>
        <Title level={2} style={{ padding: `0 ${padding}px` }}>Parked Vehicles</Title>
        {
          pageInfo === undefined
            ? <Skeleton active style={{ padding: `0 ${padding}px` }} />
            : (
                pageInfo.parked_vehicles.length === 0
                  ? (
                    <div style={{ padding: `0 ${padding}px` }}>
                      <Text>
                        Your vehicle is not parked in our parking lot now.
                        To update vehicle information, visit <Link to='/vehicles'>Vehicles</Link>.
                      </Text>
                    </div>
                    )
                  : (
                    <List
                      size='large'
                      bordered
                      style={{
                        backgroundColor: styles.white,
                        borderRadius: '10px',
                        boxShadow: '3px 5px 5px rgba(0, 0, 0, 0.3)'
                      }}
                      dataSource={pageInfo.parked_vehicles}
                      renderItem={(item) => (
                        <List.Item style={{ justifyContent: 'center', paddingLeft: `${padding}px`, paddingRight: `${padding}px` }}>
                          <Row style={{ width: '100%' }}>
                            <Col span={8}>{item.model !== '' ? item.model : item.license_plate_no}</Col>
                            <Col span={8}>{item.parkinglot_name}, <span style={{ color: 'gray' }}>{item.position}</span></Col>
                            <Col span={8} style={{ textAlign: 'right' }}>{formatStayTime(getStayTime(item.start_time))}</Col>
                          </Row>
                        </List.Item>
                      )}
                    />
                    )
              )
        }
      </div>
    </Flex>
  )
}

export default Home
