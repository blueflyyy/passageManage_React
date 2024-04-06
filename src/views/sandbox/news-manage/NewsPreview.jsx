/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Descriptions } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import moment from 'moment';
import axios from 'axios';
import { Spin } from 'antd';
import {
    LikeOutlined, EyeOutlined
} from '@ant-design/icons';
import './news-manage.css';
import { color } from 'echarts';
export default function NewsPreview(props) {

    const [newsInfo, setnewsInfo] = useState(null);
    const [color, setColor] = useState('black');
    const [pdfContent, setPdfContent] = useState('');
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        //文章：根据文章id展示文章内容，（可能需要处理评论，浏览量，点赞数量的问题）

        // axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
        //     setnewsInfo(res.data);
        // });
        axios({
            type: 'get',
            url: '/servlet/articleViewServlet',
            params: {
                aid: props.match.params.id
            }
        }).then(res => {
            getNewInfo()
        })
    }, [props.match.params.id]);

    var { id } = JSON.parse(localStorage.getItem('token'));

    useEffect(() => {
        axios({
            type: 'get',
            url: '/servlet/articleLikeServlet',
            params: {
                flag: 'select',
                aid: props.match.params.id,
                uid: id
            }
        }).then(res => {
            if (res.data) {
                setColor('blue')
            }
        });
    }, [props.match.params.id])

    const auditList = ['未审核', '审核中', '已通过', '未通过'];
    const publishList = ['未发布', '待发布', '已上线', '已下线'];

    const colorList = ['black', 'orange', 'green', 'red'];

    function getNewInfo() {
        axios({
            type: 'get',
            url: '/servlet/articleDetail',
            params: {
                id: props.match.params.id
            }
        }).then(res => {
            setnewsInfo(res.data);
            if (res.data.type === 2) {
                axios({
                    method: 'post',
                    url: '/servlet/articleDetailPdf',
                    params: {
                        id: props.match.params.id
                    },
                    responseType: 'arraybuffer'
                }).then(res => {

                    loadPdfjs(new Uint8Array(res.data), setPdfContent, setLoading)

                });
            } else {
                setLoading(false)
            }
        });
    }

    function liked() {
        if (color === 'black') {
            axios({
                type: 'get',
                url: '/servlet/articleLikeServlet',
                params: {
                    flag: 'insert',
                    aid: props.match.params.id,
                    uid: id
                }
            }).then(res => {
                if (res.data) {
                    setColor('blue')
                    getNewInfo()
                }
            });

        } else {
            axios({
                type: 'get',
                url: '/servlet/articleLikeServlet',
                params: {
                    flag: 'delete',
                    aid: props.match.params.id,
                    uid: id
                }
            }).then(res => {
                if (res.data) {
                    setColor('black')
                    getNewInfo()
                }
            });

        }


    }





    return (
        <div>
            {
                newsInfo && <div>
                    <PageHeader
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={newsInfo.category.title}
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item label="创建时间">{moment(+newsInfo.createTime).format('YYYY/MM/DD HH:mm:ss')}</Descriptions.Item>
                            <Descriptions.Item label="发布时间">{
                                newsInfo.publishTime ? moment(+newsInfo.publishTime).format('YYYY/MM/DD HH:mm:ss') : '-'
                            }</Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="审核状态" ><span style={{ color: colorList[newsInfo.auditState] }}>{auditList[newsInfo.auditState]}</span></Descriptions.Item>
                            <Descriptions.Item label="发布状态" ><span style={{ color: colorList[newsInfo.publishState] }}>{publishList[newsInfo.publishState]}</span></Descriptions.Item>
                            <Descriptions.Item ><EyeOutlined style={{ marginRight: '2px' }} />{newsInfo.view}</Descriptions.Item>
                            <Descriptions.Item ><LikeOutlined style={{ marginRight: '2px', color: color }} onClick={liked} />{newsInfo.star}</Descriptions.Item>
                            <Descriptions.Item label="评论">0</Descriptions.Item>
                        </Descriptions>
                    </PageHeader>

                    <div dangerouslySetInnerHTML={{
                        __html: newsInfo.content
                    }} style={{
                        margin: '0 18px',
                        border: '1px solid gray',
                        display: newsInfo.type === 1 ? 'block' : 'none'
                    }}>
                    </div>
                    <div style={{ display: newsInfo.type === 2 ? 'block' : 'none' }}>
                        <Spin spinning={loading} size="large" >
                            <div className="content-wrapper" >
                                {pdfContent}
                            </div>
                            <div id="pdf-canvas"></div>
                        </Spin>
                    </div>
                    <div className='footer'>
                    </div>
                </div>
            }
        </div>
    );
}
export async function loadPdfjs(pdfData, setPdfContent, setLoading) {


    const pdfjs = await import('pdfjs-dist/build/pdf');
    pdfjs.GlobalWorkerOptions.workerSrc = "https://cdn.bootcss.com/pdf.js/2.8.335/pdf.worker.js";


    const loadingTask = pdfjs.getDocument({ data: pdfData });

    try {
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        let content = '';
        const parentElement = document.getElementById('pdf-canvas')
        // 判断是否有子元素
        if (parentElement.hasChildNodes()) {
            // 循环删除所有子元素
            while (parentElement.firstChild) {
                parentElement.removeChild(parentElement.firstChild);
            }
            console.log("子元素已删除");
        } else {
            console.log("没有子元素");
        }
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);

            // 创建 canvas 元素
            const canvas = document.createElement('canvas');
            canvas.id = 'canvas' + pageNum;
            parentElement.appendChild(canvas)

            // var scale = 1.0
            var viewport = page.getViewport({ scale: 2.0 })
            var context = canvas.getContext('2d')
            canvas.height = viewport.height
            canvas.width = viewport.width
            var renderContext = {
                canvasContext: context,
                viewport: viewport
            }

            page.render(renderContext)
            setLoading(false)

        }
        // setPdfContent(content);
    } catch (error) {
        console.error(error);
        setPdfContent('Error occurred while reading PDF content.');
    }
}
