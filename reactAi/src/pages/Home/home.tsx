import { useEffect, useState } from 'react';
import App from './index';
import useBaseStore from '../../../zustand/baseStore';
import { notification } from 'antd';

import { login, getAllChat } from '../../api';
import { ChatInfo } from '../../types/chat';
import { FrownOutlined } from '@ant-design/icons';

const Home = () => {
    const baseState = useBaseStore();
    const [chatInfos, setChatInfos] = useState<ChatInfo[]>([]);

    const [api, contextHolder] = notification.useNotification(); // Hook 放在组件的顶层

    // 登录函数
    async function fetchLogin() {
        try {
            const res = await login('Qianqiu', 'Xwc03420');
            console.log(res);
            return res.userId;
        } catch (err) {
            console.error(err);
        }
    }

    // 获取聊天记录
    async function fetchGetAllChatInfos(userId: number): Promise<ChatInfo[]> {
        try {
            const res = await getAllChat(userId);
            return res;
        } catch (err) {
            console.error(err);
            throw new Error('Failed to fetch chat info');
        }
    }

    // 通知显示函数
    const showNotification = (infoMsg: string) => {
        api.info({
            message: infoMsg,
            description: <div>Hello, {infoMsg}!</div>, // 使用从 Context 获取的值
            placement: 'topRight',
            icon: <FrownOutlined style={{ color: '#108ee9' }} />,
        });
    };

    // 使用副作用处理登录逻辑
    useEffect(() => {
        async function getLogin() {
            const userId = await fetchLogin();
            baseState.setUserId(userId);
        }

        getLogin();
    }, []);

    // 获取聊天记录的副作用
    useEffect(() => {
        async function getChatInfos(userId: number) {
            try {
                const res = await fetchGetAllChatInfos(userId);
                setChatInfos(res);

            } catch (err) {
                console.error(err);
                showNotification('获取聊天记录失败');
            }
        }

        if (baseState.userId !== 0) {
            getChatInfos(baseState.userId);
        }
    }, [baseState.userId]);

    return (
        <>
            {contextHolder}
            <App
                chatInfos={chatInfos}
            />
        </>
    );
};

export default Home;
