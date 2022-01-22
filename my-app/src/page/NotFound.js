import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
            extra={
                <Link to="/">
                    <Button type="primary" key="console">
                        Home
                    </Button>
                </Link>
            }
        />
    );
}

export default NotFound;
