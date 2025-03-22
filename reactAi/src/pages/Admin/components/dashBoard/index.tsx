import Card from 'antd/es/card';
import './index.scss'
import Tooltip from 'antd/es/tooltip';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Column, Pie } from '@ant-design/charts';

import { Table } from 'antd';
import { EcharsData, KnowledgeBaseType } from '../../../../types/admin';
import { useEffect, useState } from 'react';
import { useMakeEcharsData } from './hooks';

interface DashBoardProps {
    echarsData: EcharsData
}


const Dashboard = (props: DashBoardProps) => {

    const { echarsData } = props;

    const [loading, setLoading] = useState<boolean>(true);

    const {
        maxScore,
        minScore,
        avgScoreValue,
        avgConfig,
        chatNumberConfig,
        knowledgeCountConfig,
        sortedData,
        columns
    } = useMakeEcharsData({ echarsData });

    useEffect(() => {
        if (echarsData.totalUserCount === 0) {
            setLoading(true)
        } else {
            setLoading(false)
        }
    }, [echarsData])

    return (
        <div className="container">
            <div className="item item1 personNumber">
                <Card
                    loading={loading}
                    title="活跃用户数量"
                    style={{ height: '100%' }}
                    extra={
                        <Tooltip title="30天内登陆过的用户">
                            <InfoCircleOutlined />
                        </Tooltip>
                    }>
                    <span className='dataNumber'>{echarsData.activeUserCount}</span>人
                </Card>
            </div>
            <div className="item item1">
                <Card
                    loading={loading}
                    title="总对话次数"
                    style={{ height: '100%' }}
                    extra={
                        <Tooltip title="系统内所有对话次数">
                            <InfoCircleOutlined />
                        </Tooltip>
                    }
                >
                    <span className='dataNumber'>{echarsData.totalMessageCount}</span>次
                </Card>
            </div>
            <div className="item item1">
                <Card
                    loading={loading}
                    title="三十天对话平均分数"
                    style={{ height: '100%' }}
                    extra={
                        <Tooltip title="三十天内所有使用知识库的评分平均数">
                            <InfoCircleOutlined />
                        </Tooltip>
                    }>
                    <span className='dataNumber'>{avgScoreValue.toFixed(2)}</span>分
                    <div className='scoreInfo'>
                        <div>最高评分:{maxScore}分</div>
                        <div>最低评分:{minScore}分</div>
                    </div>
                </Card>
            </div>
            <div className="item item1">
                <Card
                    loading={loading}
                    title="用户总量"
                    style={{ height: '100%' }}
                    extra={
                        <Tooltip title="系统内所有用户数量">
                            <InfoCircleOutlined />
                        </Tooltip>
                    }
                >
                    <span className='dataNumber'>{echarsData.totalUserCount}</span>人
                </Card>
            </div>

            <div className="item item4">
                <Card
                    loading={loading}
                    title="三十天对话得分"
                    style={{ height: '100%' }}
                    extra={
                        <Tooltip title="三十天内每天的评分">
                            <InfoCircleOutlined />
                        </Tooltip>
                    }
                >
                    <Column {...avgConfig} />
                </Card>

            </div>

            <div className="item item2">
                <Card
                    loading={loading}
                    title="知识库使用得分"
                    style={{ height: '100%' }}
                    extra={
                        <Tooltip title="知识库使用得分排名">
                            <InfoCircleOutlined />
                        </Tooltip>
                    }
                >
                    <div className='knowledgeTable'>
                        <Table<KnowledgeBaseType>
                            columns={columns}
                            dataSource={sortedData}
                            size='small'
                            rowKey="knowledgeId"
                            pagination={{
                                pageSize: 4,
                                hideOnSinglePage: true,

                            }}
                        />
                    </div>

                </Card>
            </div>
            <div className="item item2">
                <Card
                    loading={loading}
                    title="知识库使用占比"
                    style={{ height: '100%' }}
                    extra={
                        <Tooltip title="系统知识库使用占比">
                            <InfoCircleOutlined />
                        </Tooltip>
                    }
                >
                    <div className='knowledgePie'>
                        <Pie className={'pie'} {...knowledgeCountConfig} />
                    </div>


                </Card>
            </div>

            <div className="item item4">
                <Card
                    loading={loading}
                    title="三十天问答次数"
                    style={{ height: '100%' }}
                    extra={
                        <Tooltip title="三十天系统问答次数">
                            <InfoCircleOutlined />
                        </Tooltip>
                    }
                >
                    <Column {...chatNumberConfig} />
                </Card>

            </div>



        </div>
    );
}

export default Dashboard