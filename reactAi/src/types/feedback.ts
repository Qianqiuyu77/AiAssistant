export interface FeedbackInfo {
    feedbackId: number
    userId: number
    feedType: FeedType
    score: number
    feedInfo: string
    userInfo: string
    messageId: number
    createdAt: number
}

export enum FeedType {
    INFO = 'suggestion',
    BUG = 'bug',
    PRISE = 'praise',
    OTHER = 'other',
}