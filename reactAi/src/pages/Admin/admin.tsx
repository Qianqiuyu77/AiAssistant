import { useEffect, useState } from "react";
import { getEcharsData } from "../../api";
import App from "./index";
import { message } from "antd";
import { EcharsData } from "../../types/admin";

const Admin = () => {

    const [echarsData, setEcharsData] = useState<EcharsData>({
        activeUserCount: 0,
        totalUserCount: 0,
        totalMessageCount: 0,
        messageCount: [],
        avgScore: [],
        knowledgeBasesData: []
    });

    async function fetchGetEcharsData() {
        try {
            const res = await getEcharsData(1);
            console.log(res);
            if (res.data) {
                setEcharsData(res.data);
            } else {
                message.error({
                    content: res.msg || "操作失败，请重试",
                    key: "loading",
                    duration: 2,
                })
            }

            return res.data;
        } catch (err) {
            console.log(err);

            message.error({
                content: "操作失败，请重试",
                key: "loading",
                duration: 2,
            });
        }
    }



    // 使用副作用处理登录逻辑
    useEffect(() => {
        fetchGetEcharsData();
    }, []);



    return (
        <>
            <App
                echarsData={echarsData}
            />
        </>
    );
}

export default Admin;