import React, { useEffect, useState } from 'react'
import { Flex, List } from 'antd'
import { useParkingLotList } from '../../hooks'
import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import axios from 'axios'
import { type UserInfo } from '../Home'
import { getAxiosConfig } from '../../utils/api'

const ParkingLotList = (): React.ReactElement => {
  const [favorites, setFavorotes] = useState<boolean[]>([])
  const lotList = useParkingLotList()

  useEffect(() => {
    if (lotList.length > 0 && lotList.length !== favorites.length) {
      axios.get<UserInfo>('users/page_info/', getAxiosConfig())
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
    console.log(config)
    if (newFavorite[index]) {
      axios.post(resource, null, config)
        .catch(error => { console.error(error) })
    } else {
      axios.delete(resource, config)
        .catch(error => { console.error(error) })
    }
  }

  return (
    <List
      size='large'
      bordered
      dataSource={lotList}
      renderItem={(item, index) => (
        <List.Item>
          <Flex justify='space-between' align='center' style={{ width: '100%' }}>
            <div>{item.name}</div>
            {
              favorites.length > index && favorites[index]
                ? <HeartFilled onClick={() => { handleSetFavorites(index) }} style={{ color: '#B32A2A' }} />
                : <HeartOutlined onClick={() => { handleSetFavorites(index) }} style={{ color: '#979797' }} />
            }
          </Flex>
        </List.Item>
      )}
    />
  )
}

export default ParkingLotList
