/* eslint-disable react/prop-types */
import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
// import Particles from "react-particles-js";
import { Button, Form, Input, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import './Login.css';
import axios from 'axios';

export default function Login(props) {
    const onFinish = (values) => {

        axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(
            res => {

                if (res.data.length === 0) {
                    message.error('用户名或密码不匹配');
                } else {
                    localStorage.setItem('token', JSON.stringify(res.data[0]));
                    props.history.push('/');
                }
            }
        );
    };

    return <div style={{
        height: '100%',
        overflow: 'hidden',
        backgroundColor: 'rgb(35,39,65)'
    }

    }>
        {/* <Particles height={document.documentElement.clientHeight} /> */}
        <div className="form">
            <div className="title">全球文章发布管理系统</div>
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Username!',
                        },
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password!',
                        },
                    ]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>


                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                    Or <a href="">register now!</a>
                </Form.Item>
            </Form>
        </div>
    </div>;

}