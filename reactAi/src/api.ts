import axios from 'axios';
import { IResponse } from './types/utils';
import { AddKnowledgeData, AdminKnowledgeBase, ChunksData, EcharsData, UserChatInfos, UserData } from './types/admin';
import { ChatAnswer, ChatParams, MessageType } from './types/chat';
import { Paper } from './types/exam';
import { FeedbackInfo } from './types/feedback';

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

export async function getAllChat(token: string) {
    try {
        const res = await axios.get(`${host}/getAllChat`, {

            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch chat info");
    }
}

export async function getChat(chatParams: ChatParams, token: string): Promise<IResponse<ChatAnswer>> {
    try {
        const res = await axios.post(`${host}/chat`,
            chatParams,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

        );

        return res.data;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch chat info" + err);
    }
}

export async function getAllKnowledgeBase(token: string) {
    try {
        const res = await axios.get(`${host}/getAllKnowledgeBase`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return res.data;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch knowledge base");
    }

}

export async function renameConversation(conversationId: number, conversationName: string, token: string) {
    try {
        const res = await axios.get(`${host}/renameConversation`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
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

export async function deleteConversation(conversationId: number, token: string) {
    try {
        const res = await axios.get(`${host}/deleteConversation`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
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
export async function getusers(token: string): Promise<IResponse<UserData[]>> {
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

export async function resetPassword(token: string, userId: number): Promise<IResponse> {
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

export async function getAllChatInfos(token: string): Promise<IResponse<UserChatInfos[]>> {
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

export async function getAllMessages(token: string): Promise<IResponse<MessageType[]>> {
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

export async function getEcharsData(token: string): Promise<IResponse<EcharsData>> {
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

export async function getFeedbackData(token: string): Promise<IResponse<FeedbackInfo[]>> {
    try {
        const res = await axios.get(`${host}/admin/getFeedbackData`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return res.data;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch feedback data");
    }
}


// 1. 删除知识库
export async function deleteKnowledgeBase(token: string, knowledgeBaseId: number): Promise<IResponse<null>> {
    try {
        const res = await axios.get(`${host}/admin/deleteKnowledgeBase`, {
            params: { knowledgeBaseId },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return res.data;
    } catch (err) {
        console.error(err);
        throw new Error("Failed to delete knowledge base");
    }
}

// 2. 更新知识库
export async function updateKnowledgeBase(
    token: string,
    knowledgeBase: AdminKnowledgeBase
): Promise<IResponse<boolean>> {
    try {
        const res = await axios.post(`${host}/admin/updateKnowledgeBase`,
            {
                knowledgeBaseId: Number(knowledgeBase.knowledgebaseId),
                knowledgeName: knowledgeBase.knowledgebaseNameSimple,
                knowledgeIntroduce: knowledgeBase.knowledgebaseInfo,
                knowledgeNameCN: knowledgeBase.knowledgebaseName,
            }, {

            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        return res.data;
    } catch (err) {
        console.error(err);
        throw new Error("Failed to update knowledge base");
    }
}

// 3. 新建知识库
export async function createKnowledgeBase(
    token: string,
    formData: AddKnowledgeData
): Promise<IResponse<{ knowledgeName: string; knowledgeId: string }>> {
    try {
        const res = await axios.post(`${host}/admin/newKnowledgeBase`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        });

        return res.data;
    } catch (err) {
        console.error(err);
        throw new Error("Failed to create knowledge base");
    }
}

// 4. 预览文件分块
export async function previewChunks(token: string, chunksData: ChunksData): Promise<IResponse<{ chunksPreview: string[] }>> {
    try {
        const res = await axios.post(`${host}/admin/previewChunks`, chunksData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        });

        return res.data;
    } catch (err) {
        console.error(err);
        throw new Error("Failed to preview chunks");
    }
}

export async function uploadImage(token: string, formData: FormData): Promise<IResponse<string>> {
    try {
        const res = await axios.post(`${host}/uploadImage`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        });

        return res.data;
    } catch (err) {
        console.error(err);
        throw new Error("Failed to uploadImage");
    }
}

// 试卷
export async function getPaper(token: string, conversationId: number, options?: { signal?: AbortSignal }): Promise<IResponse<Paper>> {
    try {
        const res = await axios.get(`${host}/getPaper`, {
            params: { conversationId },
            headers: {
                Authorization: `Bearer ${token}`
            },
            signal: options?.signal, // 传入 AbortSignal
        });
        return res.data;
    } catch (err) {
        if (axios.isCancel(err)) {
            throw err;
        }
        console.error(err);
        throw err;
    }
}

export async function comitPaper(token: string, conversationId: number, score: number = 0): Promise<IResponse<boolean>> {
    try {
        const res = await axios.post(`${host}/comitPaper`, {
            conversationId,
            score
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });

        return res.data;
    } catch (err) {
        console.error(err);
        throw new Error("Failed to preview chunks");
    }
}

export async function giveLike(token: string, messageId: number, isFavourite: number): Promise<IResponse<boolean>> {
    try {
        const res = await axios.get(`${host}/giveLike`, {
            params: { messageId, isFavourite },
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }

}

export async function commitFeedback(token: string, feedInfo: FeedbackInfo): Promise<IResponse<boolean>> {
    try {
        const res = await axios.post(`${host}/commitFeedback`,
            feedInfo,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }
        );
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}