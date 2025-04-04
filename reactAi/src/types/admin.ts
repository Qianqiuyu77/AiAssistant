import { ChatInfo } from "./chat";

export enum AdminSiderKeys {
    // 看板数据
    DASHBOARD_DATA = 1,
    // 用户管理
    USER_MANAGEMENT = 2,
    // 对话信息
    CHAT_INFORMATION = 3,
    // 知识库管理
    KNOWLEDGE_BASE_MANAGEMENT = 4,
    // 日志管理
    LOG_MANAGEMENT = 5,
    // 反馈信息
    FEEDBACK_INFORMATION = 6,
    // 新增知识库
    ADD_KNOWLEDGE_BASE = 7,
}

export interface KnowledgeBaseType {
    knowledgeId: number;
    knowledgeName: string;
    knowledgeNameCN: string;
    useCount: number;
    avgScore: number;
    rank?: number;
}

export interface EcharsData {
    activeUserCount: number;
    totalUserCount: number;
    totalMessageCount: number;
    messageCount: number[];
    avgScore: number[];
    knowledgeBasesData: KnowledgeBaseType[];
    examCount: number[];
    totalExamCount: number;
    avgExamScore: number;
    highestExam: ExamUserInfo;
    lowestExam: ExamUserInfo;
}

export interface ExamUserInfo {
    userId: number;
    score: number;
    conversationId: number;
}

export interface UserData {
    userId: number;
    userName: string;
    createdAt: number;
    isAdmin: boolean;
    lastLoginTime: number;
    lastLoginIp: string;
}
export interface UserChatInfos {
    userId: number;
    userConversations: ChatInfo[];
}

export interface AdminKnowledgeBase {
    knowledgebaseId: number
    knowledgebaseName: string
    knowledgebaseNameSimple: string
    knowledgebaseInfo: string
    knowledgeIcon: string
    ownerId?: number
    createdAt?: number
}

export interface ChunksData {
    file: File;
    chunkSize: number;
    chunkOverlap: number;
    humanSplit: boolean;
}

export interface AddKnowledgeData extends ChunksData {
    knowledgebaseName: string;
    knowledgebaseIntroduce: string;
    knowledgebaseNameCN: string;
    knowledgebaseIcon: string;
}