import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import logo from '../../assets/images/logo.png';
import menuList from '../../config/menuConfig'
import './index.less';

const SubMenu = Menu.SubMenu;

class LeftNav extends Component {
  // 根据menu的数据数组生成对应的标签数组
  // 使用map() + 递归调用
  getMenuNodes_map = menuList => {
    return menuList.map(item => {
      if (!item.children) {
        return (
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        )
      } else {
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getMenuNodes(item.children)}
          </SubMenu>
        )
      }
    })
  }
  // 使用reduce()
  getMenuNodes = menuList => {
    const path = this.props.location.pathname
    return menuList.reduce((pre, item) => {
      if (!item.children) {
        pre.push((
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        ))
      } else {
        // 查找一个与当前请求路径匹配的子item
        const cItem = item.children.find(cItem => cItem.key === path)
        if (cItem) {
          this.openKey = item.key
        }
        
        pre.push((
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getMenuNodes(item.children)}
          </SubMenu>
        ))
      }
      return pre
    }, [])
  }
  // 为第一个render()准备数据，必须同步
  componentWillMount() {
    this.menuNodes = this.getMenuNodes(menuList)
  }
  
  render() {
    // 得到当前的路由路径
    const path = this.props.location.pathname
    const openKey = this.openKey

    return (
      <div className='left-nav'>
        <Link to='/' className='left-nav-header'>
          <img src={logo} alt='logo' />
          <h1>硅谷后台</h1>
        </Link>
        <Menu
          mode='inline'
          theme='dark'
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
        >
          {
            this.menuNodes
          }
        </Menu>
      </div>
    );
  }
}

// withRouter高阶组件：包装非路由组件，返回一个新的组件
// 新组件向非路由组件传递3个属性：histroy/location/match
export default withRouter(LeftNav)