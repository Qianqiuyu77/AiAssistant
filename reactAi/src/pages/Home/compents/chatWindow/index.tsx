import { OpenAIOutlined, PaperClipOutlined } from "@ant-design/icons";
import { ChatInfo, ChatState, ConversationInfo } from "../../../../types/chat";
import "./index.scss";
import { SetStateAction, useEffect, useRef, useState } from "react";
import useBaseStore from "../../../../../zustand/baseStore";
import { message, Spin, Switch } from "antd";
import type { CSSProperties } from 'react';
import React from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
import type { CollapseProps } from 'antd';
import { Collapse, theme } from 'antd';
import { bus } from "../../../../bus";
import ReactMarkdown from "react-markdown";
import { getChat, giveLike } from "../../../../api";
import { clickPaste } from "../../../../utils";

interface ChatWindowProps {
    chatInfo: ChatInfo;
    currentCid: number;
    currentKnowledgeBaseId: number;
    getChatInfos: () => void;
    openHistoryConversation: (conversationId: number) => void;
}

const LIMIT_INPUT = 300;

const ChatWindow = (chatWindowProps: ChatWindowProps) => {
    const baseState = useBaseStore();

    const { chatInfo, currentCid, currentKnowledgeBaseId, getChatInfos, openHistoryConversation } = chatWindowProps;

    const [inputValue, setInputValue] = useState<string>("");

    const [isSending, setIsSending] = useState<boolean>(false); // 防连点标志位

    const [canUseRAG, setCanUseRAG] = useState<number>(1);

    const [canScrollBottom, setCanScrollBottom] = useState<boolean>(false);

    const latestMessageRef = useRef<HTMLDivElement | null>(null);

    const isEmptyConversation = currentCid === -1 && chatInfo.conversationInfo.length === 0;

    const handleInputChange = (event: { target: { value: SetStateAction<string> } }) => {
        setInputValue(event.target.value);
    };

    const canSend = (): boolean => {
        return !isSending && inputValue.trim() !== "";
    }

    const sendQuestion = async (inputValue: string, canUseRAG: number) => {
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
            const res = await getChat(
                {
                    question: inputValue,
                    userId: baseState.userId,
                    conversationId: currentCid,
                    knowledgeBaseId: currentKnowledgeBaseId,
                    canUseRAG
                }, baseState.token);
            if (res.data) {
                openHistoryConversation(res.data.conversationId || currentCid);
            } else {
                openHistoryConversation(currentCid);
                message.error(res.msg || "获取答案失败")
            }
            // 更新消息内容
            getChatInfos();
            scrollToLatest();
        } catch (error) {
            message.error("获取答案失败")
            console.error("获取答案失败:", error);
            rollbackConversation();
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
    const createMessage = (question: string, content: string, knowledge: string, messageId: number, favourite: number = 0) => ({
        question,
        content,
        knowledge,
        messageId,
        favourite
    });

    // 更新会话信息
    const updateConversation = (message: ConversationInfo) => {
        if (chatInfo?.conversationInfo) {
            chatInfo.conversationInfo.push(message);
        }
    };

    // rollback回话信息
    const rollbackConversation = () => {
        if (chatInfo?.conversationInfo) {
            chatInfo.conversationInfo.pop();
        }
    }

    // 滚动到最新消息
    const scrollToLatest = () => {
        setTimeout(() => {
            latestMessageRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 500);
    };

    const scrollToBottom = () => {
        latestMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }


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

    const isInView = (element: HTMLDivElement | null) => {
        if (!element) return false; // 确保元素存在
        const rect = element.getBoundingClientRect();

        const isInView =
            rect.top >= 0 && // 元素的顶部在视口范围内
            rect.left >= 0 && // 元素的左边在视口范围内
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && // 元素的底部在视口范围内
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) // 元素的右边在视口范围内
        return !isInView;
    };

    const clickGiveLike = async (isFavourite: boolean, messageId: number) => {
        try {
            const res = await giveLike(baseState.token, messageId, isFavourite ? 1 : 0)
            if (res.data) {
                getChatInfos();
                if (isFavourite) {
                    message.success("感谢您的评价，我会继续努力");
                } else {
                    message.success("感谢您的反馈，我会尽快改进");
                }

            } else {
                message.error("评价失败");
            }
        } catch (error) {
            console.error("点赞失败:", error);
            message.error("点赞失败");
        }

    }

    const refreshChat = async (message: ConversationInfo) => {
        console.log(message);
        await sendQuestion(message.question, message.knowledge ? 1 : 0)
    }

    const clickFeedback = async (messageId: number) => {
        bus.emit('openFeedBack', messageId);
    }

    const renderFavouriteIcons = (favourite: number, messageId: number) => {
        if (favourite === 1) {
            return (
                <>
                    <div className="utilsIcon">
                        <img src="src/images/点赞.png" alt="" />
                    </div>
                </>
            )
        } else if (favourite === -1) {
            return (
                <>
                    <div className="utilsIcon">
                        <img src="src/images/差评.png" alt="" />
                    </div>
                </>
            )
        } else {
            return (
                <>
                    <div className="utilsIcon" onClick={() => clickGiveLike(true, messageId)}>
                        <img src="src/images/无点赞.png" alt="" />
                    </div>
                    <div className="utilsIcon" onClick={() => clickGiveLike(false, messageId)}>
                        <img src="src/images/无差评.png" alt="" />
                    </div>
                </>
            )
        }
    }




    useEffect(() => {
        bus.on("resetInput", resetInput);
        return () => {
            bus.off("resetInput", resetInput);
        };
    }, []);

    // 滑动时计算是否可以滚动到底部
    useEffect(() => {
        const scrollContainer = document.querySelector("#chatMessageContainer"); // 替换为你的滚动容器
        const handleScroll = () => {
            if (latestMessageRef.current) {
                setCanScrollBottom(isInView(latestMessageRef.current))
            }
        };

        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);

    // 每次切换对话重新计算是否可以滚动到底部
    useEffect(() => {
        if (latestMessageRef.current) {
            setCanScrollBottom(isInView(latestMessageRef.current))
        }
    }, [currentCid])

    return (
        <div className="chatWindowContainer">
            {
                isEmptyConversation &&
                <div className="chatStartContainer">
                    <div className="chatStartTitle">
                        我是计算机智能助教，很高兴见到你！
                    </div>
                    <div className="chatStartContent">
                        我可以根据知识库中的内容为你提供帮助，请告诉我你的问题。
                    </div>
                </div>
            }
            <div className="chatMessageContainer" id="chatMessageContainer">


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
                                        : <div className="chatAnswer">
                                            <ReactMarkdown className="markdown-body">
                                                {item.content}
                                            </ReactMarkdown>
                                        </div>
                                }

                            </div>
                            {
                                !!item.messageId
                                && <div className="chatMessageUtilContainer">
                                    <div className="utilsIcon" onClick={() => clickPaste(item.content)}>
                                        <img src="src\images\复制.png" alt="复制文本" />
                                    </div>
                                    {
                                        renderFavouriteIcons(item.favourite, item.messageId)
                                    }
                                    <div className="utilsIcon" onClick={() => refreshChat(item)}>
                                        <img src="src\images\刷新.png" alt="刷新" />
                                    </div>
                                    <div className="utilsIcon" onClick={() => clickFeedback(item.messageId)} >
                                        <img src="src\images\意见反馈小.png" alt="反馈" />
                                    </div>
                                </div>
                            }
                            {
                                !!item.knowledge
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
                {
                    <div ref={latestMessageRef} />
                }
            </div>
            <div
                className="chatInputContainer"
                style={{
                    position: isEmptyConversation ? "absolute" : "relative",
                    top: isEmptyConversation ? "55%" : "0"
                }}
            >
                {
                    canScrollBottom && <div
                        className="scrollToBottom"
                        onClick={() => scrollToBottom()}
                    >
                        <img src="src/images/下.png" alt="" />
                    </div>
                }
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
                            sendQuestion(inputValue, canUseRAG);
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
                        onClick={() => sendQuestion(inputValue, canUseRAG)}
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
