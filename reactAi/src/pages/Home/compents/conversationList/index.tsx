import { PlusOutlined } from "@ant-design/icons"
import { ChatInfo } from "../../../../types/chat"
import './index.scss'
import { Dropdown, MenuProps } from "antd"

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


    const items: MenuProps['items'] = [
        {
            label: (
                <div className="menu-item">
                    <img src="src/images/分享.png" alt="" />
                    共享
                </div>
            ),
            key: '0',
        },
        {
            label: (
                <div className="menu-item">
                    <img src="src/images/重命名.png" alt="" />
                    重命名
                </div>
            ),
            key: '1',
        },
        {
            label: (
                <div
                    className="menu-item"
                    style={{
                        color: '#f93a37'
                    }}
                >
                    <img src="src/images/删除.png" alt="" />
                    删除
                </div>
            ),
            key: '3',
        },
    ];

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
                            {

                                currentCid === chatInfo.conversationId
                                && <Dropdown menu={{ items }} trigger={['click']}>
                                    <img src="src/images/白省略.png" />
                                </Dropdown>


                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ConversationList