import { CarFilled, CarOutlined, EnvironmentFilled, EnvironmentOutlined, HomeFilled, HomeOutlined, SettingFilled, SettingOutlined } from '@ant-design/icons'
import { Flex, Layout } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import { styles } from '../constants'

const { Content, Footer } = Layout

interface NavButtonProps {
  defaultElement: React.ReactNode
  activeElement?: React.ReactNode
  url: string
  active: boolean
  title: string
}

const NavButton = (props: NavButtonProps): React.ReactElement => {
  const active = props.active && typeof props.activeElement !== 'undefined'
  return (
    <Link to={props.url}>
      <Flex vertical align='center' justify='center'>
        <div style={{ fontSize: '45px' }}>
          {
            active
              ? <span style={{ color: styles.primaryColor }}>{props.activeElement}</span>
              : <span style={{ color: 'gray' }}>{props.defaultElement}</span>
          }
        </div>
        <span style={{ fontSize: '16px', fontWeight: 'bold', color: active ? 'black' : 'gray' }}>{props.title}</span>
      </Flex>
    </Link>
  )
}

NavButton.defaultProps = {
  active: false
}

interface UserLayoutProps {
  active?: 'home' | 'parkinglots' | 'vehicles' | 'settings'
  children?: React.ReactNode
}

const UserLayout = (props: UserLayoutProps): React.ReactElement => (
  <Layout>
    <Content>
      {props.children}
    </Content>
    <Footer style={{ minHeight: '50px', backgroundColor: 'transparent', paddingLeft: '30px', paddingRight: '30px' }}>
      <Flex align='center' justify='space-between'>
        <NavButton
          defaultElement={<HomeOutlined />}
          activeElement={<HomeFilled />}
          url='/'
          title='Home'
          active={props.active === 'home'}
        />
        <NavButton
          defaultElement={<EnvironmentOutlined />}
          activeElement={<EnvironmentFilled />}
          url='/parkinglots'
          title='Parking Lots'
          active={props.active === 'parkinglots'}
        />
        <NavButton
          defaultElement={<CarOutlined />}
          activeElement={<CarFilled />}
          url='/vehicles'
          title='Vehicles'
          active={props.active === 'vehicles'}
        />
        <NavButton
          defaultElement={<SettingOutlined />}
          activeElement={<SettingFilled />}
          url='/settings'
          title='Settings'
          active={props.active === 'settings'}
        />
      </Flex>
    </Footer>
  </Layout>
)

export default UserLayout
