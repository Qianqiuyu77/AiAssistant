import { useEffect } from "react";
import { getAllChatInfos, getEcharsData, getusers, resetPassword } from "../../api";
import App from "./index";

const Admin = () => {
    const fetchGetusers = async () => {
        const res = await getusers(1);
        console.log(res);
    }

    const fetchResetPassword = async () => {
        const res = await resetPassword(1120)
        console.log(res);
    }

    const fetchGetAllChatInfos = async () => {
        const res = await getAllChatInfos(1);
        console.log(res);
    }

    const fetchGetEcharsData = async () => {
        const res = await getEcharsData(1);
        console.log(res);
    }

    useEffect(() => {
        fetchGetusers()
        fetchResetPassword()
        fetchGetAllChatInfos()
        fetchGetEcharsData()
    }, [])

    return (
        <>
            <App />
        </>
    );
}

export default Admin;