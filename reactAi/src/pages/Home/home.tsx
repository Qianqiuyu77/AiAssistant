import { useEffect, useState } from 'react';
import App from './index';
import useBaseStore from '../../../zustand/baseStore';
import { notification } from 'antd';

import { login, getAllChat } from '../../api';
import { ChatInfo } from '../../types/chat';
import { FrownOutlined, SmileFilled } from '@ant-design/icons';

const Home = () => {
    const baseState = useBaseStore();
    const [chatInfos, setChatInfos] = useState<ChatInfo[]>([]);
    const [userName, setUserName] = useState<string>('');

    const [api, contextHolder] = notification.useNotification(); // Hook 放在组件的顶层

    // 登录函数
    async function fetchLogin() {
        try {
            const res = await login('Qianqiu', 'Xwc03420');
            console.log(res);
            return res;
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
    const showNotification = (infoMsg: string, isSuccess = true) => {
        if (isSuccess) {
            api.success({
                message: infoMsg,
                description: <div>Hello, {infoMsg}!</div>,
                placement: 'topRight',
                icon: <SmileFilled style={{ color: '#5b63f3' }} />,
            });
        } else {
            api.error({
                message: infoMsg,
                description: <div>Hello, {infoMsg}!</div>,
                placement: 'topRight',
                icon: <FrownOutlined style={{ color: '#f95755' }} />,
            })
        }

    };

    const getChatInfos = async () => {
        try {
            const res = await fetchGetAllChatInfos(baseState.userId);
            setChatInfos(res);
        } catch (err) {
            console.error(err);
            showNotification('获取聊天记录失败', false);
        }
    }

    // 使用副作用处理登录逻辑
    useEffect(() => {
        async function getLogin() {
            const { userId, userName } = await fetchLogin();
            baseState.setUserId(userId);
            setUserName(userName);
        }

        getLogin();
    }, []);

    // 获取聊天记录的副作用
    useEffect(() => {
        if (baseState.userId !== 0) {
            getChatInfos();
        }
    }, [baseState.userId]);

    return (
        <>
            {contextHolder}
            <App
                chatInfos={chatInfos}
                showNotification={showNotification}
                getChatInfos={getChatInfos}
                userName={userName}
            />
        </>
    );
};

export default Home;
