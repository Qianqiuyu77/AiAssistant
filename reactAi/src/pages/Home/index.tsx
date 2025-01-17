import { useEffect, useState } from "react";
import { ChatAnswer, ChatInfo, defaultChatInfo } from "../../types/chat";
import "./index.scss"
import ConversationList from "./compents/conversationList/index";
import ChatWindow from "./compents/chatWindow";
import useBaseStore from "../../../zustand/baseStore";
import { getChat } from "../../api";
import { bus } from "../../bus";

interface HomeProps {
    chatInfos: ChatInfo[];
    showNotification: (message: string) => void;
    getChatInfos: () => void;
}


const App = (homeProps: HomeProps) => {

    const { chatInfos = [], showNotification, getChatInfos } = homeProps;

    const baseState = useBaseStore();

    const [currentCid, setCurrentCid] = useState<number>(-1);

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
                <div className="topIcon">

                </div>
            </div>
            <div className="mainContent">
                <div className="siderBar"></div>
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