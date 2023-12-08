import { Flex, Skeleton, Tabs, Typography } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { getAxiosConfig } from '../utils/api'

const { Title } = Typography

interface SlotInfo {
  isFree: boolean
  hasPriority: boolean
}

const ParkingSlot = (props: { name: string, slotInfo: SlotInfo }): React.ReactElement => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '66px',
        height: '145px',
        border: 'gray 3px solid',
        backgroundColor: props.slotInfo.isFree
          ? (props.slotInfo.hasPriority ? 'lightblue' : 'transparent')
          : 'lightgray'
      }}>
      {props.slotInfo.isFree && props.name}
    </div>
  )
}

type Slots = number[]

interface ParkingLotMapProps {
  prefix: string
  numRows: number
  numCols: number
  freeSlots: Slots
  prioritySlots: Slots
}

const ParkingLotMap = (props: ParkingLotMapProps): React.ReactElement => {
  const [map, setMap] = useState<SlotInfo[][]>(Array(props.numRows).fill(null).map(() => (
    Array(props.numCols).fill(null).map(() => ({
      isFree: false,
      hasPriority: false
    }))
  )))
  const numPads = Math.floor(Math.log10(props.numRows * props.numCols)) + 1

  useEffect(() => {
    const newMap: SlotInfo[][] = Array(props.numRows).fill(null).map(() => (
      Array(props.numCols).fill(null).map(() => ({
        isFree: false,
        hasPriority: false
      }))
    ))
    const parseIndex = (index: number): [number, number] => {
      const row = Math.floor(index / props.numCols)
      const col = index % props.numCols
      return [row, col]
    }
    for (const [row, col] of props.freeSlots.map(parseIndex)) {
      newMap[row][col].isFree = true
    }
    for (const [row, col] of props.prioritySlots.map(parseIndex)) {
      newMap[row][col].hasPriority = true
    }
    setMap(newMap)
  }, [props.freeSlots])

  return (
    <Flex vertical gap='middle' style={{ width: '100%', height: '500px', overflow: 'scroll' }}>
      {map.map((item, i) => (
        <Flex key={i} gap='small' style={{ width: `${66 * props.numCols + 8 * (props.numCols - 1)}px` }}>
          {item.map((slotInfo, j) => (
            <ParkingSlot
              key={j}
              name={`${props.prefix}${String(i * props.numCols + j + 1).padStart(numPads, '0')}`}
              slotInfo={slotInfo}
            />
          ))}
        </Flex>
      ))}
    </Flex>
  )
}

interface FloorInfo {
  floor: string
  free_slots: Slots
  priority_slots: Slots
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
    axios.get<LotInfo>(`users/parkinglots/${props.id}`, getAxiosConfig())
      .then(response => {
        console.log(response.data)
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
                prioritySlots={lotInfo.floor_info[floorId].priority_slots}
              />
            </>
            )
      }
    </Flex>
  )
}

export default ParkingLot
