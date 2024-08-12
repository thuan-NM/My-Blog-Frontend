import React, { useState } from 'react';
import axios from 'axios';
import {
    Button,
    Form,
    Input,
    message,
} from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import jobstatusServices from '../../services/jobstatus.services';

const ApplyModal = ({ postId, onOk }) => {
    const { user } = useAuth()
    const token = localStorage.getItem('token')
    const [form] = Form.useForm();
    const formItemLayout = {
        labelCol: {
            xs: {
                span: 24,
            },
            sm: {
                span: 6,
            },
        },
        wrapperCol: {
            xs: {
                span: 24,
            },
            sm: {
                span: 14,
            },
        },
    };
    const onFinish = async (values) => {
        try {
            const response = await jobstatusServices.postJobstatus({
                postid: postId,
                userid: user._id, // replace with actual user id
                status: 'Applied', // replace with actual status
                candidateInfo: values,
            }, {
                Authorization: `Bearer ${token}`,
            });

            if (response.isSuccess) {
                message.success("Nộp thông tin ứng tuyển thành công");
                onOk();
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error('Failed to submit application:', error);
            message.error('Nộp thông tin ứng tuyển không thành công');
        }
    };

    return (
        <Form
            form={form}
            {...formItemLayout}
            onFinish={onFinish}
            autoComplete="off"
        >
            <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập tên',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập địa chỉ',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Số điện thoại"
                name="phonenumber"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập số điện thoại',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Giới thiệu"
                name="introduce"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng điền đầy đủ',
                    },
                ]}
            >
                <Input.TextArea />
            </Form.Item>
            <Form.Item className='modal-job-btn'>
                <Button type="primary" htmlType="submit" >
                    Nộp
                </Button>
            </Form.Item>
        </Form>
    );
}

export default ApplyModal;
