import axios from 'axios';
import { ChatInfo } from './types/chat';

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

export async function getAllChat(userId: number): Promise<ChatInfo[]> {
    try {
        const res = await axios.get(`${host}/getAllChat`, {
            params: {
                userId,
            },
        });
        return res.data.chatInfo;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch chat info");
    }
}

export async function getChat(question: string, userId: number, conversationId?: number, canUseRAG: number = 0) {
    try {
        const res = await axios.post(`${host}/chat`, (
            {
                question,
                userId,
                conversationId,
                canUseRAG
            }
        ));
        return res.data;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch chat info");
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
        return res.data;
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
        return res.data;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch delete conversation");
    }
}
