/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, notification } from 'antd';
import axios from 'axios';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
const { confirm } = Modal;
export default function NewsDraft(props) {
    const [dataSource, setdataSource] = useState([]);

    const { username } = JSON.parse(localStorage.getItem('token'));
    useEffect(() => {
        //草稿箱：根据用户查询草稿箱的数据
        // /news?author=${username}&auditState=0&_expand=category
        axios({
            type: 'get',
            url: '/servlet/articleDraftSelect',
            params: {
                'username':username
            }
        }).then(res => {
            const list = res.data;
            setdataSource(list);
        });
    }, [username]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>;
            }
        },
        {
            title: '文章标题',
            dataIndex: 'title',
            render: (title, item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>;
            }
        },
        {
            title: '作者',
            dataIndex: 'author'
        },
        {
            title: '分类',
            dataIndex: 'category',
            render: (category) => {
                return category.title;
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />

                    <Button shape="circle" icon={<EditOutlined />} onClick={() => {
                        props.history.push(`/news-manage/update/${item.id}`);
                    }} />

                    <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={() => handleCheck(item.id)} />
                </div>;
            }
        }
    ];


    const handleCheck = (id) => {
        //草稿箱：将文章审核状态设置为审核中
        // axios.patch(`/news/${id}`, {
        //     auditState: 1
        // }).then(res => {
        //     props.history.push('/audit-manage/list');

        //     notification.info({
        //         message: '通知',
        //         description:
        //             `您可以到${'审核列表'}中查看您的文章`,
        //         placement: 'bottomRight'
        //     });
        // });
        axios({
            type: 'get',
            url: '/servlet/articleDraftAuditState',
            params: {
                'id': id,
                auditState:1
            }
        }).then(
            res => {
            props.history.push('/audit-manage/list');

            notification.info({
                message: '通知',
                description:
                    `您可以到${'审核列表'}中查看您的文章`,
                placement: 'bottomRight'
            });
        }
        )
    };

    const confirmMethod = (item) => {
        confirm({
            title: '你确定要删除?',
            icon: <ExclamationCircleOutlined />,
            // content: 'Some descriptions',
            onOk() {
                //   console.log('OK');
                deleteMethod(item);
            },
            onCancel() {
                //   console.log('Cancel');
            },
        });

    };
    //删除
    const deleteMethod = (item) => {
        // console.log(item)
        // 当前页面同步状态 + 后端同步

        setdataSource(dataSource.filter(data => data.id !== item.id));
        //草稿箱：删除文章
        // axios.delete(`/news/${item.id}`);
        axios({
            type: 'get',
            url: '/servlet/articleDelete',
            params: {
                id:item.id
            }
        })
    };

    return (
        <div>
            <Table dataSource={dataSource} columns={columns}
                pagination={{
                    pageSize: 5
                }}
                rowKey={item => item.id}
            />
        </div>
    );
}
