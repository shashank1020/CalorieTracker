import React from 'react';
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <Result
            status='404'
            title='404'
            subTitle='Sorry, page not Found'
            extra={
                <Link to='/'>
                    <Button type='primary' key='console'>
                        Home
                    </Button>
                </Link>
            }
        />
    );
}

export default NotFound;
