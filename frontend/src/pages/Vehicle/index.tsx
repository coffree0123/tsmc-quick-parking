import React from 'react'
import { Input, Flex, Button } from 'antd'

const Vehicle = (): React.ReactElement => {
  return (
    <Flex vertical style={{ overflow: 'hidden' }}>
      <Input addonBefore="plate number" placeholder="" />
      <Input addonBefore="nickname" placeholder="" />
      <Input addonBefore="size" placeholder="" />
      <Button>Create</Button>
      <Button>Save</Button>
    </Flex>
  )
}

export default Vehicle
