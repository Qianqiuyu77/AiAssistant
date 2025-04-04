export interface ChatInfo {
    conversationId: number
    conversationInfo: ConversationInfo[]
    conversationMsg: string

}

export interface ConversationInfo {
    content: string
    createdAt?: number
    knowledge: string
    messageId: number
    question: string
    favourite: number
}

export interface ChatAnswer {
    answer: string
    conversationId: number
    knowledge: string
    messageId: number
}

export enum ChatState {
    FREE = 0,
    BUSY = 1
}

export const defaultChatInfo: ChatInfo = {
    conversationId: 0,
    conversationInfo: [],
    conversationMsg: ''
}

export interface KnowledgeBase {
    knowledgebaseId: number
    knowledgebaseName: string
    knowledgebaseInfo: string
    knowledgeIcon: string
    createdAt?: number
}

export interface MessageType extends ConversationInfo {
    userId: number
    conversationId: number
    knowledgeId: number
}

export interface ChatParams {
    question: string
    userId: number
    conversationId?: number
    knowledgeBaseId: number
    canUseRAG: number
}