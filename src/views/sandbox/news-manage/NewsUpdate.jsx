/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from 'react';
import { Steps, Button, Form, Input, Select, message, notification } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import './news-manage.css';
import axios from 'axios';
import NewsEditor from '../../../components/news-manage/NewsEditor';
const { Step } = Steps;
const { Option } = Select;


export default function NewsUpdate(props) {
    const [current, setCurrent] = useState(0);
    const [categoryList, setCategoryList] = useState([]);

    const [formInfo, setformInfo] = useState({});
    const [content, setContent] = useState('');
    const [type, setType] = useState(1)

    // const User = JSON.parse(localStorage.getItem("token"))
    const handleNext = () => {
        if (current === 0) {
            NewsForm.current.validateFields().then(res => {

                setformInfo(res);
                setCurrent(current + 1);
            }).catch(error => {
                console.log(error);
            });
        } else {

            if (type === 1 && (content === '' || content.trim() === '<p></p>')) {
                message.error('文章内容不能为空');
            } else if (type === 2 && content === '') {
                message.error('文章内容不能为空');
            } else {
                setCurrent(current + 1);
            }
        }
    };
    const handlePrevious = () => {
        setCurrent(current - 1);
    };

    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };

    const NewsForm = useRef(null);

    useEffect(() => {
        //在草稿箱中修改文章：查询文章分类数据
        // /categories
        axios.get('/servlet/articleCategorySelect').then(res => {

            setCategoryList(res.data);
        });
    }, []);

    useEffect(() => {
        //文章：查询文章详情
        // axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
        //     console.log(res.data);
        //     let { title, categoryId, content } = res.data;
        //     console.log(content);
        //     NewsForm.current.setFieldsValue({
        //         title,
        //         categoryId
        //     });

        //     setContent(content);
        // });

        axios({
            type: 'get',
            url: '/servlet/articleDetail',
            params: {
                id: props.match.params.id
            }
        }).then(res => {
            let { title, categoryId, content } = res.data;

            console.log(content);
            NewsForm.current.setFieldsValue({
                title,
                categoryId
            });
            if (res.data.type === 2) {
                setType(2)
                axios({
                    method: 'post',
                    url: '/servlet/articleDetailPdf',
                    params: {
                        id: props.match.params.id
                    },
                    responseType: 'arraybuffer'
                }).then(res => {
                    let pdfContent = new Uint8Array(res.data)
                    setContent(new Blob([pdfContent], { type: 'application/octet-stream' }));
                });
            } else {
                setContent(content)
            }



        })
    }, [props.match.params.id]);

    //草稿箱中修改文章后：保存
    const handleSave = (auditState) => {
        // axios.patch(`/news/${props.match.params.id}`, {
        //     ...formInfo,
        //     'content': content,
        //     'auditState': auditState,
        // })
        if (type === 1) {
            axios({
                type: 'get',
                url: '/servlet/articleUpdate',
                params: {
                    ...formInfo,
                    id: props.match.params.id,
                    content: content,
                    auditState: auditState,
                    type: type
                }
            }).then(res => {
                props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list');

                notification.info({
                    message: '通知',
                    description:
                        `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的文章`,
                    placement: 'bottomRight'
                });
            });
        } else {

            const formData = new FormData();
            formData.append('categoryId', formInfo.categoryId)
            formData.append('title', formInfo.title)
            formData.append('type', type)
            formData.append('auditState', auditState)
            formData.append('contentblob', content)
            formData.append('id', props.match.params.id)

            axios.post('/servlet/articleUpdatePdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                // pdfData = new Uint8Array(response.data);
                console.log('File uploaded successfully');
                props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list');

                notification.info({
                    message: '通知',
                    description:
                        `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的文章`,
                    placement: 'bottomRight'
                });
            }).catch(error => {
                console.error('Error uploading file:', error);
            });
        }

    };

    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="更新文章"
                onBack={() => props.history.goBack()}
                subTitle="This is a subtitle"
            />

            <Steps current={current}>
                <Step title="基本信息" description="文章标题，文章分类" />
                <Step title="文章内容" description="文章主体内容" />
                <Step title="文章提交" description="保存草稿或者提交审核" />
            </Steps>


            <div style={{ marginTop: '50px' }}>
                <div className={current === 0 ? '' : 'active'}>

                    <Form
                        {...layout}
                        name="basic"
                        ref={NewsForm}
                    >
                        <Form.Item
                            label="文章标题"
                            name="title"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="文章分类"
                            name="categoryId"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Select>
                                {
                                    categoryList.map(item =>
                                        <Option value={item.id} key={item.id}>{item.title}</Option>
                                    )
                                }
                            </Select>
                        </Form.Item>

                    </Form>
                </div>

                <div className={current === 1 ? '' : 'active'}>
                    <NewsEditor getContent={(value) => {
                        setContent(value);
                    }} content={content} getType={(value) => { setType(value) }} type={type}></NewsEditor>
                </div>
                <div className={current === 2 ? '' : 'active'}></div>

            </div>
            <div style={{ marginTop: '50px' }}>
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
    );
}
