import { useEffect, useState } from "react";
import { ChatInfo, defaultChatInfo, KnowledgeBase } from "../../types/chat";
import "./index.scss"
import ConversationList from "./compents/conversationList/index";
import ChatWindow from "./compents/chatWindow";
import { deleteConversation, renameConversation } from "../../api";
import { bus } from "../../bus";
import SiderBar from "./compents/siderBar";
import Header from "../../component/header";
import Exam from "./compents/exam";
import ShadowBox from "../../component/shadowBox";
import useBaseStore from "../../../zustand/baseStore";

interface HomeProps {
    chatInfos: ChatInfo[];
    knowledgeBases: KnowledgeBase[];
    userName: string;
    showNotification: (message: string, isSuccess: boolean) => void;
    getChatInfos: () => void;
}


const App = (homeProps: HomeProps) => {

    const { chatInfos = [], knowledgeBases = [], userName = '', showNotification, getChatInfos } = homeProps;

    const baseState = useBaseStore()

    const [currentCid, setCurrentCid] = useState<number>(-1);

    const [currentKnowledgeBaseId, setCurrentKnowledgeBaseId] = useState<number>(0);

    const [isExamOpen, setIsExamOpen] = useState<boolean>(false);

    const getChatInfoByCid = () => {
        // 根据conversationId获取chatInfo
        return chatInfos.find((chatInfo) => chatInfo.conversationId === currentCid) || defaultChatInfo;
    }

    const exitExam = () => {
        setIsExamOpen(false);
    }

    const openNewConversation = () => {
        bus.emit('resetInput');
        defaultChatInfo.conversationInfo = []
        setCurrentCid(-1);
    }

    const openHistoryConversation = (conversationId: number) => {
        bus.emit('resetInput');
        defaultChatInfo.conversationInfo = []
        setCurrentCid(conversationId);
    }

    const openExam = () => {
        if (currentCid === -1) {
            showNotification('请先创建对话或者打开历史对话', false);
            return;
        }
        setIsExamOpen(true);
    }

    const clickKnowledgeBase = (knowledgeBaseId: number) => {
        if (knowledgeBaseId === currentKnowledgeBaseId) return;
        setCurrentKnowledgeBaseId(knowledgeBaseId);
        showNotification('已成功切换至' + knowledgeBases.find((kb) => kb.knowledgebaseId === knowledgeBaseId)?.knowledgebaseName + "知识库", true);
    }


    const fetchRenameConversation = async (conversationId: number, conversationName: string) => {
        try {
            const res = await renameConversation(conversationId, conversationName, baseState.token);
            showNotification("重命名对话成功", true)
            return res

        } catch (err) {
            showNotification("重命名对话失败", false)
            throw err
        }
    }

    const fetchDeleteConversation = async (conversationId: number) => {
        try {
            const res = await deleteConversation(conversationId, baseState.token);
            showNotification("删除对话成功", true)
            return res

        } catch (err) {
            showNotification("删除对话失败", false)
            throw err
        }
    }



    const clickRenameConversation = (conversationId: number, conversationName: string) => {
        fetchRenameConversation(conversationId, conversationName).then(() => {
            getChatInfos();
        })
    }

    const clickDeleteConversation = (conversationId: number) => {
        fetchDeleteConversation(conversationId).then(() => {
            getChatInfos();
            setCurrentCid(-1);
        })
    }

    useEffect(() => {
        if (knowledgeBases && knowledgeBases.length > 0) {
            setCurrentKnowledgeBaseId(knowledgeBases[0]?.knowledgebaseId || 0)
        }
    }, [knowledgeBases])


    return (
        <>
            <div className="homeContainer">
                <Header
                    userName={userName}
                />
                <div className="mainContent">
                    <div className="siderBar">
                        <SiderBar
                            knowledgeBaseList={knowledgeBases}
                            currentKnowledgeBaseId={currentKnowledgeBaseId}
                            clickKnowledgeBase={clickKnowledgeBase}
                        />
                        <div
                            className="newKnowledgeBaseButton"
                            onClick={() => openExam()}
                        >
                            <img src="src/images/新建.png" />
                            <div
                                className="newKnowledgeText"
                            >
                                生成试卷
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
                                renameConversation={clickRenameConversation}
                                deleteConversation={clickDeleteConversation}
                            />
                        </div>
                        <div className="chatWindow">
                            <ChatWindow
                                chatInfo={getChatInfoByCid()}
                                currentCid={currentCid}
                                getChatInfos={getChatInfos}
                                openHistoryConversation={openHistoryConversation}
                                currentKnowledgeBaseId={currentKnowledgeBaseId}
                            />
                        </div>
                    </div>
                </div>

            </div>
            {
                isExamOpen &&
                <ShadowBox>
                    <Exam
                        conversationId={currentCid}
                        setExamclose={exitExam}
                    ></Exam>
                </ShadowBox>

            }
            {

            }


        </>

    );
}

export default App;