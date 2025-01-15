export interface ChatInfo {
    conversationId: number
    conversationInfo: ConversationInfo

}

export interface ConversationInfo {
    content: string
    createdAt: number
    knowledge: string
    messageId : number
    question: string
}