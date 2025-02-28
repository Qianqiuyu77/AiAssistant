import { useState } from "react";
import Header from "../../component/header";
import Sider from "./components/sider";

import "./index.scss";
import { AdminSiderKeys, EcharsData } from "../../types/admin";
import Dashboard from "./components/dashBoard";

interface AdminProps {
    echarsData: EcharsData;
    userName: string;
}

const App = (props: AdminProps) => {
    const { echarsData, userName } = props;
    const [selectKey, setSelectKey] = useState<number>(AdminSiderKeys.DASHBOARD_DATA)

    const handleSiderBarClick = (selectKeyId: number) => {
        setSelectKey(selectKeyId)
    }

    const renderContent = () => {
        switch (selectKey) {
            case AdminSiderKeys.DASHBOARD_DATA:
                return <Dashboard echarsData={echarsData} />;
            case AdminSiderKeys.USER_MANAGEMENT:
                return <div>User Manage</div>;
            case AdminSiderKeys.LOG_MANAGEMENT:
                return <div>Log</div>;
            case AdminSiderKeys.CHAT_INFORMATION:
                return <div>Chat</div>;
            case AdminSiderKeys.KNOWLEDGE_BASE_MANAGEMENT:
                return <div>Knowledge Base</div>;
            case AdminSiderKeys.FEEDBACK_INFORMATION:
                return <div>Feedback</div>;
            default:
                return <div>Not Found</div>;
        }
    };

    return (
        <div className="adminPage">
            <Header userName={userName} />
            <div className="mainContent">
                <Sider handleSiderBarClick={handleSiderBarClick} />
                <div className="adminPageContent" >
                    {renderContent()}
                </div>
            </div>

        </div>
    );
}

export default App;