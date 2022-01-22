import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Form, Input, InputNumber, notification, Popconfirm, Space, Table, Tooltip, Typography } from 'antd';
import getColumnSearchProps from '../../components/atoms/tableFilter/TableColumnFilter';
import FoodService from '../../services/food-service';
import RightSidebar from '../../components/molecules/sideNavigation/side-navigation';
import styles from './listFood.module.css';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import AddMeal from '../../components/molecules/addMeal/add-meal';
import WarningTwoTone from '@ant-design/icons/lib/icons/WarningTwoTone';
import moment from 'moment';
import CONSTANTS from '../../utils/constants.util';
import { openNotification } from '../../utils';

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
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

const validateFields = (dataIndex, title) => {
    let rules;
    if (dataIndex === 'calorie') {
        rules = [{ required: true, type: 'number', min: 1, max: 2000 }];
    } else if (dataIndex === 'price') {
        rules = [{ required: true, type: 'number', min: 1, max: 5000 }];
    } else rules = [{ required: true, message: `Please Input ${title}!` }];

    return rules;
};

const ListEntries = () => {
    const [form] = Form.useForm();
    const [foodItems, setFoodItems] = useState([]);
    const [editingKey, setEditingKey] = useState('');

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isNavOpen, setIsNavOpen] = useState(false);

    const [isAddMealModal, setIsAddMealModal] = useState(false);
    const [columnFilterData, setColumnFilterData] = useState({
        start: '',
        end: '',
    });

    const isEditing = (record) => {
        console.log({ EditKey: editingKey, recordKey: record.id });
        return record.id === editingKey;
    };

    let searchInput = useRef(null);

    const fetchFoodItems = React.useCallback(
        ({ page, columnFilterData }) => {
            console.log('Fetching with details', { page, ...columnFilterData });
            FoodService.fetchFoods({
                page,
                startDate: columnFilterData.start,
                endDate: columnFilterData.end,
            })
                .then((res) => {
                    if (!res.error) {
                        setFoodItems([...res.data.foodItems]);
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

    const cancel = () => {
        setEditingKey('');
    };

    function onShowSizeChange(current, pageSize) {
        setPageSize(pageSize);
    }
    const isValidFoodItem = (foodItem) => true;

    const save = async (_, record) => {
        try {
            if (!isValidFoodItem(record)) throw new Error({ message: 'Invalid form data' });
            let status = await FoodService.updateFood(record.id, { ...record });
            if (status.error) throw new Error(status.message);

            openNotification({ type: 'success', message: status.data.message });
            setFoodItems((prevState) => prevState.map((food) => (food.id === record.id ? { ...record } : food)));
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
            render: (value, item, index) => (page - 1) * pageSize + index + 1,
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
                console.log({ text, record });
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
                const editable = isEditing(record);
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
                                    <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
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

    const mergedColumns = columns.map((col) => {
        console.log('col', col);
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
                editing: isEditing(record),
            }),
        };
    });

    return (
        <div className={styles.Container}>
            <RightSidebar isOpen={isNavOpen} setIsAddMealModal={setIsAddMealModal} />
            <Button type="primary" className={styles.button} onClick={() => setIsNavOpen(!isNavOpen)} onBlur={() => setIsNavOpen(false)}>
                {React.createElement(isNavOpen ? MenuUnfoldOutlined : MenuFoldOutlined)}
            </Button>
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
                    pagination={{
                        total: 10,
                        onChange(current) {
                            setPage(current);
                            cancel();
                        },
                        defaultCurrent: 1,
                        onShowSizeChange: onShowSizeChange,
                        page,
                        pagesSize: 10,
                    }}
                />
            </Form>
            <AddMeal isModelOpen={isAddMealModal} closeModal={() => setIsAddMealModal(false)} />
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
