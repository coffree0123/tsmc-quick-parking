import React, { useContext, useEffect, useState } from 'react'
import { Col, List, Row } from 'antd'
import { useParkingLotList } from '../hooks'
import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import axios from 'axios'
import { type PageInfo } from './Home'
import { getAxiosConfig } from '../utils/api'
import { styles } from '../constants'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import UserLayout from '../components/UserLayout'
import LoginButton from '../components/LoginButton'
import TokenRefresh from '../components/TokenRefresh'
import { MsalProvider } from '@azure/msal-react'

const ParkingLotList = ({ instance }: any): React.ReactElement => {
  const { token, isGuard } = useContext(AuthContext)
  const [favorites, setFavorotes] = useState<boolean[]>([])
  const lotList = useParkingLotList()
  const navigate = useNavigate()

  useEffect(() => {
    if (lotList.length > 0 && lotList.length !== favorites.length && token !== undefined && !isGuard) {
      axios.get<PageInfo>('users/page_info/', getAxiosConfig())
        .then(response => {
          const newFavorites = Array(lotList.length).fill(false)
          const id2Index: Record<number, number> = {}
          lotList.forEach((item, index) => {
            id2Index[item.id] = index
          })
          for (const item of response.data.favorite_buildings) {
            newFavorites[id2Index[item.build_id]] = true
          }
          setFavorotes(newFavorites)
        })
        .catch(error => { console.error(error) })
    }
  }, [lotList])

  const handleSetFavorites = (index: number): void => {
    const newFavorite = [...favorites]
    newFavorite[index] = !newFavorite[index] // toggle
    setFavorotes(newFavorite)
    const resource = 'users/favorite_lots'
    const config = {
      ...getAxiosConfig(),
      params: {
        parking_lot: lotList[index].id
      }
    }
    if (newFavorite[index]) {
      axios.post(resource, null, config)
        .catch(error => { console.error(error) })
    } else {
      axios.delete(resource, config)
        .catch(error => { console.error(error) })
    }
  }

  return (
    <MsalProvider instance={instance}>
    <TokenRefresh instance={instance}>
      <UserLayout active='parkinglots' title='Parking Lots' action={token === undefined && <LoginButton />}>
        <List
          size='large'
          bordered
          dataSource={lotList}
          renderItem={(item, index) => (
            <List.Item>
              <Row style={{ width: '100%', height: '100%' }}>
                <Col span={23} onClick={() => { navigate(`/parkinglots/${item.id}`) }}>{item.name}</Col>
                <Col span={1} style={{ display: 'flex', justifyContent: 'end' }}>
                {
                  token !== undefined && !isGuard &&
                  (
                    favorites.length > index && favorites[index]
                      ? <HeartFilled onClick={() => { handleSetFavorites(index) }} style={{ color: styles.primaryColor }} />
                      : <HeartOutlined onClick={() => { handleSetFavorites(index) }} style={{ color: '#979797' }} />
                  )
                }
                </Col>
              </Row>
            </List.Item>
          )}
        />
      </UserLayout>
    </TokenRefresh>
    </MsalProvider>
  )
}

export default ParkingLotList
