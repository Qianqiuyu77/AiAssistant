import { useState } from "react";
import Header from "../../component/header";
import Sider from "./components/sider";

import "./index.scss";
import { AdminSiderKeys } from "../../types/admin";

const App = () => {
    const [selectKey, setSelectKey] = useState<number>(AdminSiderKeys.DASHBOARD_DATA)

    const handleSiderBarClick = (selectKeyId: number) => {
        setSelectKey(selectKeyId)
    }

    return (
        <div className="adminPage">
            <Header
                userName="Admin"
            />
            <div className="mainContent">
                <Sider
                    handleSiderBarClick={handleSiderBarClick}
                />
                <div
                    className="adminPageContent"
                >
                    <div>
                        {selectKey}
                    </div>
                </div>
            </div>

        </div>
    );
}

export default App;