import { PlusOutlined } from "@ant-design/icons"
import { ChatInfo } from "../../../../types/chat"
import './index.scss'

interface ConversationListProps {
    chatInfos: ChatInfo[]
    currentCid: number
    openHistoryConversation: (conversationId: number) => void
    openNewConversation: () => void
}

const ConversationList = (conversationListProps: ConversationListProps) => {
    const {
        chatInfos = [],
        currentCid = -1,
        openHistoryConversation,
        openNewConversation
    } = conversationListProps

    return (
        <div className="conversationList">
            <div className="conversation"
                onClick={() => openNewConversation()}
            >
                <PlusOutlined style={{ position: 'absolute', left: '1rem', top: '1rem' }} />
                新增对话
            </div>
            {
                chatInfos && chatInfos.map((chatInfo) => {
                    return (
                        <div
                            className="conversation"
                            style={{
                                backgroundColor: currentCid === chatInfo.conversationId ? '#5d65f8' : '#fff',
                                color: currentCid === chatInfo.conversationId ? '#fff' : '#000'
                            }
                            }
                            key={chatInfo.conversationId}
                            onClick={() => openHistoryConversation(chatInfo.conversationId)}>
                            {chatInfo.conversationMsg.substring(0, 8)}
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ConversationList