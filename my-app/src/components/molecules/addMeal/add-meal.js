import {Button, DatePicker, Form, Input, InputNumber, Modal, notification} from "antd";
import React, {useState} from "react";
import styles from './addMeal.module.css'
import CONSTANTS from "../../../utils/constants.util";
import FoodService from "../../../services/food-service"
import moment from 'moment';

const AddMeal = ({isModelOpen, closeModal}) => {
    const [name, setName] = useState("")
    const [calorie, setCalorie] = useState(10);
    const [dateTime, setDateTime] = useState("");
    const [userId, setUserId] = useState(0);
    // const foodId = props?.id;
    const validateMessages = CONSTANTS.VALIDATION_MESSAGES

    // useEffect(() => {
    //     if (props) {
    //         setName(props.name);
    //         setCalorie(props.calorie);
    //         setDateTime(props.dateTime);
    //         setUserId(props.userId || user.id);
    //     }
    // }, [props, user.id])


    const onSubmit = (fieldsValue) => {
        console.log({fieldsValue})
        closeModal()
        const {name, calorie, price, dateTime} = fieldsValue
        const dateTimeVal = dateTime.format('YYYY-MM-DD HH:mm:ss')
        FoodService.addFood({name, calorie, dateTime: dateTimeVal, price})
            .then((res) => {
                notification.open({
                    title: 'Success',
                    description: res.data?.message
                })
                closeModal()
            })
            .catch(e => {
                notification.open({
                    title: 'Error Occcurred',
                    description: e?.message
                })
                closeModal()
            })
    }

    const formItemLayout = {
        labelCol: {
            xs: {span: 28},
            sm: {span: 8},
        },
        wrapperCol: {
            xs: {span: 28},
            sm: {span: 18},
        },
    }

    const layout = {
        labelCol: {span: 10},
        wrapperCol: {span: 8},
    };

    function disabledDate(current) {
        // Can not select days before today and today
        return current && current < moment().endOf('day');
    }

    const getDisabledHours = () => {
        var hours = [];
        for (let i = 0; i < moment().hour(); i++) {
            hours.push(i);
        }
        return hours;
    }

    //time disable
    const getDisabledMinutes = (selectedHour) => {
        var minutes = [];
        if (selectedHour === moment().hour()) {
            for (var i = 0; i < moment().minute(); i++) {
                minutes.push(i);
            }
        }
        return minutes;
    }

    return (
        <div className={styles.Container}>
            <Modal title="Create Meal" visible={isModelOpen} onOk={() => {
                onSubmit()
            }} onCancel={() => closeModal()}
                   centered={true}
                   footer={[]}
            >
                <Form {...formItemLayout} onFinish={onSubmit} validateMessages={validateMessages}>
                    <Form.Item
                        label="Name"
                        name={'name'}
                        rules={[{required: true}]}
                    >
                        <Input placeholder="Food name" id="error" type={'string'}/>
                    </Form.Item>
                    <Form.Item
                        label="Calorie Value"
                        name={'calorie'}
                        rules={[{required: true, type: 'number', min: 1, max: 2000}]}
                    >
                        <InputNumber placeholder="calorie" type={'number'}/>
                    </Form.Item>
                    <Form.Item
                        label="Date & Time"
                        name={'dateTime'}
                        rules={[{required: true}]}
                    >
                        <DatePicker
                            format="YYYY-MM-DD HH:mm:ss"
                            disabledDate={disabledDate}
                            showTime={{
                                disabledMinutes: moment().date() > moment(new Date()).date() ? undefined : getDisabledMinutes,
                                disabledHours: moment().date() > moment(new Date()).date() ? undefined : getDisabledHours
                            }}
                            // showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Price"
                        name={'price'}
                        rules={[{required: true, type: 'number', min: 1, max: 5000}]}
                    >
                        <InputNumber placeholder="price" type={'number'}/>
                    </Form.Item>
                    <Form.Item wrapperCol={{...layout.wrapperCol, offset: 8}}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default AddMeal;