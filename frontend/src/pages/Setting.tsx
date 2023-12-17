import React, { useEffect, useState } from 'react'
import { Input, Flex, Button, Radio, InputNumber, Form, notification, Skeleton } from 'antd'
import LogOutButton from '../components/LogOutButton'
import TokenRefresh from '../components/TokenRefresh'
import axios from 'axios'
import { getAxiosConfig } from '../utils/api'
import { MsalProvider } from '@azure/msal-react'
import { useUserInfo } from '../hooks'
import FormLabel from '../components/FormLabel'

const Setting = ({ instance }: any): React.ReactElement => {
  const [submittable, setSubmittable] = useState(false)
  const userInfo = useUserInfo()
  const [noti, notiContextHolder] = notification.useNotification()

  const [form] = Form.useForm()
  const formValues = Form.useWatch([], form)

  const saveSetting = (): void => {
    axios.put('users/', form.getFieldsValue(), getAxiosConfig())
      .then(() => {
        noti.success({
          message: 'Setting saved.',
          placement: 'top',
          duration: 3
        })
      })
      .catch(error => {
        console.error(error)
      })
  }

  useEffect(() => {
    form.setFieldsValue(userInfo)
  }, [userInfo])

  useEffect(() => {
    form.validateFields().then(
      () => { setSubmittable(true) }, // valid
      () => { setSubmittable(false) } // invalid
    )
  }, [formValues])

  return (
    <MsalProvider instance={instance}>
    <TokenRefresh instance={instance}>
    {notiContextHolder}
    <Flex vertical style={{ overflow: 'hidden', padding: '0 30px' }}>
      {
        userInfo === undefined
          ? <Skeleton active/>
          : (
            <Form form={form} onFinish={saveSetting}>
              <Form.Item name="user_id">
                <Input type="hidden" />
              </Form.Item>
              <Form.Item name="name" rules={[{ required: true, whitespace: true }]}>
                <Input addonBefore={<FormLabel label="Name"/>} />
              </Form.Item>
              <Flex align='center'>
                <FormLabel label="Role" style={{ margin: '0 11px 24px 11px', textAlign: 'center' }}/>
                <Form.Item name="job_title" rules={[{ required: true }]}>
                  <Radio.Group optionType="button" buttonStyle='solid'>
                    <Radio value={'engineer'}>engineer</Radio>
                    <Radio value={'manager'}>manager</Radio>
                    <Radio value={'qa'}>QA</Radio>
                    <Radio value={'pm'}>PM</Radio>
                  </Radio.Group>
                </Form.Item>
              </Flex>
              <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
                <Input addonBefore={<FormLabel label="Email"/>} />
              </Form.Item>
              <Form.Item name="phone_num" rules={[{ required: true }]}>
                <Input addonBefore={<FormLabel label="Phone"/>} />
              </Form.Item>
              <Flex align='center'>
                <FormLabel label="Gender" style={{ margin: '0 11px 24px 11px', textAlign: 'center' }}/>
                <Form.Item name="gender" rules={[{ required: true }]}>
                  <Radio.Group optionType="button" buttonStyle='solid' >
                    <Radio value={'male'}>Male</Radio>
                    <Radio value={'female'}>Female</Radio>
                  </Radio.Group>
                </Form.Item>
              </Flex>
              <Form.Item name="age" rules={[{ required: true, type: 'number', min: 0 }]}>
                <InputNumber addonBefore={<FormLabel label="Age"/>} style={{ width: '100%' }} />
              </Form.Item>
              <Flex align='center'>
                <FormLabel label="Priority" style={{ margin: '0 11px 24px 11px', textAlign: 'center' }}/>
                <Form.Item name="priority" rules={[{ required: true }]}>
                  <Radio.Group optionType="button" buttonStyle='solid'>
                    <Radio value={'normal'}>Normal</Radio>
                    <Radio value={'disability'}>Disability</Radio>
                    <Radio value={'pregnancy'}>Pregnancy</Radio>
                  </Radio.Group>
                </Form.Item>
              </Flex>
              <Form.Item>
                <Button type='primary' htmlType='submit' disabled={!submittable} style={{ marginTop: '16px', width: '100%' }}>Save</Button>
              </Form.Item>
            </Form>
            )
      }
      <LogOutButton style={{ marginTop: '16px' }} />
    </Flex>
    </TokenRefresh>
    </MsalProvider>
  )
}

export default Setting
