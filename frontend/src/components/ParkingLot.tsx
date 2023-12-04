import { Flex, Skeleton, Tabs, Typography } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const { Title } = Typography

const ParkingSlot = (props: { name: string, isOccupied: boolean }): React.ReactElement => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '66px',
        height: '145px',
        border: 'gray 3px solid',
        backgroundColor: props.isOccupied ? 'lightgray' : 'transparent'
      }}>
      {props.isOccupied || props.name}
    </div>
  )
}

type FreeSlots = number[]

interface ParkingLotMapProps {
  prefix: string
  numRows: number
  numCols: number
  freeSlots: FreeSlots
}

const ParkingLotMap = (props: ParkingLotMapProps): React.ReactElement => {
  const [map, setMap] = useState<boolean[][]>(Array(props.numRows).fill(null).map(() => Array(props.numCols).fill(false)))
  const numPads = Math.floor(Math.log10(props.numRows * props.numCols)) + 1

  useEffect(() => {
    const newMap = Array(props.numRows).fill(null).map(() => Array(props.numCols).fill(false))
    props.freeSlots.forEach(index => {
      const row = Math.floor(index / props.numCols)
      const col = index % props.numCols
      newMap[row][col] = true
    })
    setMap(newMap)
  }, [props.freeSlots])

  return (
    <Flex vertical gap='middle' style={{ width: '100%', height: '500px', overflow: 'scroll' }}>
      {map.map((item, i) => (
        <Flex key={i} gap='small' style={{ width: `${66 * props.numCols + 8 * (props.numCols - 1)}px` }}>
          {item.map((isOccupied, j) => <ParkingSlot key={j} name={`${props.prefix}${String(i * props.numCols + j + 1).padStart(numPads, '0')}`} isOccupied={isOccupied} />)}
        </Flex>
      ))}
    </Flex>
  )
}

interface FloorInfo {
  floor: string
  free_slots: FreeSlots
}

interface LotInfo {
  num_row: number
  num_col: number
  num_floor: number
  floor_info: FloorInfo[]
}

const ParkingLot = (props: { id: number }): React.ReactElement => {
  const [floorId, setFloorId] = useState<number>(0)
  const [lotInfo, setLotInfo] = useState<LotInfo>()

  useEffect(() => {
    axios.get<LotInfo>(`users/parkinglots/${props.id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('idToken')}` } })
      .then(response => {
        setLotInfo(response.data)
      })
      .catch(error => { console.error(error) })
  }, [])

  const changeMap = (key: string): void => {
    setFloorId(Number(key))
  }

  return (
    <Flex vertical style={{ overflow: 'hidden' }}>
      <Title level={3}>Map id: {props.id}</Title>
      {
        lotInfo === undefined
          ? <Skeleton active />
          : (
            <>
              <Tabs
                type='card'
                items={lotInfo.floor_info.map((item, index) => ({ key: String(index), label: item.floor }))}
                onChange={changeMap}
              />
              <ParkingLotMap
                prefix={String(floorId + 1)}
                numRows={lotInfo.num_row}
                numCols={lotInfo.num_col}
                freeSlots={lotInfo.floor_info[floorId].free_slots}
              />
            </>
            )
      }
    </Flex>
  )
}

export default ParkingLot
