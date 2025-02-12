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
