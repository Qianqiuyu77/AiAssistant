import axios from 'axios';
import { IResPonse } from './types/utils';
import { EcharsData, UserChatInfos, UserData } from './types/admin';
import { MessageType } from './types/chat';

const host = 'http://localhost:5000'

export async function login(userName: string, passWord: string) {
    try {
        const res = await axios.get(`${host}/login`, {
            params: {
                userName,
                passWord,
            },
        });
        return res.data;
    } catch (err) {
        return err;
    }
}

export async function register(userName: string, passWord: string) {
    try {
        const res = await axios.get(`${host}/register`, {
            params: {
                userName,
                passWord,
            },
        });

        return res.data;
    } catch (err) {
        return err;
    }
}

export async function getAllChat(userId: number) {
    try {
        const res = await axios.get(`${host}/getAllChat`, {
            params: {
                userId,
            },
        });
        return res.data;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch chat info");
    }
}

export async function getChat(question: string, userId: number, conversationId?: number, knowledgeBaseId: number = 0, canUseRAG: number = 0) {
    try {
        const res = await axios.post(`${host}/chat`, (
            {
                question,
                userId,
                conversationId,
                canUseRAG,
                knowledgeBaseId,
            }
        ));

        return res.data;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch chat info" + err);
    }
}

export async function getAllKnowledgeBase(userId: number) {
    try {
        const res = await axios.get(`${host}/getAllKnowledgeBase`, {
            params: {
                userId,
            },
        });

        return res.data;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch knowledge base");
    }

}

export async function renameConversation(conversationId: number, conversationName: string) {
    try {
        const res = await axios.get(`${host}/renameConversation`, {
            params: {
                conversationId,
                conversationName
            }
        });
        console.log("renameres", res.data);

        return res.data.data;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch reName conversation");
    }

}

export async function deleteConversation(conversationId: number) {
    try {
        const res = await axios.get(`${host}/deleteConversation`, {
            params: {
                conversationId,
            }
        });
        console.log("deleteres", res.data);
        return res.data.data;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch delete conversation");
    }
}

// 管理员接口
export async function getusers(token: string): Promise<IResPonse<UserData[]>> {
    try {
        const res = await axios.get(`${host}/admin/getusers`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch users");
    }
}

export async function resetPassword(token: string, userId: number): Promise<IResPonse> {
    try {
        const res = await axios.post(`${host}/admin/resetPassword`,
            {
                userId,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        return res.data;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch resetPassword");
    }
}

export async function getAllChatInfos(token: string): Promise<IResPonse<UserChatInfos[]>> {
    try {
        const res = await axios.get(`${host}/admin/getAllChatInfos`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return res.data;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch chat infos");
    }

}

export async function getAllMessages(token: string): Promise<IResPonse<MessageType[]>> {
    try {
        const res = await axios.get(`${host}/admin/getAllMessages`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return res.data;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch messages infos");
    }
}

export async function getEcharsData(token: string): Promise<IResPonse<EcharsData>> {
    try {
        const res = await axios.get(`${host}/admin/getEcharsData`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return res.data;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch echars data");
    }
}