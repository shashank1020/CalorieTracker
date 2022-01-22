import React, { useState, useEffect, useMemo } from 'react';

import { Pie } from '@ant-design/plots';
import ReportsService from '../../services/reports-service';
import { openNotification } from '../../utils';

const Reports = () => {
    const [reportsData, setReportsData] = useState([]);
    const loadReportsData = async () => {
        try {
            let res = await ReportsService.getReports();
            if (res.error) throw new Error(res.message);
            setReportsData(res.data);
        } catch (error) {
            console.log(error);
            openNotification({ type: 'error', message: error.message });
        }
    };

    const FieldsMapping = useMemo(
        () => ({
            currentWeakEntries: 'Current Weak Entries',
            prevWeekEntries: 'Prev Week Entries',
            todayEntries: 'Today Entries',
        }),
        [],
    );

    useEffect(() => {
        loadReportsData();
    }, []);

    const data = React.useMemo(() => Object.keys(FieldsMapping).map((field) => ({ type: FieldsMapping[field], value: reportsData[field] ? reportsData[field] : 0 })), []);
    const config = {
        appendPadding: 20,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        label: {
            type: 'outer',
            content: '{name} {percentage}',
        },
        interactions: [
            {
                type: 'pie-legend-active',
            },
            {
                type: 'element-active',
            },
        ],
    };
    return (
        <div style={{ display: 'flex', height: '600px', width: '600px' }}>
            <Pie {...config} />;
        </div>
    );
};

export default Reports;
