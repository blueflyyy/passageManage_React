/* eslint-disable react/prop-types */
import React from 'react';
import { Table } from 'antd';
export default function NewsPublic(props) {




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
                return <div>{category.title}
                </div>;
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (item) => {
                return <div>
                    {props.button(item.id)}
                </div>;
            }
        },
    ];
    return (
        <div>
            <Table columns={columns} dataSource={props.dataSource} pagination={{
                pageSize: 5
            }}
            />
        </div>
    );
}
