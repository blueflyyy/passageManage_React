import React, { useEffect, useState } from 'react';
import { Table, Tag, Popover, Button, Modal, Tree } from 'antd';
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
    const handleOk = () => {
        setIsModalOpen(false);
        setCurrentKeys(currentKeys.checked);
        console.log('currentkey:', currentKeys);
        setDataSource(dataSource.map(item => {

            if (item.id == currentId) {
                return {
                    ...item,
                    rights: currentKeys
                };
            }
            return item;
        }));
        axios.patch(`/roles/${currentId}`, {
            rights: currentKeys.checked
        });
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
        setDataSource(dataSource.filter(data => data.id !== item.id));
        axios.delete(`http://localhost:5000/roles/${item.id}`);
    };
    useEffect(() => {
        axios.get('http://localhost:5000/roles').then(
            res => {
                setDataSource(res.data);
            }
        );

        axios.get('http://localhost:5000/rights?_embed=children').then(
            res => {
                setTreeData(res.data);
            }
        );
    }


    , []);

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} />
        </div>
    );
}
