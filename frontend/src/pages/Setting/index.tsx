import React, { useState, useEffect } from 'react'
import { Input, Flex, Button, Radio, InputNumber, Form } from 'antd'
import LogOutButton from '../../components/LogOutButton'
import axios from 'axios'
import { getAxiosConfig } from '../../utils/api'
import { MsalProvider } from '@azure/msal-react'

interface UserInfo {
  age: number
  email: string
  gender: string
  job_title: string
  name: string
  phone_num: string
  priority: string
  user_id: string
}

const Setting = ({ instance }: any): React.ReactElement => {
  const [userInfo, setUserInfo] = useState<UserInfo>()

  const [form] = Form.useForm()

  const saveClick = (): void => {
    console.log(form.getFieldsValue())
    axios.put('users/', form.getFieldsValue(), getAxiosConfig())
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  useEffect(() => {
    axios.get<UserInfo>('users/', getAxiosConfig())
      .then(response => {
        setUserInfo(response.data)
      })
      .catch(error => { console.error(error) })
  }, [])

  useEffect(() => {
    console.log(userInfo)
    form.setFieldsValue(userInfo)
  }, [userInfo])

  return (
    <MsalProvider instance={instance}>
    <Flex vertical style={{ overflow: 'hidden' }}>
      <Form form={form}>
      <Form.Item name="user_id">
        <Input type="hidden" />
      </Form.Item>
      <Form.Item name="name">
        <Input addonBefore="Name" />
      </Form.Item>
      <Form.Item name="job_title">
        <Radio.Group>
          <Radio value={'engineer'}>engineer</Radio>
          <Radio value={'manager'}>manager</Radio>
          <Radio value={'qa'}>qa</Radio>
          <Radio value={'pm'}>pm</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="email">
        <Input addonBefore="Email" />
      </Form.Item>
      <Form.Item name="phone_num">
        <Input addonBefore="Phone" />
      </Form.Item>
      <Form.Item name="gender">
        <Radio.Group >
          <Radio value={'male'}>male</Radio>
          <Radio value={'female'}>female</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="age">
        <InputNumber addonBefore="age" />
      </Form.Item>
      <Form.Item name="priority">
        <Radio.Group>
          <Radio value={'normal'}>normal</Radio>
          <Radio value={'disability'}>disability</Radio>
          <Radio value={'pregnancy'}>pregnancy</Radio>
        </Radio.Group>
      </Form.Item>
      </Form>
      <Button onClick={saveClick}>Save</Button>
      <LogOutButton />
    </Flex>
    </MsalProvider>
  )
}

export default Setting
