import { Flex, List, Skeleton, Typography } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LogOutButton from '../../components/LogOutButton'
import { MsalProvider } from '@azure/msal-react'
import axios from 'axios'
import { getAxiosConfig } from '../../utils/api'

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
        backgroundColor: '#B32A2A',
        color: 'white',
        height: '150px',
        width: '150px',
        borderRadius: '20px'
      }}
    >
      <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{props.title}</div>
      <div style={{ fontSize: '3em', fontWeight: 'bold' }}>{props.value}</div>
      <Flex justify='flex-end' style={{ width: '80%' }}>
        <Link to={`parkingLot/${props.id}`} style={{ color: 'white' }}>
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

interface UserInfo {
  favorite_buildings: BuildingInfo[]
  parked_vehicles: VehicleInfo[]
}

const Home = ({ instance }: any): React.ReactElement => {
  const [userInfo, setUserInfo] = useState<UserInfo>()

  useEffect(() => {
    axios.get<UserInfo>('users/page_info/', getAxiosConfig())
      .then(response => {
        setUserInfo(response.data)
      })
      .catch(error => { console.error(error) })
  }, [])

  return (
    <MsalProvider instance={instance}>
    <Flex vertical style={{ overflow: 'hidden' }}>
      <Title>Hi Alice!</Title>
      <div>
        <Title level={2}>Your favorites</Title>
        <div style={{ overflowX: 'scroll' }}>
          {
            userInfo === undefined
              ? <Skeleton active />
              : (
                <Flex gap='large' style={{ width: '150%' }}>
                  {
                    userInfo.favorite_buildings.map((item, index) => (
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
          userInfo === undefined
            ? <Skeleton active />
            : (
              <List
                size='large'
                bordered
                dataSource={userInfo.parked_vehicles}
                renderItem={(item) => (
                  <List.Item>
                    <Flex justify='space-between' style={{ width: '100%' }}>
                      <div>{item.model}</div>
                      <div>{item.parkinglot_name}, <span style={{ color: 'gray' }}>{item.position}</span></div>
                    </Flex>
                  </List.Item>
                )}
              />
              )
        }
      </div>
      <LogOutButton />
    </Flex>
    </MsalProvider>
  )
}

export default Home
