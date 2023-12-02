import React, { useState, useEffect } from 'react'
import { Input, Flex, Button, Radio, Form } from 'antd'
import LogOutButton from '../../components/LogOutButton'
import { MsalProvider } from '@azure/msal-react'
// import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

interface VehicleInfo {
  user_id: string
  license_plate_no: string
  nick_name: string
  car_size: string
}

interface AccessToken {
  oid: string
  // whatever else is in the JWT.
}

const Vehicle = ({ instance }: any): React.ReactElement => {
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo>()

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
        // placeholder
        setVehicleInfo({
          user_id: '',
          license_plate_no: '',
          nick_name: '',
          car_size: ''
        })
      })
      .catch(function (error: any) {
        // Acquire token silent failure
        console.log(error)
      })
  }, [])

  useEffect(() => {
    console.log(vehicleInfo)
    form.setFieldsValue(vehicleInfo)
  }, [vehicleInfo])

  return (
    <MsalProvider instance={instance}>
    <Flex vertical style={{ overflow: 'hidden' }}>
      <Form form={form}>
      <Form.Item name="license_plate_no">
        <Input addonBefore="plate number" />
      </Form.Item>
      <Form.Item name="car_size">
        <Radio.Group>
          <Radio value={'small'}>small</Radio>
          <Radio value={'medium'}>medium</Radio>
          <Radio value={'large'}>large</Radio>
          <Radio value={'huge'}>huge</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="nick_name">
        <Input addonBefore="nickname" />
      </Form.Item>
      </Form>
      <Button>Create</Button>
      <Button onClick={saveClick}>Save</Button>
      <LogOutButton />
    </Flex>
    </MsalProvider>
  )
}

export default Vehicle
