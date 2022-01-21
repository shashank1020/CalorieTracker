import React from "react";
import {Menu} from "antd";
import {ContainerOutlined} from '@ant-design/icons';
import styles from './sideNavigation.module.css'


const RightSidebar = ({isOpen, setIsAddMealModal}) => {

    const handleAddMeal = () => {
        setIsAddMealModal(true)
    }

    return (
        <div style={{
            transform: `${isOpen ? 'translate(+180px)' : 'translate(0px)'}`,
            position: 'absolute',
            left: -180,
            ...inlineStyle.container,
            zIndex: 10,
        }} className={styles.menu}>
            <Menu
                defaultSelectedKeys={['graph']}
                defaultOpenKeys={['sub1']}
                onBlur={() => console.log('dispatch(toggleRightSidebar(false)')}
                mode="inline"
                theme="dark"
                inlineCollapsed={false}
                style={inlineStyle.container}
            >
                <Menu.Item key="1" icon={<ContainerOutlined/>}>
                </Menu.Item>
                <Menu.Item key="2" icon={<ContainerOutlined/>} onClick={() => handleAddMeal()}>
                    Add Meal
                </Menu.Item>

            </Menu>
        </div>
    )

};

const inlineStyle = {
    container: {
        height: `100vh`,
        width: 180,
        backgroundColor: '#213245'
    },
    eachFieldStyle: {
        paddingLeft: '24px'
    }
}

export default RightSidebar
