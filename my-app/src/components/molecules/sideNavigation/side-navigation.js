import React from 'react';
import { Menu, Button, Typography } from 'antd';
import { ContainerOutlined } from '@ant-design/icons';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

import styles from './sideNavigation.module.css';
import useActiveModal from '../../../hooks/useActiveModal';
import modalIds from '../../../utils/modalIds';
import useAuth from '../../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const RightSidebar = ({ isOpen }) => {
    const location = useLocation();
    const [, setActiveModalId] = useActiveModal();
    const [user] = useAuth();

    return (
        <>
            <Typography.Title
                level={3}
                style={{
                    position: 'absolute',
                    width: '100%',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '10px',
                }}
            >
                Calorie Tracker
            </Typography.Title>
            <div
                style={{
                    transform: `${isOpen ? 'translate(+180px)' : 'translate(0px)'}`,
                    position: 'absolute',
                    left: -180,
                    ...inlineStyle.container,
                    zIndex: 10,
                }}
                className={styles.menu}
            >
                <Menu defaultSelectedKeys={['graph']} defaultOpenKeys={['sub1']} onBlur={() => console.log('dispatch(toggleRightSidebar(false)')} mode="inline" theme="dark" inlineCollapsed={false} style={inlineStyle.container}>
                    <Menu.Item key="1" icon={<ContainerOutlined />}></Menu.Item>
                    {location.pathname === '/reports' ? (
                        <Menu.Item key="3" icon={<ContainerOutlined />}>
                            <Link to="/">Home</Link>
                        </Menu.Item>
                    ) : (
                        <Menu.Item key="2" icon={<ContainerOutlined />} onClick={() => setActiveModalId(modalIds.ADD_FOOD)}>
                            Add Meal
                        </Menu.Item>
                    )}

                    {user.isAdmin && (
                        <Menu.Item key="3" icon={<ContainerOutlined />}>
                            <Link to="/reports">Reports</Link>
                        </Menu.Item>
                    )}
                </Menu>
            </div>
        </>
    );
};

const inlineStyle = {
    container: {
        height: `100vh`,
        width: 180,
        backgroundColor: '#213245',
    },
    eachFieldStyle: {
        paddingLeft: '24px',
    },
};

const SideNavigationComp = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <>
            <RightSidebar isOpen={isOpen} />
            <Button type="primary" className="nav-button" onClick={() => setIsOpen(!isOpen)} onBlur={() => setIsOpen(false)}>
                {React.createElement(isOpen ? MenuUnfoldOutlined : MenuFoldOutlined)}
            </Button>
        </>
    );
};

export default SideNavigationComp;
