
import { KnowledgeBase } from '../../../../types/chat'
import './index.scss'

interface SiderBarProps {
    knowledgeBaseList: KnowledgeBase[]
    currentKnowledgeBaseId: number
    clickKnowledgeBase: (knowledgeBaseId: number) => void
}

const SiderBar = (siderBarProps: SiderBarProps) => {
    const {
        knowledgeBaseList,
        currentKnowledgeBaseId,
        clickKnowledgeBase
    } = siderBarProps

    return (
        <div className='siderBarList'>
            {
                knowledgeBaseList.map((item) => {
                    return (
                        <div
                            key={item.knowledgeBaseId}
                            className='siderBarListItem'
                            style={{
                                backgroundColor: item.knowledgeBaseId === currentKnowledgeBaseId ? '#fff' : ''
                            }}
                        >
                            <div
                                className='siderBarListItemIcon'
                                onClick={() => clickKnowledgeBase(item.knowledgeBaseId)}
                            >
                                <div className='iconBgc'>
                                    <img
                                        src={item.knowledgeIcon}
                                        title={item.knowledgeBaseDescription}
                                        alt={item.knowledgeBaseName}
                                    />
                                </div>

                            </div>
                        </div>
                    )
                })
            }
        </div>

    )
}

export default SiderBar