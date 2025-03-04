import {
    AppstoreOutlined,
    // ContainerOutlined,
    DesktopOutlined,
    MailOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined,
} from '@ant-design/icons';
import { Button, Menu, type MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

import './index.scss'
import { useState } from 'react';
import { AdminSiderKeys } from '../../../../types/admin';

interface SiderProps {
    handleSiderBarClick: (key: number) => void
}

const Sider = (props: SiderProps) => {
    const { handleSiderBarClick } = props;

    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const items: MenuItem[] = [
        { key: AdminSiderKeys.DASHBOARD_DATA, icon: <PieChartOutlined />, label: '看板数据' },
        { key: AdminSiderKeys.USER_MANAGEMENT, icon: <DesktopOutlined />, label: '用户管理' },
        { key: AdminSiderKeys.CHAT_INFORMATION, icon: <MailOutlined />, label: '对话信息' },
        {
            key: 'knowledgeBase', icon: <AppstoreOutlined />, label: '知识库',
            children: [
                { key: AdminSiderKeys.KNOWLEDGE_BASE_MANAGEMENT, label: '知识库管理' },
                { key: AdminSiderKeys.ADD_KNOWLEDGE_BASE, label: '新增知识库' },
            ]
        },
        // { key: AdminSiderKeys.LOG_MANAGEMENT, icon: <ContainerOutlined />, label: '日志管理' },
        // { key: AdminSiderKeys.FEEDBACK_INFORMATION, icon: <AppstoreOutlined />, label: '反馈信息', },
    ];

    return (
        <>
            <div className="adminSider" style={{ width: collapsed ? 80 : 256 }}>
                <Menu
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    theme="light"
                    inlineCollapsed={collapsed}
                    style={{
                        backgroundColor: '#f9f9f9',
                    }}
                    items={items}
                    onClick={(e) => {
                        handleSiderBarClick(Number(e.key))
                    }}
                />
                <div className='collapsedBtn'>
                    <Button
                        type="primary"
                        shape="circle"
                        onClick={toggleCollapsed}
                        size='large'
                    >
                        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </Button>
                </div>

            </div>
        </>

    )
}

export default Sider