import React, { useState } from 'react'
import { Input, Flex, Button, Radio } from 'antd'
import type { RadioChangeEvent } from 'antd'
import LogOutButton from '../../components/LogOutButton'
import { MsalProvider } from '@azure/msal-react'

const Setting = ({ instance }: any): React.ReactElement => {
  const [jobValue, setJobValue] = useState('engineer')
  const [genderValue, setGenderValue] = useState('male')

  const onChangeJob = (e: RadioChangeEvent): void => {
    console.log('radio checked ', e.target.value)
    setJobValue(e.target.value)
  }

  const onChangeGender = (e: RadioChangeEvent): void => {
    console.log('radio checked ', e.target.value)
    setGenderValue(e.target.value)
  }

  return (
    <MsalProvider instance={instance}>
    <Flex vertical style={{ overflow: 'hidden' }}>
      <Input addonBefore="Name" placeholder="Alice" />
      <Radio.Group onChange={onChangeJob} value={jobValue}>
        <Radio value={'engineer'}>engineer</Radio>
        <Radio value={'manager'}>manager</Radio>
        <Radio value={'qa'}>qa</Radio>
        <Radio value={'pm'}>pm</Radio>
      </Radio.Group>
      <Input addonBefore="Email" placeholder="alice@company.co" />
      <Input addonBefore="Phone" placeholder="0987654321" />
      <Radio.Group onChange={onChangeGender} value={genderValue}>
        <Radio value={'male'}>male</Radio>
        <Radio value={'female'}>female</Radio>
      </Radio.Group>
      <Input addonBefore="age" placeholder="0" />
      <Input addonBefore="special role" placeholder="" />
      <Button>Save</Button>
      <LogOutButton />
    </Flex>
    </MsalProvider>
  )
}

export default Setting
