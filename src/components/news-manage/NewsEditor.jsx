/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import axios from 'axios';
import { Radio } from 'antd';
import { Spin } from 'antd';
export default function NewsEditor(props) {
    const [loading, setLoading] = useState(false)
    const [loaded, setLoaded] = useState('未上传')
    useEffect(() => {
        if (props.type == 1) {
            const html = props.content;
            if (html === undefined) return;
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                setEditorState(editorState);
            }

        } else if (props.type == 2) {
            setValue(2)
            setLoading(true)
            setLoaded('已上传')
            const reader = new FileReader();

            // 将 Blob 数据读取为 ArrayBuffer
            reader.readAsArrayBuffer(props.content);

            // 当读取完成时触发 onload 事件
            reader.onload = function (event) {
                // 从 FileReader 中获取 ArrayBuffer
                const arrayBuffer = event.target.result;

                // 将 ArrayBuffer 转换为 Uint8Array
                const uint8Array = new Uint8Array(arrayBuffer);

                // 现在你可以使用 uint8Array 来处理 PDF 数据
                pdfCanvas(uint8Array)
            };
            setLoading(false)
        }

    }, [props.content]);

    const [editorState, setEditorState] = useState('');

    const contentRef = useRef();
    const [value, setValue] = useState(1);
    const onChange = (e) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
        props.getType(e.target.value)
    };




    const [pdfContent, setPdfContent] = useState('');

    const handleFileChange = async (event) => {
        setLoaded('未上传')
        setLoading(true)
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = async () => {

            let pdfData = new Uint8Array(reader.result);

            //存入后端
            const pdfblob = new Blob([pdfData], { type: 'application/octet-stream' });

            props.getContent(pdfblob)

            pdfCanvas(pdfData)

            setLoaded('已上传')
        };

        reader.readAsArrayBuffer(file);
        setLoading(false)
    };

    async function pdfCanvas(pdfData) {
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

            }
            // setPdfContent(content);
        } catch (error) {
            console.error(error);
            setPdfContent('Error occurred while reading PDF content.');
        }
    }


    return (
        <div>
            <Radio.Group onChange={onChange} value={value} style={{ marginBottom: '20px', marginTop: '-20px' }}>
                <Radio value={1}>编辑上传</Radio>
                <Radio value={2}>文件上传</Radio>
            </Radio.Group>

            <div style={{ display: value === 2 ? 'block' : 'none' }}>
                <Spin spinning={loading} size="large">
                    <input type="file" accept=".pdf" onChange={handleFileChange} />
                    <div style={{ position: 'relative', top: '-20px', left: '75px', backgroundColor: 'white', height: '20px' }}>
                        {loaded}</div>
                    <div className="content-wrapper" ref={contentRef}>
                        {pdfContent}
                    </div>
                    <div id="pdf-canvas"></div>
                </Spin>
            </div>
            <div style={{ display: value === 1 ? 'block' : 'none' }}>
                <Editor
                    editorState={editorState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onEditorStateChange={(editorStateChange) => {
                        console.log(editorStateChange)
                        console.log('editorStateChange')
                        setEditorState(editorStateChange);
                    }}
                    onBlur={() => {
                        props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())));
                    }}
                />
            </div>

        </div>

    );

}