/* eslint-disable react/prop-types */
import { React, useRef } from 'react';
import { Steps, Select, Form, Input, Button, message, notification } from 'antd';
import './news-manage.css';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import NewsEditor from '../../../components/news-manage/NewsEditor';
export default function NewsAdd(props) {
    const [current, setCurrent] = useState(0);
    const [categoryList, setCategoryList] = useState([]);

    const [formInfo, setformInfo] = useState({});
    const [content, setContent] = useState('');

    const User = JSON.parse(localStorage.getItem('token'));
    const NewsForm = useRef(null);

    useEffect(() => {
        axios.get('/categories').then(res => {
        
            console.log(res.data)
            setCategoryList(res.data);
        });
    }, []);
    const handleNext = () => {
        if (current === 0) {
            NewsForm.current.validateFields().then(res => {
                for (let i = 0; i < categoryList.length; i++) { 
                if (categoryList[i].title === res.categoryId) { 
                      res.categoryId = categoryList[i].id;
                      break;
                     }
                  }
                setformInfo(res);
                setCurrent(current + 1);
            }).catch(error => {
                console.log(error);
            });
        } else {

            if (content === '' || content.trim() === '<p></p>') {
                message.error('文章内容不能为空');
            } else {
                setCurrent(current + 1);
            }
        }
    };
    const handlePrevious = () => {
        setCurrent(current - 1);
    };
    const handleSave = (auditState) => {

        axios.post('/news', {
            ...formInfo,
            'content': content,
            'region': User.region ? User.region : '全球',
            'author': User.username,
            'roleId': User.roleId,
            'auditState': auditState,
            'publishState': 0,
            'createTime': Date.now(),
            'star': 0,
            'view': 0,

        }).then(res => {
            props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list');

            notification.info({
                message: '通知',
                description:
                    `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的文章`,
                placement: 'bottomRight'
            });
        });
    };
    return (
        <div>
            <div className='newtitle'>
                <h1>
                    撰写文章
                </h1>
                <span>This is a subtitle</span>
            </div>
            <Steps
                current={current}
                items={[
                    {
                        title: '基本信息',
                        description: '文章标题，文章分类'
                    },
                    {
                        title: '文章内容',
                        description: '文章主题内容'

                    },
                    {
                        title: '文章提交',
                        description: '保存草稿或者提交内容',
                    },
                ]}
            />
            <div style={{ marginTop: 50 }}>
                {/* 基本信息模块 */}
                <div className={current === 0 ? ' ' : 'active'}>
                    <Form
                        name="basic"
                        ref={NewsForm}
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        style={{
                            maxWidth: 600,
                        }}
                        initialValues={{
                            remember: true,
                        }}

                        autoComplete="off"
                    >
                        <Form.Item
                            label="文章标题"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入文章标题!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="文章分类"
                            name="categoryId"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择文章分类!',
                                },
                            ]}
                        >
                            <Select
                                // optionFilterProp="label"
                                style={{
                                    width: 400,
                                }}
                                options={categoryList}
                            />
                        </Form.Item>


                    </Form>
                </div>
                {/* 文章内容模块 */}
                <div className={current === 1 ? ' ' : 'active'}>
                    <NewsEditor getContent={(value) => {
                        console.log(value);
                        setContent(value);
                    }}></NewsEditor>
                </div>
                <div style={{ marginTop: 50 }}>
                    {
                        current === 2 && <span>
                            <Button type="primary" onClick={() => handleSave(0)}>保存草稿箱</Button>
                            <Button danger onClick={() => handleSave(1)}>提交审核</Button>
                        </span>
                    }
                    {
                        current < 2 && <Button type="primary" onClick={handleNext}>下一步</Button>
                    }
                    {
                        current > 0 && <Button onClick={handlePrevious}>上一步</Button>
                    }
                </div>
            </div>
        </div >
    );
}
