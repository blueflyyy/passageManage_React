/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import Home from '../../views/sandbox/home/Home';
import Nopermission from '../../views/sandbox/nopermission/NoPermission';
import RightList from '../../views/sandbox/right-manage/RightList';
import RoleList from '../../views/sandbox/right-manage/RoleList';
import UserList from '../../views/sandbox/user-manage/UserList';
import { Switch, Route, Redirect } from 'react-router-dom';
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd';
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft';
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory';
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview';
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate';
import Audit from '../../views/sandbox/audit-manage/Audit';
import AuditList from '../../views/sandbox/audit-manage/AuditList';
import Unpublished from '../../views/sandbox/publish-manage/Unpublished';
import Published from '../../views/sandbox/publish-manage/Published';
import Sunset from '../../views/sandbox/publish-manage/Sunset';
import PassageTable from '../../views/sandbox/home/PassageTable';
import axios from 'axios';
import { Spin } from 'antd';
import { connect } from 'react-redux';
const LocalRouterMap = {
    '/home': Home,
    '/user-manage/list': UserList,
    '/right-manage/role/list': RoleList,
    '/right-manage/right/list': RightList,
    '/news-manage/add': NewsAdd,
    '/news-manage/draft': NewsDraft,
    '/news-manage/category': NewsCategory,
    '/news-manage/preview/:id': NewsPreview,
    '/news-manage/update/:id': NewsUpdate,
    '/audit-manage/audit': Audit,
    '/audit-manage/list': AuditList,
    '/publish-manage/unpublished': Unpublished,
    '/publish-manage/published': Published,
    '/publish-manage/sunset': Sunset,
    '/home/passage-table/:sort': PassageTable
};

function NewsRouter(props) {

    const [BackRouteList, setBackRouteList] = useState([]);
    useEffect(() => {
        //路由请求
        // Promise.all([
        //     axios.get('/rights'),
        //     axios.get('/children'),
        // ]).then(res => {
        //     setBackRouteList([...res[0].data, ...res[1].data]);

        // });
        Promise.all([
            axios.get('/servlet/SideMenuServlet'),
            axios.get('/servlet/newsRouterServlet'),
        ]).then(res => {
            console.log(res[0].data)
            console.log('ffffffffffffffffff')
            console.log(res[1].data)
            setBackRouteList([...res[0].data, ...res[1].data]);

        });
    }, []);

    var { role: { rights }, roleId } = JSON.parse(localStorage.getItem('token'));
    //处理rights
    rights = JSON.parse(rights)

    const checkRoute = (item) => {
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson);
    };

    const checkUserPermission = (item) => {

        return rights.includes(item.key);
    };

    return (
        <Spin spinning={props.isLoading} size='large'>
            <Switch>
                {
                    BackRouteList.map(item => {
                        if (checkRoute(item) && checkUserPermission(item)) {
                            return <Route path={item.key} key={item.key} component={LocalRouterMap[item.key]} exact />;
                        }
                        return null;
                    }
                    )
                }

                <Redirect from="/" to="/home" exact />
                {
                    BackRouteList.length > 0 && <Route path="*" component={Nopermission} />
                }
            </Switch>
        </Spin>
    );
}
const mapStateToProps = ({ LoadingReducer: { isLoading } }) => ({
    isLoading
});

export default connect(mapStateToProps)(NewsRouter);
