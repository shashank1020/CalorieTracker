import React, { useState, useEffect, useMemo } from 'react';

import { Pie } from '@ant-design/plots';
import ReportsService from '../services/reports-service';
import { openNotification } from '../utils/index';
import {Card, Col, Row, Statistic} from "antd";

const Reports = () => {
    const [reportsData, setReportsData] = useState([]);
    const loadReportsData = async () => {
        try {
            let res = await ReportsService.getReports();
            setReportsData({ ...res.data });
        } catch (e) {
            openNotification({ type: 'error', message: e?.response?.data?.message });
        }
    };

    const graph1 = useMemo(
        () => ({
            currentWeekEntries: 'current Week Entries',
            prevWeekEntries: 'Prev Week Entries',
        }),
        [],
    );

    const graph2 = useMemo(
        () => ({
            totalCalorieInLastSevenDays: 'Calorie in last 7 Days',
            totalUserInLastSevenDays: 'Total users in last 7 days',
            averageCaloriePerUser: 'Avg Calories ',
        }),
        [],
    );

    useEffect(() => {
        loadReportsData();
    }, []);

    const data = React.useMemo(() => Object.keys(graph1).map((field) => ({ type: graph1[field], value: reportsData[field] })), [graph1, reportsData]);
    const data2 = React.useMemo(() => Object.keys(graph2).map((field) => ({ type: graph2[field], value: reportsData[field] })), [graph2, reportsData]);
    const getConfig = (data) => ({
        appendPadding: 50,
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
    });
    return (
        <div style={{ display: 'flex', height: 'auto', width: '600px', flexDirection: 'column', margin: 'auto' }}>
            <Pie {...getConfig(data)} />;
            <Pie {...getConfig(data2)} />;
            <Row gutter={16}>
                {
                    [...data, ...data2].map(({type, value}) => {
                        return <Col span={24}>
                            <Card>
                            <Statistic title={type} value={value} />
                            </Card>
                        </Col>
                    })
                }
            </Row>
        </div>
    );
};

export default Reports;
