import {Button, DatePicker, Space} from "antd";
import React from "react";
import styles from './tableFilter.module.css'
import moment from 'moment';
import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";

const {RangePicker} = DatePicker;

const getColumnSearchProps = (dataIndex, searchInput, columnFilterData, setColumnFilterData, handleColumnFilter, handleReset, disabledDate) => ({
    filterDropdown: ({setSelectedKeys, selectedKeys, confirm}) => (
        <div style={{padding: 8}}>
            {
                <span className={styles.rangePicker}>
                <RangePicker
                    showTime={{
                        hideDisabledOptions: true,
                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                    }}
                    onChange={(value, dateString) => {
                        setColumnFilterData({start: dateString[0], end: dateString[1]})
                    }}
                    value={columnFilterData?.start ? [moment(columnFilterData?.start), moment(columnFilterData?.end)] : []}
                    format="YYYY-MM-DD HH:mm:ss"
                    disabledDate={disabledDate}
                />
                </span>
            }
            <Button
                type="primary"
                onClick={() => handleColumnFilter(dataIndex, confirm)}
                size="small"
                style={{width: 70}}
            >
                Filter
            </Button>
            <Space/>
            <div className={styles.reset}>
                <Button
                    type="primary"
                    id={'reset'}
                    size={'middle'}
                    onClick={() => handleReset()}
                >
                    Reset
                </Button>
            </div>
        </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>,
    onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
            setTimeout(() => searchInput.select(), 100);
        }
    }
});

export default getColumnSearchProps

