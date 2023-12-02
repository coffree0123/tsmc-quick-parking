import React, { useState, useEffect } from 'react'
import { Input, Flex, Button, Radio, InputNumber, Form } from 'antd'
import LogOutButton from '../../components/LogOutButton'
import { MsalProvider } from '@azure/msal-react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

interface UserInfo {
  age: number
  email: string
  gender: string
  job_title: string
  name: string
  phone_num: string
  special_role: string
  user_id: string
}

interface AccessToken {
  oid: string
  // whatever else is in the JWT.
}

const Setting = ({ instance }: any): React.ReactElement => {
  const [userInfo, setUserInfo] = useState<UserInfo>()

  const account = instance.getAllAccounts()[0]
  const [form] = Form.useForm()

  const accessTokenRequest = {
    scopes: ['user.read'],
    account
  }

  const saveClick = (event: any): void => {
    console.log(form.getFieldsValue())
  }

  useEffect(() => {
    instance
      .acquireTokenSilent(accessTokenRequest)
      .then(function (accessTokenResponse: any) {
        // Acquire token silent success
        const accessToken = jwtDecode<AccessToken>(accessTokenResponse.accessToken)
        console.log(accessToken)
        // Call your API with token
        axios.get<UserInfo>(`users/${accessToken.oid}`)
          .then(response => {
            setUserInfo(response.data)
          })
          .catch(error => { console.error(error) })
      })
      .catch(function (error: any) {
        // Acquire token silent failure
        console.log(error)
      })
  }, [])

  useEffect(() => {
    console.log(userInfo)
    form.setFieldsValue(userInfo)
  }, [userInfo])

  return (
    <MsalProvider instance={instance}>
    <Flex vertical style={{ overflow: 'hidden' }}>
      <Form form={form}>
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
      <Form.Item name="special_role">
        <Input addonBefore="special role" />
      </Form.Item>
      </Form>
      <Button onClick={saveClick}>Save</Button>
      <LogOutButton />
    </Flex>
    </MsalProvider>
  )
}

export default Setting
