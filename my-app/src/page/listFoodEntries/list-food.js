import React, { useCallback, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import WarningTwoTone from '@ant-design/icons/lib/icons/WarningTwoTone';
import { Button, Row, Form, Input, InputNumber, notification, Popconfirm, Space, Table, Tooltip, Typography, Pagination } from 'antd';

import getColumnSearchProps from '../../components/atoms/tableFilter/TableColumnFilter';
import FoodService from '../../services/food-service';
import styles from './listFood.module.css';
import AddMeal from '../../components/molecules/addMeal/add-meal';
import { openNotification } from '../../utils';
import useAuth from '../../hooks/useAuth';
import useActiveModal from '../../hooks/useActiveModal';
import modalIds from '../../utils/modalIds';

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
    const inputNode = inputType === 'number' ? <InputNumber rules={validateFields(dataIndex)} /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const validateFields = (dataIndex, title = '') => {
    //TODO: verify...
    let rules;
    if (dataIndex === 'calorie') {
        rules = [{ required: true, type: 'number', min: 1, max: 2000 }];
    } else if (dataIndex === 'price') {
        rules = [{ required: true, type: 'number', min: 1, max: 5000 }];
    } else rules = [{ required: true, message: `Please Input ${title}!` }];

    return rules;
};

const ListEntries = () => {
    const [user] = useAuth();
    const [activeModalId, setActiveModalId] = useActiveModal();
    const [form] = Form.useForm();
    const [foodItems, setFoodItems] = useState([]);
    const [editingKey, setEditingKey] = useState('');

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [columnFilterData, setColumnFilterData] = useState({
        start: '',
        end: '',
    });

    let searchInput = useRef(null);

    const fetchFoodItems = React.useCallback(
        ({ page, columnFilterData }) => {
            FoodService.fetchFoods({
                page,
                startDate: columnFilterData.start,
                endDate: columnFilterData.end,
            })
                .then((res) => {
                    if (!res.error) {
                        setFoodItems([...res.data.foodItems]);
                        setTotalPages(res.data.totalPages);
                    } else {
                        throw new Error(res);
                    }
                })
                .catch((e) => {
                    notification.open({
                        title: 'Error occurred',
                        description: e?.message,
                    });
                });
        },
        [foodItems],
    );

    useEffect(() => {
        fetchFoodItems({ page, columnFilterData });
    }, [columnFilterData, page]);

    const handleColumnFilter = (dataIndex, confirm) => {
        setPage(1);
        confirm();
    };

    const handleDisableEditMode = () => {
        setEditingKey('');
    };

    const isValidFoodItem = useCallback((foodItem) => {
        if (parseInt(foodItem.calorie) < 10 || parseInt(foodItem.calorie) > 1000) {
            throw new Error('Calorie should be b/w 10 & 1000');
        }
        if (foodItem.name.length < 3) {
            throw new Error('Name must be more than 3 letters');
        }
        if (foodItem.price < 10 || foodItem.price > 1000) {
            throw new Error('Price should be b/w 10 & 1000');
        }
    }, []);

    const save = async (_, record) => {
        try {
            let data = await form.validateFields();
            isValidFoodItem(data);
            let status = await FoodService.updateFood(record.id, { ...record, ...data });
            if (status.error) throw new Error(status.message);

            openNotification({ type: 'success', message: status.data.message });
            setFoodItems((prevState) => prevState.map((food) => (food.id === record.id ? { ...record, ...data } : food)));
            setEditingKey('');
        } catch (error) {
            openNotification({ type: 'error', message: error.message });
        }
    };

    const handleEnableEditMode = (record) => {
        //set EditMode food item id
        form.setFieldsValue({
            name: '',
            age: '',
            address: '',
            ...record,
        });
        setEditingKey(record.id);
        console.warn('Record', record);
    };

    const handleDelete = async (record) => {
        try {
            let status = await FoodService.deleteFood(record);
            if (status.error) throw new Error(status.message);

            openNotification({ type: 'success', message: status.data.message });
            setFoodItems((prevState) => prevState.filter((food) => food.id !== record.id));
        } catch (error) {
            openNotification({ type: 'error', message: error.message });
        }
    };

    const cellInfo = () => {
        return (
            <div style={inlineStyle.cellInfoContainer}>
                <WarningTwoTone twoToneColor="red" style={inlineStyle.icon} />
            </div>
        );
    };

    const handleReset = () => {
        setColumnFilterData({ start: '', end: '' });
        setPage(1);
    };

    function disabledDate(current) {
        // Can not select days before today and today
        return current && current > moment().endOf('day');
    }

    const columns = [
        {
            title: 'S NO',
            key: 'index',
            width: '5%',
            editable: false,
            align: 'center',
            render: (value, item, index) => index + 1,
        },
        {
            title: `Name`,
            dataIndex: `name`,
            width: '15%',
            editable: true,
            align: 'center',
        },
        {
            title: 'Calorie',
            dataIndex: 'calorie',
            width: '10%',
            editable: true,
            align: 'center',
        },
        {
            title: 'Day Calorie',
            dataIndex: 'dayCalorie',
            width: '10%',
            editable: false,
            align: 'center',
            render(text, record) {
                return {
                    children: (
                        <>
                            {record?.dayCalorie > record?.dailyThresholdLimit ? <Tooltip title="Daily Calorie Limit Exceeded">{cellInfo()}</Tooltip> : null}
                            <div>{record?.dayCalorie}</div>
                        </>
                    ),
                };
            },
        },
        {
            title: 'Price',
            width: '5%',
            dataIndex: 'price',
            editable: true,
            align: 'center',
        },
        {
            title: 'Month Amount',
            width: '12%',
            dataIndex: 'monthAmount',
            editable: false,
            align: 'center',
            render(text, record) {
                return {
                    children: (
                        <>
                            {record?.monthAmount > record?.monthlyThresholdLimit ? <Tooltip title="Monthly Amount Exceeded">{cellInfo()}</Tooltip> : null}
                            <div>{record?.monthAmount}</div>
                        </>
                    ),
                };
            },
        },
        {
            title: 'Created At',
            width: '15%',
            dataIndex: 'createdAt',
            ...getColumnSearchProps(`date`, searchInput, columnFilterData, setColumnFilterData, handleColumnFilter, handleReset, disabledDate),
            editable: false,
            align: 'center',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            width: '10%',
            render: (_, record) => {
                const editable = record.id === editingKey;
                return (
                    <Space size="middle">
                        {' '}
                        {editable ? (
                            <>
                                <span>
                                    <Button onClick={() => save(record.id, record)} style={{ marginRight: 8 }}>
                                        Save
                                    </Button>
                                </span>
                                <span>
                                    <Popconfirm title="Sure to cancel?" onConfirm={handleDisableEditMode}>
                                        <Button>Cancel</Button>
                                    </Popconfirm>
                                </span>
                            </>
                        ) : (
                            <Typography.Link disabled={editingKey !== ''} onClick={() => handleEnableEditMode(record)}>
                                Edit
                            </Typography.Link>
                        )}
                        {!editable && <Button onClick={() => handleDelete(record)}>Delete</Button>}
                    </Space>
                );
            },
        },
    ];

    // if Admin also display user-id col
    user.isAdmin &&
        columns.splice(2, 0, {
            title: 'UserID',
            key: 'index',
            width: '5%',
            editable: false,
            align: 'center',
            render: (value, item, index) => {
                return item.userId;
            },
        });

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: record.id === editingKey,
            }),
        };
    });

    return (
        <div className={styles.Container}>
            <Form form={form} component={false}>
                <Table
                    bordered
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    dataSource={foodItems}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={false}
                />
            </Form>

            <Row justify="center" gutter={[0, 20]} style={{ padding: '59px' }}>
                <Pagination current={page} onChange={setPage} total={10 * totalPages} showSizeChanger={false} />
            </Row>
            <AddMeal isModelOpen={activeModalId === modalIds.ADD_FOOD} closeModal={() => setActiveModalId('')} />
        </div>
    );
};

export default ListEntries;

const inlineStyle = {
    cellInfoContainer: {
        position: 'absolute',
        top: 2,
        right: 6,
    },
    icon: {
        fontSize: '12px',
    },
};
