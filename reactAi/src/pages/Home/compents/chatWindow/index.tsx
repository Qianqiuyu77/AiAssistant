import { OpenAIOutlined, PaperClipOutlined } from "@ant-design/icons";
import { ChatAnswer, ChatInfo, ChatState, ConversationInfo } from "../../../../types/chat";
import "./index.scss";
import { SetStateAction, useEffect, useRef, useState } from "react";
import useBaseStore from "../../../../../zustand/baseStore";
import { Spin, Switch } from "antd";
import type { CSSProperties } from 'react';
import React from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
import type { CollapseProps } from 'antd';
import { Collapse, theme } from 'antd';
import { bus } from "../../../../bus";
import { getTokenNumber } from "../../../../utils";

interface ChatWindowProps {
    chatInfo: ChatInfo;
    currentCid: number;
    fetchGetAnswer: (question: string, canUseRAG: number, conversationId?: number) => Promise<ChatAnswer>;
    getChatInfos: () => void;
    openHistoryConversation: (conversationId: number) => void;
}

const LIMIT_INPUT = 300;

const ChatWindow = (chatWindowProps: ChatWindowProps) => {
    const baseState = useBaseStore();

    const { chatInfo, fetchGetAnswer, currentCid, getChatInfos, openHistoryConversation } = chatWindowProps;

    const [inputValue, setInputValue] = useState("");

    const [isSending, setIsSending] = useState(false); // 防连点标志位

    const [canUseRAG, setCanUseRAG] = useState(1);

    const latestMessageRef = useRef<HTMLDivElement | null>(null);

    const handleInputChange = (event: { target: { value: SetStateAction<string> } }) => {

        setInputValue(event.target.value);
    };

    const canSend = (): boolean => {
        return !isSending && inputValue.trim() !== "";
    }

    const sendQuestion = async () => {
        if (!inputValue || isSending) {
            return;
        }

        if (baseState.chatState === ChatState.BUSY) {
            alert("正在处理中，请稍后");
            return;
        }

        // 设置状态
        baseState.setChatState(ChatState.BUSY);
        setIsSending(true);
        setInputValue("");

        // 创建临时消息
        const tempMessage = createMessage(inputValue, "", "", 0);
        updateConversation(tempMessage);

        // 滚动到最新消息
        scrollToLatest();

        try {
            const res = await fetchGetAnswer(inputValue, canUseRAG, currentCid);

            openHistoryConversation(res?.conversationId || currentCid);

            // 更新消息内容
            getChatInfos();
            scrollToLatest();
        } catch (error) {
            console.error("获取答案失败:", error);
            openHistoryConversation(currentCid);
            getChatInfos();

        } finally {
            // 恢复状态
            baseState.setChatState(ChatState.FREE);
            setIsSending(false);
        }
    };

    const resetInput = () => {
        setInputValue("");
    }

    // 创建消息对象
    const createMessage = (question: string, content: string, knowledge: string, messageId: number) => ({
        question,
        content,
        knowledge,
        messageId,
    });

    // 更新会话信息
    const updateConversation = (message: ConversationInfo) => {
        if (chatInfo?.conversationInfo) {
            chatInfo.conversationInfo.push(message);
        }
    };

    // 滚动到最新消息
    const scrollToLatest = () => {
        setTimeout(() => {
            latestMessageRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 500);
    };


    const getItems: (panelStyle: CSSProperties, knowledge: string) => CollapseProps['items'] = (panelStyle, knowledge) => [
        {
            key: '1',
            label: <span style={{ color: "#fff" }}>知识库</span>,
            children: <p>{knowledge}</p>,
            style: panelStyle,
        }
    ];

    const handleSwitchChange = (checked: boolean) => {
        if (checked) {
            setCanUseRAG(1);
            console.log("知识库已启用");
        } else {
            setCanUseRAG(0);
            console.log("知识库已关闭");
        }
    };

    const { token } = theme.useToken();

    const panelStyle: React.CSSProperties = {
        color: token.colorWhite,
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: 'none',
    };

    useEffect(() => {
        bus.on("resetInput", resetInput);
        return () => {
            bus.off("resetInput", resetInput);
        };
    }, []);

    return (
        <div className="chatWindowContainer">
            <div className="chatMessageContainer">
                {chatInfo?.conversationInfo?.map((item, index) => {
                    const isLastMessage = index === chatInfo.conversationInfo.length - 1;
                    return (
                        <div
                            className="chatMessage"
                            key={item.messageId}
                        >
                            <div className="chatQuestionContainer">
                                <div className="chatQuestion">
                                    {item.question}
                                </div>
                            </div>
                            <div className="chatAnswerContainer">
                                <OpenAIOutlined style={{ fontSize: "2rem", color: "#5d65f8", marginTop: "1rem" }} />
                                {
                                    isLastMessage && item.content === ""
                                        ? <div className="chatLoding"><Spin /></div>
                                        : <div className="chatAnswer">{item.content}</div>
                                }

                            </div>
                            {

                                item.knowledge
                                &&
                                <div className="chatKnowledgeContainer">
                                    <Collapse
                                        size="small"
                                        bordered={true}
                                        expandIcon={({ isActive }) => <CaretRightOutlined style={{ color: "#fff" }} rotate={isActive ? 90 : 0} />}
                                        style={{ background: "#5d65f8", borderRadius: "10px", padding: "10px" }}
                                        items={getItems(panelStyle, item.knowledge)}
                                    />
                                </div>
                            }
                        </div>
                    );
                })}
                <div ref={latestMessageRef} />
            </div>
            <div className="chatInputContainer">
                <PaperClipOutlined
                    className="paperClipIcon"
                />
                <input
                    className="chatInput"
                    type="text"
                    placeholder="请输入问题"
                    value={inputValue} // 绑定状态
                    maxLength={LIMIT_INPUT}
                    onChange={handleInputChange} // 监听输入变化
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            sendQuestion();
                        }
                    }}
                />
                <Switch
                    checkedChildren="使用知识库"
                    unCheckedChildren="关闭知识库"
                    defaultChecked
                    onChange={handleSwitchChange}
                />
                <div
                    className="sendButtonContainer"
                    style={{
                        backgroundColor: canSend() ? "#5d65f8" : "#ccc",
                        cursor: canSend() ? "pointer" : '',
                    }}
                >
                    <img
                        className="sendButton"
                        onClick={() => sendQuestion()}
                        src="src\images\send.png"
                    />
                </div>

            </div>
            <div className="chatTips">
                内容由AI生成，无法确保真实准确，仅供参考学习
                <div className="chatTokens">
                    Length:  {inputValue.length} / {LIMIT_INPUT}
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
