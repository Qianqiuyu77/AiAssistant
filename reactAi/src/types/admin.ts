export enum AdminSiderKeys {
    // 看板数据
    DASHBOARD_DATA = 1,
    // 用户管理
    USER_MANAGEMENT = 2,
    // 日志管理
    LOG_MANAGEMENT = 3,
    // 对话信息
    CHAT_INFORMATION = 4,
    // 知识库管理
    KNOWLEDGE_BASE_MANAGEMENT = 5,
    // 反馈信息
    FEEDBACK_INFORMATION = 6,
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
}