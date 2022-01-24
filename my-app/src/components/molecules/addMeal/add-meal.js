import React from 'react';
import { Button, DatePicker, Form, Input, InputNumber, Modal } from 'antd';
import styles from './addMeal.module.css';
import CONSTANTS from '../../../utils/constants.util';
import FoodService from '../../../services/food-service';
import moment from 'moment';
import { openNotification } from '../../../utils';
import useAuth from '../../../hooks/useAuth';

const AddMeal = ({ isModelOpen, closeModal }) => {
    const validateMessages = CONSTANTS.VALIDATION_MESSAGES;
    const [user] = useAuth();

    const onSubmit = async (fieldsValue) => {
        try {
            const { name, calorie, price, createdAt, userId } = fieldsValue;
            const createdAtVal = createdAt.format('YYYY-MM-DD HH:mm'); //TODO
            let status = await FoodService.addFood({ name, calorie, createdAt: createdAtVal, price, userId });
            if (status.error) throw new Error(status.message);
            openNotification({ type: 'success', message: 'Food Item Added' });
            closeModal();
        } catch (error) {
            openNotification({ type: 'error', message: error.message });
        }
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

    const layout = {
        labelCol: { span: 10 },
        wrapperCol: { span: 8 },
    };

    function disabledDate(current) {
        // Can not select days before today and today
        return current && current > moment().endOf('day');
    }

    const getDisabledHours = () => {
        var hours = [];
        for (let i = 0; i < moment().hour(); i++) {
            hours.push(i);
        }
        return hours;
    };

    //time disable
    const getDisabledMinutes = (selectedHour) => {
        var minutes = [];
        if (selectedHour === moment().hour()) {
            for (var i = 0; i < moment().minute(); i++) {
                minutes.push(i);
            }
        }
        return minutes;
    };

    return (
        <div className={styles.Container}>
            <Modal
                title="Create Meal"
                visible={isModelOpen}
                onOk={() => {
                    onSubmit();
                }}
                onCancel={() => closeModal()}
                centered={true}
                footer={[]}
            >
                <Form {...formItemLayout} onFinish={onSubmit} validateMessages={validateMessages}>
                    <Form.Item label="Name" name={'name'} rules={[{ required: true }]}>
                        <Input placeholder="Food name" id="error" type={'string'} />
                    </Form.Item>
                    <Form.Item label="Calorie Value" name={'calorie'} rules={[{ required: true, type: 'number', min: 1, max: 2000 }]}>
                        <InputNumber placeholder="calorie" type={'number'} />
                    </Form.Item>
                    <Form.Item label="Date & Time" name={'createdAt'} rules={[{ required: true }]}>
                        <DatePicker
                            format="YYYY-MM-DD HH:mm:ss"
                            disabledDate={disabledDate}
                            showTime={{
                                disabledMinutes: moment().date() > moment(new Date()).date() ? undefined : getDisabledMinutes,
                                disabledHours: moment().date() > moment(new Date()).date() ? undefined : getDisabledHours,
                            }}
                            // showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                        />
                    </Form.Item>
                    <Form.Item label="Price" name={'price'} rules={[{ required: true, type: 'number', min: 1, max: 5000 }]}>
                        <InputNumber placeholder="price" type={'number'} />
                    </Form.Item>
                    {user.isAdmin && (
                        <Form.Item label="User Id" name={'userId'} rules={[{ required: false, type: 'number' }]}>
                            <InputNumber placeholder="User Id" type={'number'} />
                        </Form.Item>
                    )}
                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AddMeal;
