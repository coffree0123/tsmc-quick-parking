import { Flex, List, Typography } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import React from 'react'

const { Title } = Typography

interface SlotCardProps {
  title: string
  value: number
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
        <ArrowRightOutlined style={{ fontSize: '1.5em' }} />
      </Flex>
    </Flex>
  )
}

const Home = (): React.ReactElement => {
  const LotInfo: SlotCardProps[] = [
    { title: 'Factory B', value: 134 },
    { title: 'Office F', value: 57 },
    { title: 'Office D', value: 65 }
  ]

  const Vehicles = [
    { name: 'Toyota', lot: 'Office A', slot: 'B5#503' },
    { name: 'Gogoro', lot: 'Factory B', slot: 'B1#127' }
  ]

  return (
    <Flex vertical style={{ overflow: 'hidden' }}>
      <Title>Hi Alice!</Title>
      <div>
        <Title level={2}>Your favorites</Title>
        <div style={{ overflowX: 'scroll' }}>
          <Flex gap='large' style={{ width: '150%' }}>
            {
              LotInfo.map(({ title, value }, index) => (
                <LotCard key={index} title={title} value={value} />
              ))
            }
          </Flex>
        </div>
      </div>
      <div>
        <Title level={2}>Parked Vehicles</Title>
        <List
          size='large'
          bordered
          dataSource={Vehicles}
          renderItem={(item) => (
            <List.Item>
              <Flex justify='space-between' style={{ width: '100%' }}>
                <div>{item.name}</div>
                <div>{item.lot}, <span style={{ color: 'gray' }}>{item.slot}</span></div>
              </Flex>
            </List.Item>
          )}
        />
      </div>
    </Flex>
  )
}

export default Home
