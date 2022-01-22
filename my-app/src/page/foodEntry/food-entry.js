import { Button, DatePicker, Form, Input, InputNumber, notification } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../contexts/user-context';
import FoodService from '../../services/food-service';
import styles from './foodEntry.module.css';
import CONSTANTS from '../../utils/constants.util';
import useAuth from '../../hooks/useAuth';

const FoodEntry = (props) => {
    const [user] = useAuth();
    const [name, setName] = useState('');
    const [calorie, setCalorie] = useState(10);
    const [dateTime, setDateTime] = useState('');
    const [userId, setUserId] = useState(0);
    const foodId = props?.id;
    const validateMessages = CONSTANTS.VALIDATION_MESSAGES;

    useEffect(() => {
        if (props) {
            setName(props.name);
            setCalorie(props.calorie);
            setDateTime(props.dateTime);
            setUserId(props.userId || user.id);
        }
    }, [props, user.id]);

    const layout = {
        labelCol: { span: 12 },
        wrapperCol: { span: 10 },
    };

    const onSubmit = (fieldsValue) => {
        const { name, calorie, price, dateTime } = fieldsValue;
        const dateTimeVal = dateTime.format('YYYY-MM-DD HH:mm:ss');
        FoodService.addFood({ name, calorie, dateTime: dateTimeVal, price })
            .then((res) => {
                notification.open({
                    title: 'Success',
                    description: res.data?.message,
                });
            })
            .catch((e) => {
                notification.open({
                    title: 'Error Occcurred',
                    description: e?.message,
                });
            });
    };

    const formItemLayout = {
        labelCol: {
            xs: { span: 28 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 28 },
            sm: { span: 18 },
        },
    };

    return (
        <div className={styles.Container}>
            <h1> hiii </h1>
            <Form {...formItemLayout} onFinish={onSubmit} validateMessages={validateMessages}>
                <Form.Item label="Name" name={'name'} rules={[{ required: true }]}>
                    <Input placeholder="Food name" id="error" type={'string'} />
                </Form.Item>
                <Form.Item label="Calorie Value" name={'calorie'} rules={[{ required: true, type: 'number', min: 1, max: 2000 }]}>
                    <InputNumber placeholder="calorie" type={'number'} />
                </Form.Item>
                <Form.Item label="Date & Time" name={'dateTime'} rules={[{ required: true }]}>
                    <DatePicker format="YYYY-MM-DD HH:mm:ss" />
                </Form.Item>
                <Form.Item label="Price" name={'price'} rules={[{ required: true, type: 'number', min: 1, max: 5000 }]}>
                    <InputNumber placeholder="price" type={'number'} />
                </Form.Item>
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 14 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default FoodEntry;
