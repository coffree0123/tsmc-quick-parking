import { Flex, Skeleton, Tabs, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { type Slots, type ParkingInfo, type LotInfo, type ParkingLotSummary } from '../hooks'
import { styles } from '../constants'
import carSVG from '../assets/car.svg'

const { Title } = Typography

interface SlotInfo {
  isFree: boolean
  hasPriority: boolean
  license?: string
  isIllegal?: boolean
  enrolled?: boolean
}

const slotWidth = 100
const slotHeight = 220

const ParkingSlot = (props: { name: string, slotInfo: SlotInfo, onClick?: React.MouseEventHandler<HTMLDivElement> }): React.ReactElement => {
  const slotStyle: Record<string, string> = {}
  if (props.slotInfo.hasPriority) {
    slotStyle.borderColor = 'dodgerblue'
    slotStyle.backgroundColor = styles.lightBlue
  }
  if (!props.slotInfo.isFree) {
    if (!props.slotInfo.hasPriority) {
      slotStyle.backgroundColor = styles.lightGray
    }
    if (props.slotInfo.isIllegal === true) {
      slotStyle.backgroundColor = styles.lightOrange
    } else if (typeof props.slotInfo.enrolled !== 'undefined' && !props.slotInfo.enrolled) {
      slotStyle.backgroundColor = styles.lightYellow
    }
  }
  return (
    <Flex
      vertical
      style={{
        justifyContent: 'center',
        width: `${slotWidth}px`,
        height: `${slotHeight}px`,
        border: 'gray 5px solid',
        textAlign: 'center',
        backgroundColor: styles.white,
        ...slotStyle,
        ...(props.slotInfo.license !== undefined ? { cursor: 'pointer' } : {})
      }}
      onClick={props.slotInfo.license !== undefined ? props.onClick : undefined}
    >
      {
        props.slotInfo.isIllegal === true &&
        <Title level={5} style={{ margin: 0, color: styles.darkGray }}>Illegal</Title>
      }
      {
        typeof props.slotInfo.enrolled !== 'undefined' && !props.slotInfo.enrolled &&
        <Title level={5} style={{ margin: 0, color: styles.darkGray }}>Unenrolled</Title>
      }
      {
        !props.slotInfo.isFree &&
        <img src={carSVG} alt="Parked" />
      }
      <Title level={3} style={{ margin: 0, fontWeight: 'bold', ...(props.slotInfo.hasPriority ? { color: 'dodgerblue' } : { color: styles.darkGray }) }}>{props.name}</Title>
      {
        props.slotInfo.license !== undefined &&
        <Title level={5} style={{ margin: 0, color: styles.darkGray }}>{props.slotInfo.license}</Title>
      }
    </Flex>
  )
}

interface ParkingLotMapProps {
  prefix: string
  numRows: number
  numCols: number
  freeSlots?: Slots
  prioritySlots: Slots
  parkedSlots?: ParkingInfo[]
  openCarInfo?: (id: string) => void
}

const ParkingLotMap = (props: ParkingLotMapProps): React.ReactElement => {
  const defaultFree = props.freeSlots === undefined
  const [map, setMap] = useState<SlotInfo[][]>(Array(props.numRows).fill(null).map(() => (
    Array(props.numCols).fill(null).map(() => ({
      isFree: defaultFree,
      hasPriority: false
    }))
  )))
  const numPads = Math.floor(Math.log10(props.numRows * props.numCols)) + 1

  useEffect(() => {
    const newMap: SlotInfo[][] = Array(props.numRows).fill(null).map(() => (
      Array(props.numCols).fill(null).map(() => ({
        isFree: defaultFree,
        hasPriority: false
      }))
    ))
    const parseIndex = (index: number): [number, number] => {
      const row = Math.floor(index / props.numCols)
      const col = index % props.numCols
      return [row, col]
    }
    if (props.freeSlots !== undefined) {
      for (const [row, col] of props.freeSlots.map(parseIndex)) {
        newMap[row][col].isFree = true
      }
    }
    for (const [row, col] of props.prioritySlots.map(parseIndex)) {
      newMap[row][col].hasPriority = true
    }
    if (props.parkedSlots !== undefined) {
      for (const item of props.parkedSlots) {
        const [row, col] = parseIndex(item.index)
        newMap[row][col].isFree = false
        newMap[row][col].license = item.license_plate_no
        newMap[row][col].isIllegal = item.illegally_parked
        newMap[row][col].enrolled = item.car_owner_enrolled
      }
    }
    setMap(newMap)
  }, [props.freeSlots, props.parkedSlots, props.prioritySlots])

  return (
    <Flex vertical gap='large' style={{ width: '100%', height: '100%', overflow: 'auto', borderRadius: '10px', boxShadow: 'inset 0 0 10px #000', backgroundColor: styles.white, padding: '30px' }}>
      {map.map((item, i) => (
        <Flex key={i} gap='middle' style={{ width: `${slotWidth * props.numCols + 16 * (props.numCols - 1)}px` }}>
          {item.map((slotInfo, j) => (
            <ParkingSlot
              key={j}
              name={`${props.prefix}${String(i * props.numCols + j + 1).padStart(numPads, '0')}`}
              slotInfo={slotInfo}
              onClick={
                typeof props.openCarInfo !== 'undefined' && typeof slotInfo.license !== 'undefined'
                  ? () => { if (props.openCarInfo !== undefined && slotInfo.license !== undefined) { props.openCarInfo(slotInfo.license) } }
                  : undefined
              }
            />
          ))}
        </Flex>
      ))}
    </Flex>
  )
}

const ParkingLot = (props: { lotInfo?: LotInfo, summary?: ParkingLotSummary, openCarInfo?: (id: string) => void }): React.ReactElement => {
  const [floorId, setFloorId] = useState<number>(0)

  const changeMap = (key: string): void => {
    setFloorId(Number(key))
  }

  useEffect(() => {
    if (
      (props.lotInfo !== undefined && floorId >= props.lotInfo.floor_info.length) ||
      (props.summary !== undefined && floorId >= props.summary.floors.length)
    ) {
      setFloorId(0)
    }
  }, [props.lotInfo, props.summary])

  return (
    <Flex vertical style={{ height: '100%' }}>
      {
        (
          (props.lotInfo === undefined || floorId >= props.lotInfo.floor_info.length) ||
          (props.summary === undefined || floorId >= props.summary.floors.length)
        )
          ? <Skeleton active />
          : (
            <>
              <Tabs
                type='card'
                items={props.lotInfo.floor_info.map((item, index) => ({ key: String(index), label: `${item.floor}${props.summary !== undefined ? ` (${props.summary.floors[index].numFree}/${props.summary.floors[index].numSlots})` : ''}` }))}
                onChange={changeMap}
                style={{ backgroundColor: styles.white }}
                tabBarGutter={3}
                tabBarStyle={{ backgroundColor: styles.lightGray, padding: '0 10px' }}
              />
              <ParkingLotMap
                prefix={String(floorId + 1)}
                numRows={props.lotInfo.num_row}
                numCols={props.lotInfo.num_col}
                freeSlots={props.lotInfo.floor_info[floorId].free_slots}
                prioritySlots={props.lotInfo.floor_info[floorId].priority_slots}
                parkedSlots={props.lotInfo.floor_info[floorId].parked_slots}
                openCarInfo={props.openCarInfo}
              />
            </>
            )
      }
    </Flex>
  )
}

export default ParkingLot
