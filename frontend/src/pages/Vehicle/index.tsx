import React, { useState, useEffect } from 'react'
import { Input, Flex, Button, Radio, Form, Collapse } from 'antd'
import LogOutButton from '../../components/LogOutButton'
import { MsalProvider } from '@azure/msal-react'
import axios from 'axios'
import { getAxiosConfig } from '../../utils/api'

interface VehicleInfo {
  user_id: string
  license_plate_no: string
  nick_name: string
  car_size: string
}

const Vehicle = ({ instance }: any): React.ReactElement => {
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo[]>([])
  const [addInfo, setAddInfo] = useState<VehicleInfo>()
  const [currentVehicle, setCurrent] = useState(0)
  const [vehicleCount, setCount] = useState(0)
  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()

  const saveClick = (event: any): void => {
    console.log(editForm.getFieldsValue())
    axios.put('users/vehicles/', editForm.getFieldsValue(), getAxiosConfig())
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  const onChange = (key: string | string[]): void => {
    // console.log(key)
    editForm.setFieldsValue(vehicleInfo[Number(key)])
    setCurrent(Number(key))
  }

  const deleteClick = (event: any): void => {
    axios.delete(`users/vehicles/${vehicleInfo[currentVehicle].license_plate_no}`, getAxiosConfig())
      .then(function (response) {
        console.log(response)
        setCount(vehicleCount - 1)
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  const addClick = (event: any): void => {
    axios.post('users/vehicles/',
      addForm.getFieldsValue(), getAxiosConfig())
      .then(function (response) {
        setCount(vehicleCount + 1)
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  useEffect(() => {
    axios.get('users/', getAxiosConfig())
      .then(response => {
        const userId = response.data.user_id
        axios.get<VehicleInfo[]>('users/user_vehicles/', getAxiosConfig())
          .then(response => {
            console.log(response.data)
            setVehicleInfo(response.data)
            setAddInfo({
              user_id: userId,
              license_plate_no: '',
              nick_name: '',
              car_size: ''
            })
            setCount(response.data.length)
          })
          .catch(error => { console.error(error) })
      })
      .catch(error => {
        console.error(error)
      })
  }, [])

  useEffect(() => {
    axios.get('users/', getAxiosConfig())
      .then(response => {
        const userId = response.data.user_id
        axios.get<VehicleInfo[]>('users/user_vehicles/', getAxiosConfig())
          .then(response => {
            console.log(response.data)
            setVehicleInfo(response.data)
            setAddInfo({
              user_id: userId,
              license_plate_no: '',
              nick_name: '',
              car_size: ''
            })
            setCount(response.data.length)
          })
          .catch(error => { console.error(error) })
      })
      .catch(error => {
        console.error(error)
      })
  }, [vehicleCount])

  useEffect(() => {
    addForm.setFieldsValue(addInfo)
  }, [addInfo])

  return (
    <MsalProvider instance={instance}>
    <Flex vertical style={{ overflow: 'hidden' }}>
    <Collapse accordion onChange={onChange} items={vehicleInfo.map((vehicle, i) => ({
      key: i,
      label: vehicle.nick_name,
      children:
    <Flex vertical style={{ overflow: 'hidden' }}>
    <Form form={editForm} >
    <Form.Item name="user_id">
      <Input type="hidden" />
    </Form.Item>
    <Form.Item name="license_plate_no">
      <Input type="hidden" />
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
    <Button onClick={saveClick}>Save</Button>
    <Button onClick={deleteClick}>Delete</Button>
    </Flex>

    }))} />
      <Form form={addForm}>
      <Form.Item name="user_id">
        <Input type="hidden" />
      </Form.Item>
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
      <Button onClick={addClick}>Add</Button>
      <LogOutButton />
    </Flex>
    </MsalProvider>
  )
}

export default Vehicle
