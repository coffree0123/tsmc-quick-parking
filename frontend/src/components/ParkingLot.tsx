import { Flex, Skeleton, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import { type Slots, useParkingLot, type ParkingInfo } from '../hooks'

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
    <Flex vertical gap='middle' style={{ width: '100%', height: '500px', overflow: 'scroll' }}>
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

const ParkingLot = (props: { id: number, openCarInfo?: (id: string) => void }): React.ReactElement => {
  const [floorId, setFloorId] = useState<number>(0)
  const lotInfo = useParkingLot(props.id)

  const changeMap = (key: string): void => {
    setFloorId(Number(key))
  }

  return (
    <Flex vertical style={{ overflow: 'hidden' }}>
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
                parkedSlots={lotInfo.floor_info[floorId].parked_slots}
                openCarInfo={props.openCarInfo}
              />
            </>
            )
      }
    </Flex>
  )
}

export default ParkingLot
