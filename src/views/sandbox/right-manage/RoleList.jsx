import React, { useEffect, useState } from 'react';
import { Table, Tag, Popover, Button, Modal, Tree, message } from 'antd';
import axios from 'axios';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons';
const { confirm } = Modal;


export default function RoleList() {
    const [dataSource, setDataSource] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [treeData, setTreeData] = useState([]);
    const [currentKeys, setCurrentKeys] = useState();
    const [currentId, setCurrentId] = useState(0);


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
            title: '角色名称',
            dataIndex: 'roleName',
            key: '',
        },
        {
            title: '操作',
            render: (item) => {
                return (
                    <div>
                        <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => confirmMethod(item)}></Button>

                        <Button type='primary' shape='circle' icon={<EditOutlined />} onClick={() => {
                            showModal();
                            setCurrentKeys(item.rights);
                            setCurrentId(item.id);
                        }
                        }></Button>
                        <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                            <Tree
                                checkable
                                checkedKeys={currentKeys}
                                checkStrictly={true}
                                onCheck={onCheck}
                                treeData={treeData}
                            />
                        </Modal>
                    </div >
                );
            }
        }
    ];

    const onCheck = (item) => {
        setCurrentKeys(item);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };
    const User = JSON.parse(localStorage.getItem('token'));
    const handleOk = () => {
        setIsModalOpen(false);
        setCurrentKeys(currentKeys.checked);
        setDataSource(dataSource.map(item => {

            if (item.id == currentId) {
                return {
                    ...item,
                    rights: currentKeys
                };
            }
            return item;
        }));
        // axios.patch(`/roles/${currentId}`, {
        //     rights: currentKeys.checked
        // });
        axios({
            type: 'get',
            url: '/servlet/roleListServlet',
            params: {
                id: currentId,
                flag: 'update',
                rights: JSON.stringify(currentKeys.checked)
            }
        }).then((res) => {
            if (res.data) {
                axios({
                    type: 'get',
                    url: '/servlet/LoginServlet',
                    params: {
                        username: User.username,
                        password: User.password,
                        roleState: true
                    }
                }).then(res => {
                    if (res.data.length === 0) {
                        message.error('用户名或密码不匹配');
                    } else {

                        localStorage.setItem('token', JSON.stringify(res.data[0]));
                        window.location.reload();
                    }
                })

            }
        })
    };
    const handleCancel = () => {
        setIsModalOpen(false);
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

        // axios.delete(`http://localhost:5000/roles/${item.id}`);
        axios({
            type: 'get',
            url: '/servlet/roleListServlet',
            params: {
                id: item.id,
                flag: 'delete'
            }
        }).then(res => {
            if (!res.data) {
                message.error('该角色已被用户绑定，请先取消绑定！')
            } else {
                setDataSource(dataSource.filter(data => data.id !== item.id));
            }
        })
    };
    useEffect(() => {
        // http://localhost:5000/roles
        axios.get('/servlet/roleSelectServlet').then(
            res => {
                let arr = res.data.map(item => {
                    return {
                        ...item,
                        rights: JSON.parse(item.rights)
                    }
                })
                setDataSource(arr);
            }
        );
        //http://localhost:5000/rights?_embed=children
        axios.get('/servlet/SideMenuServlet').then(
            res => {
                var result = res.data.filter(item => {
                    if (item.children.length === 0) {
                        item.children = null
                    } else {
                        item.children = item.children.filter(i =>
                            i.pagepermisson === 1
                        )
                    }
                    return item;

                })

                setTreeData(result);
            }
        );
    }, []);

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} />
        </div>
    );
}
