/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { getAllKnowledgeBase, getAllMessages, getEcharsData, getusers } from "../../api";
import App from "./index";
import { message } from "antd";
import { AdminKnowledgeBase, EcharsData, UserData } from "../../types/admin";
import { useLocation } from "react-router-dom";
import { MessageType } from "../../types/chat";
import useBaseStore from "../../../zustand/baseStore";

const Admin = () => {

    const location = useLocation();
    const { userName, token, userId } = location.state || {};

    const [echarsData, setEcharsData] = useState<EcharsData>({
        activeUserCount: 0,
        totalUserCount: 0,
        totalMessageCount: 0,
        messageCount: [],
        avgScore: [],
        knowledgeBasesData: []
    });

    const baseState = useBaseStore(state => state);

    const [userDatas, setUserDatas] = useState<UserData[]>([]);

    const [messageInfos, setMessageInfos] = useState<MessageType[]>([]);

    const [knowledgeBases, setKnowledgeBases] = useState<AdminKnowledgeBase[]>([]);

    async function fetchGetEcharsData() {
        try {
            const res = await getEcharsData(token);
            if (res.data) {
                setEcharsData(res.data);
            } else {
                message.error({
                    content: res.msg || "获取看板数据失败，请重试",
                    key: "loading",
                    duration: 2,
                })
            }

            return res.data;
        } catch (err) {
            console.log(err);

            message.error({
                content: "获取看板数据失败，请重试",
                key: "loading",
                duration: 2,
            });
        }
    }

    async function fetchGetUserData() {
        try {
            const res = await getusers(token);
            if (res.data) {
                setUserDatas(res.data);
            } else {
                message.error({
                    content: res.msg || "获取用户信息失败，请重试",
                    key: "loading",
                    duration: 2,
                })
            }

        } catch (err) {
            console.log(err);
            message.error({
                content: "获取用户信息失败，请重试",
                key: "loading",
                duration: 2,
            });
        }
    }

    async function fetchGetAllMessages() {
        try {
            const res = await getAllMessages(token);
            console.log(res);
            if (res.data) {
                setMessageInfos(res.data);
            } else {
                message.error({
                    content: res.msg || "获取对话信息失败，请重试",
                    key: "loading",
                    duration: 2,
                })
            }

        } catch (err) {
            console.log(err);
            message.error({
                content: "获取对话信息失败，请重试",
                key: "loading",
                duration: 2,
            });
        }
    }

    async function fetchGetKnowledgeBases() {
        try {
            const res = await getAllKnowledgeBase(userId);
            console.log(res);
            if (res.data) {
                setKnowledgeBases(res.data);
            } else {
                message.error({
                    content: res.msg || "获取知识库信息失败，请重试",
                    key: "loading",
                    duration: 2,
                });
            }
        } catch (err) {
            console.log(err);
            message.error({
                content: "获取知识库信息失败，请重试",
                key: "loading",
                duration: 2,
            });
        }
    }


    // 使用副作用处理登录逻辑
    useEffect(() => {
        fetchGetEcharsData();
    }, []);

    useEffect(() => {
        if (token && userId) {
            baseState.setToken(token);
            baseState.setUserId(userId);
        }
    }, [token, userId]);


    return (
        <>
            <App
                userName={userName}
                echarsData={echarsData}
                userDatas={userDatas}
                messageInfos={messageInfos}
                knowledgeBases={knowledgeBases}
                fetchGetUserData={fetchGetUserData}
                fetchGetEcharsData={fetchGetEcharsData}
                fetchGetAllMessages={fetchGetAllMessages}
                fetchGetKnowledgeBases={fetchGetKnowledgeBases}
            />
        </>
    );
}

export default Admin;