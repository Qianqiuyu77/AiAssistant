import axios from 'axios';

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

export async function getAllChat(userId: string) {
    try {
        const res = await axios.get(`${host}/getAllChat`, {
            params: {
                userId,
            },
        });
        return res.data;
    } catch (err) {
        return err;
    }
}

export async function getChat(question: string, userId: string, conversationId?: number) {
    try {
        const res = await axios.post(`${host}/chat`, (
            {
                question,
                userId,
                conversationId,
            }
        ));
        return res.data;
    } catch (err) {
        return err;
    }
}
