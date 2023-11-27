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

interface ParkingLotMapProps {
  prefix: string
  map: boolean[][]
}

const ParkingLotMap = (props: ParkingLotMapProps): React.ReactElement => {
  const numRows = props.map.length
  const numCols = props.map[0].length
  const numPads = Math.floor(Math.log10(numRows * numCols)) + 1
  return (
    <Flex vertical gap='middle' style={{ width: '100%', height: '500px', overflow: 'scroll' }}>
      {props.map.map((item, i) => (
        <Flex key={i} gap='small' style={{ width: `${66 * numCols + 8 * (numCols - 1)}px` }}>
          {item.map((isOccupied, j) => <ParkingSlot key={j} name={`${props.prefix}${String(i * numCols + j + 1).padStart(numPads, '0')}`} isOccupied={isOccupied} />)}
        </Flex>
      ))}
    </Flex>
  )
}

interface LotInfo {
  num_row: number
  num_col: number
  num_floor: number
  free_slots: string[]
}

const ParkingLot = (props: { id: number }): React.ReactElement => {
  const [floorId, setFloorId] = useState<number>(0)
  const [lotInfo, setLotInfo] = useState<LotInfo>()
  const [maps, setMaps] = useState<boolean[][][]>()

  useEffect(() => {
    axios.get<LotInfo>(`parkinglots/${props.id}/free-slots`)
      .then(response => {
        setLotInfo(response.data)
        const resMaps = Array(response.data.num_floor).fill(null).map(() =>
          Array(response.data.num_row).fill(null).map(() => Array(response.data.num_col).fill(false))
        )
        response.data.free_slots.forEach(slot => {
          const [floor, index] = slot.split('#')
          const row = Math.floor(Number(index) / response.data.num_col)
          const col = Number(index) % response.data.num_col
          resMaps[Number(floor) - 1][row][col] = true
        })
        setMaps(resMaps)
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
        lotInfo === undefined || maps === undefined
          ? <Skeleton active />
          : (
            <>
              <Tabs
                type='card'
                items={Array.from(Array(lotInfo.num_floor).keys()).map(index => ({ key: String(index), label: `B${index + 1}` }))}
                onChange={changeMap}
              />
              <ParkingLotMap prefix={String(floorId + 1)} map={maps[floorId]} />
            </>
            )
      }
    </Flex>
  )
}

export default ParkingLot
