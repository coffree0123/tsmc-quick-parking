import React, { useEffect } from 'react'
import { Input, Flex, Button, Radio, InputNumber, Form, notification } from 'antd'
import LogOutButton from '../components/LogOutButton'
import axios from 'axios'
import { getAxiosConfig } from '../utils/api'
import { MsalProvider } from '@azure/msal-react'
import { useUserInfo } from '../hooks'

const Label = (props: { label: string, style?: React.CSSProperties }): React.ReactElement => <div style={{ width: '50px', ...props.style }}>{props.label}</div>

const Setting = ({ instance }: any): React.ReactElement => {
  const userInfo = useUserInfo()
  const [noti, notiContextHolder] = notification.useNotification()

  const [form] = Form.useForm()

  const saveClick = (): void => {
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

  return (
    <MsalProvider instance={instance}>
    {notiContextHolder}
    <Flex vertical style={{ overflow: 'hidden', padding: '0 30px' }}>
      <Form form={form}>
        <Form.Item name="user_id">
          <Input type="hidden" />
        </Form.Item>
        <Form.Item name="name">
          <Input addonBefore={<Label label="Name"/>} />
        </Form.Item>
        <Flex align='center'>
          <Label label="Role" style={{ margin: '0 11px 24px 11px', textAlign: 'center' }}/>
          <Form.Item name="job_title">
            <Radio.Group optionType="button" buttonStyle='solid'>
              <Radio value={'engineer'}>engineer</Radio>
              <Radio value={'manager'}>manager</Radio>
              <Radio value={'qa'}>QA</Radio>
              <Radio value={'pm'}>PM</Radio>
            </Radio.Group>
          </Form.Item>
        </Flex>
        <Form.Item name="email">
          <Input addonBefore={<Label label="Email"/>} />
        </Form.Item>
        <Form.Item name="phone_num">
          <Input addonBefore={<Label label="Phone"/>} />
        </Form.Item>
        <Flex align='center'>
          <Label label="Gender" style={{ margin: '0 11px 24px 11px', textAlign: 'center' }}/>
          <Form.Item name="gender">
            <Radio.Group optionType="button" buttonStyle='solid' >
              <Radio value={'male'}>Male</Radio>
              <Radio value={'female'}>Female</Radio>
            </Radio.Group>
          </Form.Item>
        </Flex>
        <Form.Item name="age">
          <InputNumber addonBefore={<Label label="Age"/>} style={{ width: '100%' }} />
        </Form.Item>
        <Flex align='center'>
          <Label label="Priority" style={{ margin: '0 11px 24px 11px', textAlign: 'center' }}/>
          <Form.Item name="priority">
            <Radio.Group optionType="button" buttonStyle='solid'>
              <Radio value={'normal'}>Normal</Radio>
              <Radio value={'disability'}>Disability</Radio>
              <Radio value={'pregnancy'}>Pregnancy</Radio>
            </Radio.Group>
          </Form.Item>
        </Flex>
      </Form>
      <Button onClick={saveClick} type='primary' style={{ marginTop: '32px' }}>Save</Button>
      <LogOutButton style={{ marginTop: '32px' }} />
    </Flex>
    </MsalProvider>
  )
}

export default Setting
