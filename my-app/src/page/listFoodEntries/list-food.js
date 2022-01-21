import React, {useEffect, useMemo, useRef, useState} from "react";
import {Button, Form, Input, InputNumber, notification, Popconfirm, Space, Table, Tooltip, Typography} from 'antd';
import getColumnSearchProps from "../../components/atoms/tableFilter/TableColumnFilter";
import FoodService from "../../services/food-service";
import RightSidebar from "../../components/molecules/sideNavigation/side-navigation";
import styles from './listFood.module.css'
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import AddMeal from "../../components/molecules/addMeal/add-meal";
import WarningTwoTone from "@ant-design/icons/lib/icons/WarningTwoTone";
import moment from "moment";

const EditableCell = ({
                          editing,
                          dataIndex,
                          title,
                          inputType,
                          record,
                          index,
                          children,
                          ...restProps
                      }) => {
    const inputNode = inputType === 'number' ? <InputNumber/> : <Input/>;
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

const ListEntries = () => {
    const [form] = Form.useForm();
    const [apiData, setApiData] = useState([])
    const originalData = useMemo(() => apiData?.map((d) => ({key: d?.id, ...d})), [apiData])
    const [data, setData] = useState(originalData);
    const [editingKey, setEditingKey] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isAddMealModal, setIsAddMealModal] = useState(false);
    const [columnFilterData, setColumnFilterData] = useState({start: '', end: ''})

    const isEditing = (record) => record.key === editingKey;
    let searchInput = useRef(null)

    const fetchFoods = async ({startDate, endDate, page}) => {
        return await FoodService.fetchFoods({startDate, endDate, page})
            .then((res) => res)
            .catch(e => {
                notification.open({
                    title: 'Error occurred',
                    description: e?.message
                })
            })
    }

    useEffect(() => {
        setData(originalData)
    }, [originalData])


    useEffect(() => {
        fetchFoods({}).then((res) => setApiData(res))
    }, [])

    const handleColumnFilter = (dataIndex, confirm) => {
        // console.log(columnFilterData)
        console.log(new Date(columnFilterData.end))
        let filteredData = []
        if (dataIndex === 'date') {
            const end = new Date(columnFilterData.end);
            const start = new Date(columnFilterData.start);
            filteredData = originalData.filter((eachObj) => {
                return new Date(eachObj.createdAt) <= end && new Date(eachObj.createdAt) >= start;
            })
        }
        setData(filteredData)
        setColumnFilterData({start: '', end: ''})
        confirm()
    }


    const cancel = () => {
        setEditingKey('');
    };

    function onShowSizeChange(current, pageSize) {
        setPageSize(pageSize)
    }

    const save = async (key, record) => {
        try {
            const row = (await form.validateFields());
            // const response = await updateUserApi({name: row.name, role: row.role, user_id: record.user_id})
            //call api
            const response = true
            if (response) {
                const newData = [...data];
                const index = newData.findIndex(item => key === item.key);
                if (index > -1) {
                    const item = newData[index];
                    newData.splice(index, 1, {
                        ...item,
                        ...row,
                    });
                    setData(newData);
                    setEditingKey('');
                } else {
                    newData.push(row);
                    setData(newData);
                    setEditingKey('');
                }

            }
            setEditingKey('');
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const edit = (record) => {
        form.setFieldsValue({
            name: '',
            age: '',
            address: '',
            ...record,
        });
        setEditingKey(record.key);
    };

    const handleDelete = (key) => {
        setData(data.filter(item => item.key !== key.key))
    };

    const cellInfo = () => {
        return <div style={inlineStyle.cellInfoContainer}>
            <WarningTwoTone twoToneColor="red" style={inlineStyle.icon}/>
        </div>
    }


    const handleReset = () => {
        setData(originalData)
    }

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
            render: (value, item, index) => (page - 1) * pageSize + index + 1
        },
        {
            title: `Name`,
            dataIndex: `name`,
            width: '15%',
            editable: true,
            align: 'center'
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
                    children:
                        <>
                            {record?.dayCalorie > record?.dailyThresholdLimit ?
                                <Tooltip title="Daily Calorie Limit Exceeded">
                                    {cellInfo()}
                                </Tooltip> :
                                null
                            }
                            <div>
                                {record?.dayCalorie}
                            </div>
                        </>
                };
            }
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
            editable: true,
            align: 'center',
            render(text, record) {
                return {
                    children:
                        <>
                            {record?.monthAmount > record?.monthlyThresholdLimit ?
                                <Tooltip title="Monthly Amount Exceeded">
                                    {cellInfo()}
                                </Tooltip> :
                                null
                            }
                            <div>
                                {record?.monthAmount}
                            </div>
                        </>
                };
            }
        },
        {
            title: 'Created At',
            width: '15%',
            dataIndex: 'createdAt',
            ...getColumnSearchProps(`date`, searchInput, columnFilterData, setColumnFilterData, handleColumnFilter, handleReset, disabledDate),
            editable: false,
            align: 'center'
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            width: '10%',
            render: (_, record) => {
                const editable = isEditing(record);
                return <Space size="middle"> {
                    editable ? (
                        <span>
            <a href="javascript:;" onClick={() => save(record.key, record)} style={{marginRight: 8}}>
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
                    ) : (
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                            Edit
                        </Typography.Link>
                    )
                }
                    <a onClick={() => handleDelete(record)}>Delete</a>
                </Space>
            },
        },
    ];


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
                editing: isEditing(record),
            }),
        };
    });

    return (
        <div className={styles.Container}>
            <RightSidebar isOpen={isNavOpen} setIsAddMealModal={setIsAddMealModal}/>
            <Button
                type="primary" className={styles.button}
                onClick={() => setIsNavOpen(!isNavOpen)}
                onBlur={() => setIsNavOpen(false)}
            >
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
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{
                        onChange(current) {
                            setPage(current);
                            cancel()
                        },
                        defaultCurrent: 1,
                        onShowSizeChange: onShowSizeChange
                    }}
                />
            </Form>
            <AddMeal isModelOpen={isAddMealModal} closeModal={() => setIsAddMealModal(false)}/>
        </div>
    );
};

export default ListEntries;

const inlineStyle = {
    cellInfoContainer: {
        position: 'absolute',
        top: 2,
        right: 6
    },
    icon: {
        fontSize: '12px',
    }
}
