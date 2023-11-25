import React from 'react'
import { Input, Flex } from 'antd'

const Setting = (): React.ReactElement => {
  return (
    <Flex vertical style={{ overflow: 'hidden' }}>
      <Input addonBefore="Name" placeholder="Alice" />
      <Input addonBefore="Role" placeholder="Employee" />
      <Input addonBefore="Email" placeholder="alice@company.co" />
      <Input addonBefore="Phone" placeholder="0987654321" />
      <Input addonBefore="Car ID" placeholder="EAH-1688" />
    </Flex>
  )
}

export default Setting
