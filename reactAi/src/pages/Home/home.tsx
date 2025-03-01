import { useEffect, useState } from 'react';
import App from './index';
import useBaseStore from '../../../zustand/baseStore';
import { notification } from 'antd';

import { getAllChat, getAllKnowledgeBase } from '../../api';
import { ChatInfo, KnowledgeBase } from '../../types/chat';
import { FrownOutlined, SmileFilled } from '@ant-design/icons';
import { useLocation } from "react-router-dom";

const Home = () => {
    const location = useLocation();
    const { userName, userId, token } = location.state || {};
    const baseState = useBaseStore();
    const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
    const [chatInfos, setChatInfos] = useState<ChatInfo[]>([]);

    const [api, contextHolder] = notification.useNotification(
        {
            stack: {
                threshold: 3,
            }
        }
    ); // Hook 放在组件的顶层

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

    const getKnowledgeBases = async () => {
        try {
            const res = await getAllKnowledgeBase(baseState.userId);
            console.log(res);
            if (res.data) {
                setKnowledgeBases(res.data);
            } else {
                setKnowledgeBases([]);
                showNotification(res.msg || "获取知识库失败", false)
            }

        } catch (err) {
            console.error(err);
            showNotification("获取知识库失败", false)
        }
    }

    const getChatInfos = async () => {
        try {
            const res = await getAllChat(baseState.userId);
            console.log(res);
            if (res.data) {
                setChatInfos(res.data)
            } else {
                setChatInfos([]);
                showNotification(res.msg || "获取聊天记录失败", false)
            }
        } catch (err) {
            console.error(err);
            showNotification('获取聊天记录失败', false);
        }
    }

    useEffect(() => {
        if (userId) {
            baseState.setToken(token);
            baseState.setUserId(userId);
        }
    }, [userId])

    // 获取聊天记录的副作用
    useEffect(() => {
        if (baseState.userId !== 0) {
            Promise.all([
                getKnowledgeBases(),
                getChatInfos()
            ])
        }
    }, [baseState.userId]);

    return (
        <>
            {contextHolder}
            <App
                chatInfos={chatInfos}
                knowledgeBases={knowledgeBases}
                showNotification={showNotification}
                getChatInfos={getChatInfos}
                userName={userName}
            />
        </>
    );
};

export default Home;
