import { CarFilled, CarOutlined, EnvironmentFilled, EnvironmentOutlined, HomeFilled, HomeOutlined, LeftOutlined, SettingFilled, SettingOutlined } from '@ant-design/icons'
import { Col, Flex, Layout, Row, Typography } from 'antd'
import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { styles } from '../constants'
import { AuthContext } from '../contexts/AuthContext'

const { Header, Content, Footer } = Layout
const { Title } = Typography

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
  title?: string
  backButton: boolean
  active?: 'home' | 'parkinglots' | 'vehicles' | 'settings'
  children?: React.ReactNode
  action?: React.ReactNode
}

const headerHeight = 60
export const footerHeight = 120

const UserLayout = (props: UserLayoutProps): React.ReactElement => {
  const { token, isGuard } = useContext(AuthContext)
  const navigate = useNavigate()
  return (
    <Layout>
      {
        props.title !== undefined && (
          <Header
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 1,
              height: `${headerHeight}px`,
              padding: '0 30px',
              backgroundColor: styles.primaryColor,
              color: styles.white
            }}
          >
            <Row style={{ width: '100%', height: '100%' }}>
              <Col span={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                {props.backButton && <LeftOutlined style={{ fontSize: '24px' }} onClick={() => { navigate(-1) }} />}
              </Col>
              <Col span={16} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Title level={3} style={{ color: 'inherit', margin: 0, textAlign: 'center' }}>
                  {props.title}
                </Title>
              </Col>
              <Col span={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>{props.action}</Col>
            </Row>
          </Header>
        )
      }
      <Content
        style={{
          height: props.title === undefined ? '100vh' : `calc(100vh - ${headerHeight}px)`,
          backgroundColor: styles.lightGray,
          overflow: 'auto'
        }}
      >
        {props.children}
      </Content>
      {
        token !== undefined && !isGuard &&
        (
          <Footer style={{ height: `${footerHeight}px`, backgroundColor: 'transparent', padding: '0 30px' }}>
            <Flex align='center' justify='space-between' style={{ height: '100%' }}>
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
        )
      }
    </Layout>
  )
}

UserLayout.defaultProps = {
  backButton: false
}

export default UserLayout
