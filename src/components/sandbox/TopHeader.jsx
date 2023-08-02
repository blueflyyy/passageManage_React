/* eslint-disable react/prop-types */
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { Layout, theme, Dropdown, Space, Avatar, Menu } from 'antd';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
const { Header } = Layout;

function TopHeader(props) {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const changeCollapsed = () => {
        //改变state的isCollapsed
        // console.log(props)

        props.changeCollapsed();
    };
    const { role: { roleName }, username } = JSON.parse(localStorage.getItem('token'));
    const items = [

        {
            key: '1',


            label: roleName,


        },
        {
            key: '2',
            danger: true,
            onClick: () => {
                localStorage.removeItem('token');
                props.history.push('./login');
            },

            label: '退出',
        },
    ];

    return (
        <Header
            style={{
                padding: '0 16px',
                background: colorBgContainer,
            }}
        >
            {React.createElement(props.isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: changeCollapsed,
            })}
            <div style={
                {
                    float: 'right'
                }
            }>
                <span>欢迎<span style={{ color: '#1890ff' }}>{username}</span>回来</span>
                <Dropdown
                    menu={{
                        items,
                    }}
                >
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <Avatar size="large" icon={<UserOutlined />} />

                        </Space>
                    </a>
                </Dropdown>
            </div>
        </Header>
    );
}


const mapStateToProps = ({ CollApsedReducer: { isCollapsed } }) => {

    return {
        isCollapsed
    };
};

const mapDispatchToProps = {
    changeCollapsed() {
        return {
            type: 'change_collapsed'
            // payload:
        };//action 
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopHeader)); 
