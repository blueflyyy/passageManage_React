/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Button, Table, Modal, Form, Input } from 'antd';
import { useState, useRef, useContext } from 'react';
import {
    DeleteOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import { useEffect } from 'react';
import axios from 'axios';
const { confirm } = Modal;
export default function NewsCategory() {
    const [dataSourse, setDataSourse] = useState([]);
    useEffect(() => {
        axios.get('/categories').then(res => {
            setDataSourse(res.data);

        });
    }, []);


    {/**表单内容 */ }
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (id) => <b>{id}</b>,
        },
        {
            title: '栏目名称',
            dataIndex: 'title',
            key: 'title',
            onCell: (record) => ({
                record,
                editable: true,
                dataIndex: 'title',
                title: '栏目名称',
                handleSave: handleSave,
            }),
        },


        {
            title: '操作',
            key: 'action',
            render: (item) => (


                <Button shape="circle" icon={<DeleteOutlined />} danger onClick={() => confirms(item)} />
            ),
        },
    ];
    const EditableContext = React.createContext(null);
    const EditableRow = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };
    const EditableCell = ({
        title,
        editable,
        children,
        dataIndex,
        record,
        handleSave,
        ...restProps
    }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);
        useEffect(() => {
            if (editing) {
                inputRef.current.focus();
            }
        }, [editing]);
        const toggleEdit = () => {
            setEditing(!editing);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });
        };
        const save = async () => {
            try {
                const values = await form.validateFields();
                toggleEdit();
                handleSave({
                    ...record,
                    ...values,
                });
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };
        let childNode = children;
        if (editable) {
            childNode = editing ? (
                <Form.Item
                    style={{
                        margin: 0,
                    }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
            ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{
                        paddingRight: 24,
                    }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
        }
        return <td {...restProps}>{childNode}</td>;
    };

    const handleSave = (record) => {


        setDataSourse(dataSourse.map(item => {
            if (item.id === record.id) {
                return {
                    id: item.id,
                    title: record.title,
                    value: record.title
                };
            }
            return item;
        }));

        axios.patch(`/categories/${record.id}`, {
            title: record.title,
            value: record.title
        });
    };
    {/**删除操作 */ }
    const confirms = (item) => {
        confirm({
            title: '你确定要删除?',
            icon: <ExclamationCircleOutlined />,

            onOk() {

                deleteMethod(item);
            },
            onCancel() {
                console.log('zzz');
            },
        });

    };
    const deleteMethod = (item) => {

        // 当前页面同步状态 + 后端同步
        setDataSourse(dataSourse.filter(data => data.id !== item.id));
        axios.delete(`/categories/${item.id}`);
    };
    return (
        <div>
            <Table columns={columns} dataSource={dataSourse} pagination={{ pageSize: 5 }} rowKey={item => item.id}
                components={{
                    body: {
                        row: EditableRow,
                        cell: EditableCell,
                    }
                }}
            />
        </div>
    );
}
