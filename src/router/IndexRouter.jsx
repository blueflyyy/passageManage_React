import React, { Suspense } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Spin } from 'antd';
const Login = React.lazy(() => import('../views/login/Login'));
const Detail = React.lazy(() => import('../views/news/Detail'));
const News = React.lazy(() => import('../views/news/News'));
const NewsSandBox = React.lazy(() => import('../views/sandbox/NewsSandBox'));
export default function IndexRouter() {
    return <HashRouter>
        <Suspense fallback={<div className="example">
            <Spin />
        </div>}>
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/news" component={News} />
                <Route path="/detail/:id" component={Detail} />
                <Route path="/" render={() =>
                    localStorage.getItem('token') ? <NewsSandBox></NewsSandBox> : <Redirect to="/login" />
                } />
            </Switch>
        </Suspense>
    </HashRouter>;
}