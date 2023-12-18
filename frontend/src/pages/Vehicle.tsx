import React, { useState, useEffect } from 'react'
import { Input, Flex, Button, Radio, Form, List, Drawer, Row, Col, Typography, notification, Popconfirm } from 'antd'
import axios from 'axios'
import { getAxiosConfig } from '../utils/api'
import { MsalProvider } from '@azure/msal-react'
import { EditFilled, PlusOutlined } from '@ant-design/icons'
import { styles } from '../constants'
import FormLabel from '../components/FormLabel'
import UserLayout from '../components/UserLayout'
import TokenRefresh from '../components/TokenRefresh'

const { Title } = Typography

interface VehicleInfo {
  user_id: string
  license_plate_no: string
  nick_name: string
  car_size: string
}

const Vehicle = ({ instance }: any): React.ReactElement => {
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo[]>([])
  const [index, setIndex] = useState<number>()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [submittable, setSubmittable] = useState(false)
  const [form] = Form.useForm()
  const formValues = Form.useWatch([], form)

  const [noti, notiContextHandler] = notification.useNotification()

  const openDrawer = (index?: number): void => {
    if (typeof index !== 'undefined') {
      form.setFieldsValue(vehicleInfo[index])
    } else {
      form.resetFields()
      if (vehicleInfo.length > 0) {
        form.setFieldValue('user_id', vehicleInfo[0].user_id)
      }
    }
    setIndex(index)
    setDrawerOpen(true)
  }

  const getVehicleInfo = (): void => {
    axios.get<VehicleInfo[]>('users/user_vehicles/', getAxiosConfig())
      .then(response => {
        setVehicleInfo(response.data)
      })
      .catch(error => { console.error(error) })
  }

  const submitCallback = (message: string = 'Submitted successfully'): () => void => {
    return () => {
      noti.success({
        message,
        placement: 'top',
        duration: 3
      })
      setDrawerOpen(false)
      setIndex(undefined)
      getVehicleInfo()
    }
  }

  const deleteVehicle = (): void => {
    if (typeof index !== 'undefined') {
      axios.delete(`users/vehicles/${vehicleInfo[index].license_plate_no}`, getAxiosConfig())
        .then(submitCallback('Vehicle deleted.'))
        .catch(error => { console.error(error) })
    }
  }

  useEffect(() => {
    getVehicleInfo()
  }, [])

  useEffect(() => {
    form.validateFields().then(
      () => { setSubmittable(true) }, // valid
      () => { setSubmittable(false) } // invalid
    )
  }, [formValues])

  const submitVehicle = (): void => {
    if (typeof index === 'undefined') {
      // Add new vehicle
      axios.post('users/vehicles/', form.getFieldsValue(), getAxiosConfig())
        .then(submitCallback('Vehicle added.'))
        .catch(error => {
          console.error(error)
          noti.error({
            message: 'Failed to add vehicle.',
            placement: 'top',
            duration: 3
          })
          setDrawerOpen(false)
          setIndex(undefined)
        })
    } else {
      // Update vehicle
      axios.put('users/vehicles/', form.getFieldsValue(), getAxiosConfig())
        .then(submitCallback('Vehicle updated.'))
        .catch(error => {
          console.error(error)
        })
    }
  }

  return (
    <UserLayout active='vehicles' title='Vehicles' action={<PlusOutlined style={{ fontSize: '24px' }} onClick={() => { openDrawer() }}/>}>
    <MsalProvider instance={instance}>
    <TokenRefresh instance={instance}>
    {notiContextHandler}
    <List
      size='large'
      bordered
      dataSource={vehicleInfo}
      renderItem={(item, index) => (
        <List.Item>
          <Flex justify='space-between' style={{ width: '100%' }}>
            <div>{item.nick_name}, <span style={{ color: styles.darkGray }}>{item.license_plate_no}</span></div>
            <EditFilled onClick={() => { openDrawer(index) }}/>
          </Flex>
        </List.Item>
      )}
    />
    <Drawer
      placement='bottom'
      open={drawerOpen}
      onClose={() => { setDrawerOpen(false) }}
      closable={false}
      size='large'
      style={{
        borderRadius: '20px'
      }}
      title={
        <Row align='middle' style={{ width: '100%' }}>
          <Col span={5} style={{ display: 'flex', justifyContent: 'center' }}><Button type='text' onClick={() => { setDrawerOpen(false) }} style={{ color: styles.primaryColor, fontSize: '1.2em' }}>Cancel</Button></Col>
          <Col span={14}>
            <Title level={4} style={{ textAlign: 'center', margin: 0 }}>
              {typeof index === 'undefined' ? 'New Vehicle' : vehicleInfo[index].license_plate_no}
            </Title>
          </Col>
          <Col span={5} style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                type='text'
                htmlType='submit'
                disabled={!submittable}
                style={{ color: submittable ? styles.primaryColor : styles.darkGray, fontSize: '1.2em' }}
                onClick={() => { form.submit() }}
              >
                Save
              </Button>
          </Col>
        </Row>
      }
    >
      <Form form={form} onFinish={submitVehicle}>
        <Form.Item name="user_id" style={{ display: 'none' }}>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item name="license_plate_no" rules={[{ required: true, whitespace: true }]}>
          <Input addonBefore={<FormLabel label="License Plate" style={{ width: '80px' }}/>} disabled={typeof index !== 'undefined'}/>
        </Form.Item>
        <Form.Item name="nick_name" rules={[{ required: true, whitespace: true }]}>
          <Input addonBefore={<FormLabel label="Nick Name" style={{ width: '80px' }}/>} />
        </Form.Item>
        <Flex align='center'>
          <FormLabel label="Car Size" style={{ margin: '0 11px 24px 11px', textAlign: 'center', width: '80px' }}/>
          <Form.Item name="car_size" rules={[{ required: true }]}>
            <Radio.Group optionType="button" buttonStyle='solid'>
              <Radio value={'small'}>small</Radio>
              <Radio value={'medium'}>medium</Radio>
              <Radio value={'large'}>large</Radio>
              <Radio value={'huge'}>huge</Radio>
            </Radio.Group>
          </Form.Item>
        </Flex>
      </Form>
      {
        typeof index !== 'undefined' && (
          <Popconfirm
            title={`Delete the vehicle ${vehicleInfo[index].nick_name} (${vehicleInfo[index].license_plate_no})`}
            description="Are you sure to delete this vehicle?"
            onConfirm={deleteVehicle}
          >
            <Button style={{ marginTop: '16px', width: '100%' }}>Delete</Button>
          </Popconfirm>
        )
      }
    </Drawer>
    </TokenRefresh>
    </MsalProvider>
    </UserLayout>
  )
}

export default Vehicle
