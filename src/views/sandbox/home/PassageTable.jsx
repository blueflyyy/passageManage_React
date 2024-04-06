import React, { useEffect, useState, useRef } from 'react';
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import axios from 'axios';
import moment from 'moment';

export default function PassageTable(props) {
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {

    axios({
      type: "get",
      url: "/servlet/PassageTableServlet",
      params: {
        sort: props.match.params.sort
      }
    }).then((res) => {
      setDataSource(res.data)
    })

  }, [props.match.params.sort])

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: '文章ID',
      dataIndex: 'id',
      key: 'id',
      width: '10%',

    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: '25%',
      ...getColumnSearchProps('title'),
      render: (item, _item) => {
        return <a href={`#/news-manage/preview/${_item.id}`}>{item}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      width: '20%',
      ...getColumnSearchProps('author'),
    },
    {
      title: '文章类别',
      dataIndex: 'category',
      key: 'category',
      width: '15%',
      render: (category) => {
        return <div>{category.title}</div>
      }
    },
    {
      title: '区域',
      dataIndex: 'region',
      key: 'region',
      width: '15%',
      ...getColumnSearchProps('region'),
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
      sorter: (a, b) => a.publishTime - b.publishTime,
      sortDirections: ['descend', 'ascend'],
      render: (publishTime) => {
        return <div>{moment(+publishTime).format('YYYY/MM/DD HH:mm:ss')}</div>
      }
    },
  ];
  return (<div>
    <Table columns={columns} dataSource={dataSource} />
  </div>)
}