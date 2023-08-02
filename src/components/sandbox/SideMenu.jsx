/* eslint-disable react/prop-types */

import React, { useEffect, useState } from 'react';
import { Layout, Menu, } from 'antd';
import axios from 'axios';
import './index.css';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    PieChartOutlined,
} from '@ant-design/icons';
const { Sider } = Layout;
const { SubMenu } = Menu;

function SideMenu(props) {


    const [item, setItem] = useState(null);
    useEffect(() => {
        axios.get('/rights?_embed=children').then(
            res => {

                var result = res.data.filter(function (item, index) {
                    // 后台给的数据一级目录都有children数组，为了不渲染出二级目录，需要手动将空的children数组置为null
                    if (item.children?.length == 0) {
                        item.children = null;

                    } else {
                        //带有pagepermisson字段的才需要渲染在侧边栏
                        item.children = item.children.filter(function (item) {
                            return item.pagepermisson == 1;
                        });
                    }
                    item.icon = <PieChartOutlined />;
                    return item;
                });
                result = result.filter(item => item.pagepermisson == 1);
                setItem([...result]);
            }
        );
    }, []);

    const selectKeys = [props.location.pathname];
    const openKeys = ['/' + props.location.pathname.split('/')[1]];
    const { role: { rights }, roleId } = JSON.parse(localStorage.getItem('token'));

    const checkPagePermission = (item) => {

        return item.pagepermisson && rights.includes(item.key);
    };
    const renderMenu = (menuList) => {
        console.log(menuList)
        return menuList?.map(item => {
            if (item.children?.length > 0 && checkPagePermission(item)) {
                return <SubMenu key={item.key} title={item.title}>
                    {renderMenu(item.children)}
                </SubMenu>;
            }

            return checkPagePermission(item) && <Menu.Item key={item.key} onClick={() => {

                props.history.push(item.key);
            }}>{item.title}</Menu.Item>;
        });
    };
    return (
        <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
            <div className='sider'>


                <div className="logo" >
                    文章发布管理系统
                </div>
                <div className='menu'>


                    <Menu
                        theme="dark"
                        mode="inline"
                        //不用defaultSelectedKeys，解决路由重定向时，不匹配的问题
                        // defaultSelectedKeys={selectKeys}
                        selectedKeys={selectKeys}
                        defaultOpenKeys={openKeys}


                    >
                        {renderMenu(item)}
                    </Menu>
                </div>
            </div>
        </Sider >
    );
}
const mapStateToProps = ({ CollApsedReducer: { isCollapsed } }) => ({
    isCollapsed
});
export default connect(mapStateToProps)(withRouter(SideMenu));