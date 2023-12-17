import { Flex, Skeleton, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import { type Slots, type ParkingInfo, type LotInfo, type ParkingLotSummary } from '../hooks'
import { styles } from '../constants'

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
    slotStyle.outline = 'dodgerblue 5px solid'
    slotStyle.outlineOffset = '-10px'
  }
  if (props.slotInfo.isFree) {
    slotStyle.backgroundColor = 'transparent'
  } else {
    if (typeof props.slotInfo.isIllegal !== 'undefined' && props.slotInfo.isIllegal) {
      slotStyle.backgroundColor = 'red'
    } else if (typeof props.slotInfo.enrolled !== 'undefined' && !props.slotInfo.enrolled) {
      if (props.slotInfo.hasPriority) {
        slotStyle.backgroundColor = 'orange'
      } else {
        slotStyle.backgroundColor = 'yellow'
      }
    } else {
      slotStyle.backgroundColor = 'lightgray'
    }
  }
  return (
    <Flex
      vertical
      style={{
        justifyContent: 'center',
        width: `${slotWidth}px`,
        height: `${slotHeight}px`,
        border: 'gray 3px solid',
        textAlign: 'center',
        ...slotStyle,
        ...(props.slotInfo.license !== undefined ? { cursor: 'pointer' } : {})
      }}
      onClick={props.slotInfo.license !== undefined ? props.onClick : undefined}
    >
      {
        props.slotInfo.license !== undefined ? <>License:<br/>{props.slotInfo.license}</> : props.name
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
    <Flex vertical gap='middle' style={{ width: '100%', height: '100%', overflow: 'auto', borderRadius: '10px', boxShadow: 'inset 0 0 10px #000', backgroundColor: styles.white }}>
      {map.map((item, i) => (
        <Flex key={i} gap='small' style={{ width: `${slotWidth * props.numCols + 8 * (props.numCols - 1)}px` }}>
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

  return (
    <Flex vertical style={{ height: '100%' }}>
      {
        props.lotInfo === undefined
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
