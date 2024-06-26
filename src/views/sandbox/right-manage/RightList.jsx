import React, { useEffect, useState } from 'react';
import { Table, Tag, Popover, Button, Modal, Switch, message } from 'antd';
import axios from 'axios';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons';
const { confirm } = Modal;
export default function RightList() {

    const [dataSource, setDataSourse] = useState(null);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (id) => {
                return <b>{id}</b>;
            }
        },
        {
            title: '权限名称',
            dataIndex: 'label',
            key: 'label',
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render: (key) => {
                return (
                    <Tag color="orange">{key}</Tag>
                );
            },
            key: 'key',
        },
        {
            title: '操作',
            render: (item) => {
                return (
                    <div>
                        <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => confirmMethod(item)}></Button>
                        <Popover content={
                            <div style={{ textAlign: 'center' }}>
                                <Switch checked={item.pagepermisson} onChange={() => switchMethod(item)}></Switch>
                            </div>
                        } title="页面配置项" trigger={item.pagepermisson === -1 ? '' : 'click'}>
                            <Button type='primary' shape='circle' icon={<EditOutlined />} disabled={item.pagepermisson === -1}></Button>
                        </Popover>
                    </div>
                );
            }
        }
    ];

    useEffect(() => {
        ///rights?_embed=children
        axios.get('/servlet/SideMenuServlet').then(
            res => {
                var result = res.data.filter(item => {
                    if (item.children.length === 0) {
                        item.children = null;
                    }
                    return item;
                });
                setDataSourse(result);
            }
        );
    }, []);

    const switchMethod = (item) => {
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
        setDataSourse([...dataSource]
        );
        if (item.grade === 1) {
            // axios.patch(`http://localhost:5000/rights/${item.id}`, {
            //     pagepermisson: item.pagepermisson
            // });
            axios({
                type: 'get',
                url: '/servlet/rightListServlet',
                params: {
                    id: item.id,
                    pagepermisson: item.pagepermisson,
                    flag: 'rightUpdate'
                }
            })
        } else {
            // axios.patch(`http://localhost:5000/children/${item.id}`, {
            //     pagepermisson: item.pagepermisson
            // });
            axios({
                type: 'get',
                url: '/servlet/rightListServlet',
                params: {
                    id: item.id,
                    pagepermisson: item.pagepermisson,
                    flag: 'childrenUpdate'
                }
            })
        }
        window.location.reload();
    };

    const confirmMethod = (item) => {

        confirm({
            title: '你确认删除吗?',
            icon: <ExclamationCircleFilled />,

            onOk() {
                deleteMethod(item);
            },
            onCancel() {
                console.log('Cancel');
            },
        });

    };
    const deleteMethod = (item) => {
        if (item.grade === 1) {

            // axios.delete(`http://localhost:5000/rights/${item.id}`);
            axios({
                type: 'get',
                url: '/servlet/rightListServlet',
                params: {
                    id: item.id,
                    flag: 'rightDelete'
                }
            }).then(res => {
                if (!res.data) {
                    message.error('该权限有相关联的子权限，请先移除子权限！')
                } else {
                    setDataSourse(dataSource.filter(data => data.id !== item.id));
                }
            })
        } else {
            let list = dataSource.filter(data => data.id === item.rightId);
            //二级datasourse已经改变了
            list[0].children = list[0].children.filter(data => data.id !== item.id);
            //但是一级没有改变，检测不到没更新，要手动setState
            setDataSourse([...dataSource]);
            // axios.delete(`http://localhost:5000/children/${item.id}`);
            axios({
                type: 'get',
                url: '/servlet/rightListServlet',
                params: {
                    id: item.id,
                    flag: 'childrenDelete'
                }
            }).then((res) => {
                if (res.data) {
                    window.location.reload();
                }
            })
        }

    };

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
        </div>
    );
}
