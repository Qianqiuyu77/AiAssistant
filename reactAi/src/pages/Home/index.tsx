import { useEffect, useState } from "react";
import { ChatAnswer, ChatInfo, defaultChatInfo, KnowledgeBase } from "../../types/chat";
import "./index.scss"
import ConversationList from "./compents/conversationList/index";
import ChatWindow from "./compents/chatWindow";
import useBaseStore from "../../../zustand/baseStore";
import { getChat } from "../../api";
import { bus } from "../../bus";
import SiderBar from "./compents/siderBar";

interface HomeProps {
    chatInfos: ChatInfo[];
    userName: string;
    showNotification: (message: string) => void;
    getChatInfos: () => void;
}

const knowledgeBaseList: KnowledgeBase[] = [
    {
        knowledgeBaseId: 1,
        knowledgeBaseName: '计算机系统',
        knowledgeBaseDescription: '计算机系统的描述',
        knowledgeIcon: 'src/images/计算机.png'
    },
    {
        knowledgeBaseId: 2,
        knowledgeBaseName: 'JavaScript',
        knowledgeBaseDescription: 'JavaScript的描述',
        knowledgeIcon: 'src/images/js.png'
    },
    {
        knowledgeBaseId: 3,
        knowledgeBaseName: '操作系统',
        knowledgeBaseDescription: '操作系统的描述',
        knowledgeIcon: 'src/images/操作系统.png'
    },
    {
        knowledgeBaseId: 4,
        knowledgeBaseName: '计算机网络',
        knowledgeBaseDescription: '计算机网络的描述',
        knowledgeIcon: 'src/images/网络计算机.png'
    },
    {
        knowledgeBaseId: 5,
        knowledgeBaseName: '数据结构与算法',
        knowledgeBaseDescription: '数据结构的描述',
        knowledgeIcon: 'src/images/数据结构.png'
    },
    {
        knowledgeBaseId: 6,
        knowledgeBaseName: 'Java',
        knowledgeBaseDescription: 'Java的描述',
        knowledgeIcon: 'src/images/java.png'
    },
    {
        knowledgeBaseId: 7,
        knowledgeBaseName: 'Python',
        knowledgeBaseDescription: 'Python的描述',
        knowledgeIcon: 'src/images/python.png'
    },
    {
        knowledgeBaseId: 8,
        knowledgeBaseName: '计算机系统',
        knowledgeBaseDescription: '计算机系统的描述',
        knowledgeIcon: 'src/images/计算机.png'
    },
    {
        knowledgeBaseId: 9,
        knowledgeBaseName: 'JavaScript',
        knowledgeBaseDescription: 'JavaScript的描述',
        knowledgeIcon: 'src/images/js.png'
    },
    {
        knowledgeBaseId: 10,
        knowledgeBaseName: '操作系统',
        knowledgeBaseDescription: '操作系统的描述',
        knowledgeIcon: 'src/images/操作系统.png'
    },
    {
        knowledgeBaseId: 11,
        knowledgeBaseName: '计算机网络',
        knowledgeBaseDescription: '计算机网络的描述',
        knowledgeIcon: 'src/images/网络计算机.png'
    },
    {
        knowledgeBaseId: 12,
        knowledgeBaseName: '数据结构与算法',
        knowledgeBaseDescription: '数据结构的描述',
        knowledgeIcon: 'src/images/数据结构.png'
    },
    {
        knowledgeBaseId: 13,
        knowledgeBaseName: 'Java',
        knowledgeBaseDescription: 'Java的描述',
        knowledgeIcon: 'src/images/java.png'
    },
    {
        knowledgeBaseId: 14,
        knowledgeBaseName: 'Python',
        knowledgeBaseDescription: 'Python的描述',
        knowledgeIcon: 'src/images/python.png'
    }
]


const App = (homeProps: HomeProps) => {

    const { chatInfos = [], userName = '', showNotification, getChatInfos } = homeProps;

    const baseState = useBaseStore();

    const [currentCid, setCurrentCid] = useState<number>(-1);

    const [currentKnowledgeBaseId, setCurrentKnowledgeBaseId] = useState<number>(1);

    const getChatInfoByCid = () => {
        // 根据conversationId获取chatInfo
        return chatInfos.find((chatInfo) => chatInfo.conversationId === currentCid) || defaultChatInfo;
    }

    const openNewConversation = () => {
        console.log('创建新对话');
        bus.emit('resetInput');
        defaultChatInfo.conversationInfo = []
        setCurrentCid(-1);
    }

    const openHistoryConversation = (conversationId: number) => {
        console.log('打开历史对话', conversationId);
        bus.emit('resetInput');
        defaultChatInfo.conversationInfo = []
        setCurrentCid(conversationId);
    }

    const createNewKnowledgeBase = () => {
        console.log('创建新知识库')
    }

    const clickKnowledgeBase = (knowledgeBaseId: number) => {
        console.log('使用知识库', knowledgeBaseId);
        setCurrentKnowledgeBaseId(knowledgeBaseId);
    }

    const fetchGetAnswer = async (question: string, canUseRAG: number = 0, conversationId?: number): Promise<ChatAnswer> => {
        try {
            const res = await getChat(question, baseState.userId, conversationId, canUseRAG);
            return res

        } catch (err) {
            showNotification("获取回答失败")
            throw err
        }

    }

    useEffect(() => {
        if (chatInfos && chatInfos.length > 0) {
            console.log(chatInfos)
        }
    }, [chatInfos])


    return (
        <div className="homeContainer">
            <div className="topBar">
                <div className="logo">
                    <img
                        src="src\images\ai.png"
                        className="topIcon"
                    />
                    <div className="topTitle">
                        计算机智能助教
                    </div>
                </div>
                <div className="functionalBar" >
                    <div className="feedBack">
                        <img src="src/images/意见反馈.png" alt="" />
                        意见反馈
                    </div>
                    <div className="split">|</div>
                    <img
                        src="src/images/太阳.png"
                        alt=""
                        className="functionalIcon"
                    />
                    <img
                        src="src/images/更多.png"
                        alt=""
                        className="functionalIcon"
                    />
                    <div className="userIcon functionalIcon">
                        {userName.slice(0, 1)}
                    </div>
                </div>
            </div>
            <div className="mainContent">
                <div className="siderBar">
                    <SiderBar
                        knowledgeBaseList={knowledgeBaseList}
                        currentKnowledgeBaseId={currentKnowledgeBaseId}
                        clickKnowledgeBase={clickKnowledgeBase}
                    />
                    <div
                        className="newKnowledgeBaseButton"
                        onClick={() => createNewKnowledgeBase()}
                    >
                        <img src="src/images/新建.png" />
                        <div
                            className="newKnowledgeText"
                        >
                            新增知识库
                        </div>
                    </div>
                </div>
                <div className="chatBox">
                    <div className="conversationListContainer">
                        <ConversationList
                            chatInfos={chatInfos}
                            currentCid={currentCid}
                            openHistoryConversation={openHistoryConversation}
                            openNewConversation={openNewConversation}
                        />
                    </div>
                    <div className="chatWindow">
                        <ChatWindow
                            chatInfo={getChatInfoByCid()}
                            fetchGetAnswer={fetchGetAnswer}
                            currentCid={currentCid}
                            getChatInfos={getChatInfos}
                            openHistoryConversation={openHistoryConversation}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
}

export default App;