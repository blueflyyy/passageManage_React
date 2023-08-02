/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useEffect, useState, forwardRef } from 'react';
import { Form, Input, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
const { Option } = Select;
const UserForm = forwardRef((props, ref) => {
    const [isDisabled, setisDisabled] = useState(false);
    const form = useForm();
    useEffect(() => {

        setisDisabled(props.isUpdateDisabled);
    }, [props.isUpdateDisabled]);

    const { roleId, region } = JSON.parse(localStorage.getItem('token'));
    const roleObj = {
        '1': 'superadmin',
        '2': 'admin',
        '3': 'editor'
    };
    const checkRegionDisabled = (item) => {
        if (props.isUpdate) {
            if (roleObj[roleId] === 'superadmin') {
                return false;
            } else {
                return true;
            }
        } else {
            if (roleObj[roleId] === 'superadmin') {
                return false;
            } else {
                return item.value !== region;
            }
        }
    };

    const checkRoleDisabled = (item) => {
        if (props.isUpdate) {
            if (roleObj[roleId] === 'superadmin') {
                return false;
            } else {
                return true;
            }
        } else {
            if (roleObj[roleId] === 'superadmin') {
                return false;
            } else {
                return roleObj[item.id] !== 'editor';
            }
        }
    };
    return (
        <Form
            ref={ref}
            layout="vertical"
            name="form_in_modal"

        >
            <Form.Item
                name="username"
                label="用户名"
                rules={[
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={isDisabled ? [] : [
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >
                <Select
                    style={{
                        width: 472
                    }}

                    // options={props.regions}
                    disabled={isDisabled}
                >
                    {
                        props.regions.map(item =>
                            <Option value={item.value} key={item.id} disabled={checkRegionDisabled(item)}>{item.title}</Option>
                        )
                    }
                </Select>
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"

            >
                <Select style={{
                    width: 472
                }} onChange={(value) => {

                    if (value == 1) {
                        setisDisabled(true);
                        ref.current.setFieldsValue({
                            region: ''
                        });
                    } else {
                        setisDisabled(false);
                    }
                }} >
                    {
                        props.roleList.map(item => { return <Option value={item.id} key={item.id} disabled={checkRoleDisabled(item)}>{item.roleName}</Option>; })
                    }
                </Select>
            </Form.Item>

        </Form>
    );
});
export default UserForm;
