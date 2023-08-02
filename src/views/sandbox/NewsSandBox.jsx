
import SideMenu from '../../components/sandbox/SideMenu';
import TopHeader from '../../components/sandbox/TopHeader';
import { Route, Switch, Redirect } from 'react-router-dom';
import NewsRouter from '../../components/sandbox/NewsRouter';

import './NewsSandBox.css';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { Layout, theme } from 'antd';
import React, { useEffect } from 'react';
const { Content } = Layout;

export default function NewsSandBox() {
    NProgress.start();
    useEffect(() => {
        NProgress.done();
    });
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return <Layout>
        <SideMenu />
        <Layout className="site-layout">
            <TopHeader />
            <Content style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
                overflow: 'auto'
            }}>
                <NewsRouter></NewsRouter>
            </Content>
        </Layout>
    </Layout >;
}