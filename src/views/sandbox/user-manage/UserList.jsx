import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Modal, Switch } from 'antd';
import axios from 'axios';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import UserForm from '../../../components/user-manage/UserForm';



const { confirm } = Modal;

export default function RightList() {



    const [open, setopen] = useState(false);
    const [update, setupdate] = useState(false);
    const [regions, setregions] = useState([]);
    const [dataSource, setDataSourse] = useState(null);
    const [current, setcurrent] = useState();
    const [roleList, setroleList] = useState([]);
    const [isUpdateDisabled, setisUpdateDisabled] = useState(false);
    const addForm = useRef(null);
    const updateForm = useRef(null);

    const column = [
        {
            title: '区域',
            dataIndex: 'region',
            filters: [
                ...regions.map(item => ({
                    text: item.title,
                    value: item.value
                })),
                {
                    text: '全球',
                    value: '全球'
                }
            ],

            onFilter: (value, item) => {
                if (value === '全球') {
                    return item.region === '';
                }
                return item.region === value;
            },
            render: (region) => {
                return <b>{region == '' ? '全球' : region}</b>;
            }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render: (role) => {
                return <div>{role.roleName}</div>;
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',

        },
        {
            title: '用户状态',
            dataIndex: 'roleState',

            render: (roleState, item) => {
                return (
                    <Switch checked={roleState} disabled={item.default} onChange={() => handleChange(item)}></Switch>
                );
            }
        },
        {
            title: '操作',

            render: (item) => {
                return (
                    <div>
                        <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} disabled={item.default}></Button>

                        <Button type='primary' shape='circle' icon={<EditOutlined />} disabled={item.default} onClick={() => { handleUpdate(item); }}></Button >

                    </div>
                );
            }
        }
    ];
    const { username, region, roleId } = JSON.parse(localStorage.getItem('token'));
    useEffect(() => {

        axios.get('http://localhost:5000/users?_expand=role').then(
            res => {
                const list = res.data;

                //roleId=1为管理员，数据全部显示，其他身份只能显示自己的数据信息以及相同区域下下一级别的数据信息
                setDataSourse(roleId === 1 ? list : [
                    ...list.filter(item => item.username === username),
                    ...list.filter(item => item.region === region && item.roleId === 3)
                ]);
            }
        );
    }, [roleId, region, username]);
    useEffect(() => {

        axios.get('/regions').then(
            res => {

                setregions(res.data);
            }
        );
        axios.get('/roles').then(
            res => {
                setroleList(res.data);
            }
        );
    }, []);
    const handleChange = (item) => {
        item.roleState = !item.roleState;
        setDataSourse([...dataSource]);
        axios.patch(`/users/${item.id}`, {
            roleState: item.roleState
        });
    };
    const handleUpdate = (item) => {
        setupdate(true);
        setTimeout(() => {
            updateForm.current.setFieldsValue(item);


        });
        setcurrent(item);
        if (item.roleId === 1) {
            setisUpdateDisabled(true);
        } else {
            setisUpdateDisabled(false);
        }
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
        setDataSourse(dataSource.filter(data => data.id !== item.id));
        axios.delete(`/users/${item.id}`);

    };
    const addFormOk = () => {
        addForm.current.validateFields().then(
            value => {
                setopen(false);
                addForm.current.resetFields();
                axios.post('/users', {
                    ...value,
                    'roleState': true,
                    'default': false
                }).then(res => {
                    console.log(res.data);
                    setDataSourse([...dataSource, {
                        ...res.data,
                        role: roleList.filter(item => item.id === value.roleId)[0]
                    }]);

                }).catch(err => {
                    console.log(err);
                });
            });
    };
    const updateFormOk = () => {
        updateForm.current.validateFields().then(value => {
            setupdate(false);
            setDataSourse(dataSource.map(item => {
                if (item.id === current.id) {
                    return {
                        ...item,
                        ...value,
                        role: roleList.filter(data => data.id === value.roleId)[0]
                    };
                }
                return item;
            }));
            setisUpdateDisabled(!isUpdateDisabled);
            axios.patch(`/users/${current.id}`, value);
        });
    };
    return (
        <div>
            <Button type="primary" onClick={() => { setopen(true); }}>添加用户</Button>
            <Table dataSource={dataSource} columns={column} pagination={{ pageSize: 5 }} rowKey={(item) => item.id} />
            <Modal
                open={open}
                title="添加用户信息"
                okText="Create"
                cancelText="Cancel"
                onCancel={() => { setopen(false); }}
                onOk={addFormOk}
            >
                <UserForm regions={regions} roleList={roleList} ref={addForm} ></UserForm>
            </Modal>
            <Modal
                open={update}
                title="更新用户信息"
                okText="更新"
                cancelText="Cancel"
                onCancel={() => { setisUpdateDisabled(!isUpdateDisabled); setupdate(false); }}
                onOk={updateFormOk}
            >
                <UserForm regions={regions} roleList={roleList} ref={updateForm} isUpdateDisabled={isUpdateDisabled} isUpdate={true}></UserForm>
            </Modal>
        </div >
    );
}
