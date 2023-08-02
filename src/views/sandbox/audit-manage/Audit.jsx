import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Space, Table, Tag, Button, notification } from 'antd';
export default function Audit() {
    const [dataSource, setdataSource] = useState([]);
    const { roleId, region, username } = JSON.parse(localStorage.getItem('token'));
    useEffect(() => {
        const roleObj = {
            '1': 'superadmin',
            '2': 'admin',
            '3': 'editor'
        };
        axios.get('/news?auditState=1&_expand=category').then(res => {
            const list = res.data;
            console.log(list)
            setdataSource(roleObj[roleId] === 'superadmin' ? list : [
                ...list.filter(item => item.author === username),
                ...list.filter(item => item.region === region && roleObj[item.roleId] === 'editor')
            ]);

        });
    }, [roleId, region, username]);


    const columns = [
        {
            title: '文章标题',
            dataIndex: 'title',
            key: 'title',
            render: (title, item) => {
              
                return <a href={`#/news-manage/preview/${item.id}`}>
                    {title}
                </a>;
            },
        },
        {
            title: '作者',
            key: 'author',
            dataIndex: 'author',

        },
        {
            title: '文章分类',
            dataIndex: 'category',
            key: 'category',
            render: (category) => {
                  console.log("title:"+category);
                console.log("item:"+category.title)
                return <div>{category.title}
                </div>;
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, item) => (
                <div>
                    <Button type='primary' onClick={() => handleAudit(item, 2, 1)}>通过</Button>
                    <Button danger onClick={() => handleAudit(item, 3, 0)}>驳回</Button>
                </div>
            ),
        },
    ];
    const handleAudit = (item, auditState, publishState) => {
        setdataSource(dataSource.filter(data => data.id !== item.id));

        axios.patch(`/news/${item.id}`, {
            auditState,
            publishState
        }).then(res => {
            notification.info({
                message: '通知',
                description:
                    '您可以到[审核管理/审核列表]中查看您的文章的审核状态',
                placement: 'bottomRight'
            });
        });
    };
    return (
        <div>
            <Table columns={columns} dataSource={dataSource} pagination={{
                pageSize: 5
            }}
            />
        </div>
    );
}
