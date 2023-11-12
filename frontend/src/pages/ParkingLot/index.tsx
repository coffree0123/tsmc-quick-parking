import { Flex, Tabs, Typography } from 'antd'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

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
          {item.map((isOccupied, j) => <ParkingSlot key={j} name={`${props.prefix}${String(i * numCols + j).padStart(numPads, '0')}`} isOccupied={isOccupied} />)}
        </Flex>
      ))}
    </Flex>
  )
}

const numCols = 20
const numRows = 10
const randomMaps = (): boolean[][] => Array(numRows).fill(null).map(() => Array(numCols).fill(null).map(() => (Math.random() > 0.5)))
const LotItems = [
  { name: 'B1', map: randomMaps() },
  { name: 'B2', map: randomMaps() },
  { name: 'B3', map: randomMaps() }
]

const ParkingLot = (): React.ReactElement => {
  const [floorId, setFloorId] = useState<number>(0)
  const { id } = useParams()

  const changeMap = (key: string): void => {
    setFloorId(Number(key))
  }

  return (
    <Flex vertical style={{ overflow: 'hidden' }}>
      <Title>Map id: {id}</Title>
      <Tabs
        type='card'
        items={LotItems.map((item, index) => ({ key: String(index), label: item.name }))}
        onChange={changeMap}
      />
      <ParkingLotMap prefix={String(floorId + 1)} map={LotItems[floorId].map} />
    </Flex>
  )
}

export default ParkingLot
