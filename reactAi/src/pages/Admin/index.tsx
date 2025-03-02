import { useEffect, useState } from "react";
import Header from "../../component/header";
import Sider from "./components/sider";

import "./index.scss";
import { AdminKnowledgeBase, AdminSiderKeys, EcharsData, UserData } from "../../types/admin";
import Dashboard from "./components/dashBoard";
import { MessageType } from "../../types/chat";
import UserManger from "./components/userManger";
import LogManger from "./components/logManger";
import ChatInfos from "./components/chatInfos";
import KnowledgeManger from "./components/knowledgeManger";
import FeedBack from "./components/feedBack";

interface AdminProps {
    echarsData: EcharsData;
    userName: string;
    userDatas: UserData[];
    messageInfos: MessageType[];
    knowledgeBases: AdminKnowledgeBase[];
    fetchGetAllMessages: () => void;
    fetchGetEcharsData: () => void;
    fetchGetUserData: () => void;
    fetchGetKnowledgeBases: () => void;
}

const App = (props: AdminProps) => {
    const {
        echarsData,
        userName,
        userDatas,
        knowledgeBases,
        messageInfos,
        fetchGetAllMessages,
        fetchGetKnowledgeBases,
        fetchGetEcharsData,
        fetchGetUserData
    } = props;
    const [selectKey, setSelectKey] = useState<number>(AdminSiderKeys.DASHBOARD_DATA)

    const handleSiderBarClick = (selectKeyId: number) => {
        setSelectKey(selectKeyId)
    }

    const renderContent = () => {
        switch (selectKey) {
            case AdminSiderKeys.DASHBOARD_DATA:
                return <Dashboard echarsData={echarsData} />;
            case AdminSiderKeys.USER_MANAGEMENT:
                return <UserManger userDatas={userDatas || []} />;
            case AdminSiderKeys.LOG_MANAGEMENT:
                return <LogManger />;
            case AdminSiderKeys.CHAT_INFORMATION:
                return <ChatInfos messageInfos={messageInfos} />;
            case AdminSiderKeys.KNOWLEDGE_BASE_MANAGEMENT:
                return <KnowledgeManger knowledgeBases={knowledgeBases} />;
            case AdminSiderKeys.FEEDBACK_INFORMATION:
                return <FeedBack />;
            default:
                return <div>404 Not Found</div>;
        }
    };

    useEffect(() => {
        switch (selectKey) {
            case AdminSiderKeys.DASHBOARD_DATA:
                fetchGetEcharsData();
                break;
            case AdminSiderKeys.USER_MANAGEMENT:
                fetchGetUserData();
                break;
            case AdminSiderKeys.CHAT_INFORMATION:
                fetchGetAllMessages();
                break;
            case AdminSiderKeys.KNOWLEDGE_BASE_MANAGEMENT:
                fetchGetKnowledgeBases();
                break;
        }
    }, [selectKey])

    return (
        <div className="adminPage">
            <Header userName={userName} />
            <div className="mainContent">
                <Sider handleSiderBarClick={handleSiderBarClick} />
                <div className="adminPageContent" >
                    {renderContent()}
                    {/* <div className="adminPageContentFooter">
                        designed by <a href="https://github.com/Qianqiuyu77" target="_blank">qianqiuyu77</a>
                    </div> */}
                </div>
            </div>

        </div>
    );
}

export default App;