
import { KnowledgeBase } from '../../../../types/chat'
import './index.scss'

interface SiderBarProps {
    knowledgeBaseList: KnowledgeBase[]
    currentKnowledgeBaseId: number
    clickKnowledgeBase: (knowledgeBaseId: number) => void
}

const dopamineColors = ["#FF6B6B", "#FFD93D", "#FF8E72", "#6BCB77", "#4D96FF", "#8358FF", "#FF5DA2"];

const SiderBar = (siderBarProps: SiderBarProps) => {
    const {
        knowledgeBaseList = [],
        currentKnowledgeBaseId = 0,
        clickKnowledgeBase
    } = siderBarProps

    return (
        <div className='siderBarList'>
            {
                knowledgeBaseList && knowledgeBaseList.map((item) => {
                    return (

                        <div
                            key={item.knowledgebaseId}
                            className='siderBarListItem'
                            style={{
                                backgroundColor: item.knowledgebaseId === currentKnowledgeBaseId ? '#fff' : ''
                            }}
                        >
                            <div
                                className={`siderBarListItemIcon ${item.knowledgebaseId === currentKnowledgeBaseId ? 'iconActive' : 'iconHover'}`}
                                onClick={() => clickKnowledgeBase(item.knowledgebaseId)}
                                style={{ backgroundColor: dopamineColors[item.knowledgebaseId % dopamineColors.length] }}
                            >
                                <div className="iconBgc">
                                    <img
                                        src={item.knowledgeIcon}
                                        title={item.knowledgebaseInfo}
                                        alt={item.knowledgebaseName}
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