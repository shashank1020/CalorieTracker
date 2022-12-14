import { Button, DatePicker, Space } from 'antd';
import React from 'react';
import styles from './tableFilter.module.css';
import moment from 'moment';
import { FilterOutlined } from '@ant-design/icons/lib/icons';

const { RangePicker } = DatePicker;

const GetColumnFilterCell = (dataIndex, searchInput, columnFilterData, setColumnFilterData, handleColumnFilter, handleReset, disabledDate) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [localState, setLocalState] = React.useState({ ...columnFilterData });
        return (
            <div style={{ padding: 8 }}>
                {
                    <span className={styles.rangePicker}>
                        <RangePicker
                            showTime={false}
                            onChange={(value, dateString) => {
                                setLocalState({ start: dateString[0], end: dateString[1] });
                            }}
                            value={localState?.start ? [moment(localState?.start), moment(localState?.end)] : []}
                            format="YYYY-MM-DD"
                            disabledDate={disabledDate}
                        />
                    </span>
                }
                <Button
                    type="primary"
                    onClick={() => {
                        setColumnFilterData({ ...localState });
                        handleColumnFilter(dataIndex, confirm);
                    }}
                    size="small"
                    style={{ width: 70 }}
                >
                    Filter
                </Button>
                <Space />
                <div className={styles.reset}>
                    <Button type="primary" id={'reset'} size={'middle'} onClick={() => handleReset()}>
                        Reset
                    </Button>
                </div>
            </div>
        );
    },
    filterIcon: (filtered) => <FilterOutlined size={20} style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
            setTimeout(() => searchInput.select(), 100);
        }
    },
});

export default GetColumnFilterCell;
