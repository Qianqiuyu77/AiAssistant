import Card from 'antd/es/card';
import './index.scss'
import Tooltip from 'antd/es/tooltip';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/charts';


const data = {
    activeUserCount: 1,
    totalUserCount: 11,
    totalMessageCount: 191,
    messageCount: [0, 0, 0, 0, 0, 0, 3],
    avgScore: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.7316798533333334]
};


const Dashboard = () => {

    // const activeUserPercentage = (data.activeUserCount / data.totalUserCount) * 100;

    // 一周总消息数
    // const weekTotalMessages = data.messageCount.reduce((acc, count) => acc + count, 0);

    // 最大评分
    const maxScore = Math.max(...data.avgScore).toFixed(2);

    // 最小评分
    const minScore = Math.min(...data.avgScore).toFixed(2);

    // 平均评分
    const totalScore = data.avgScore.reduce((acc, score) => acc + score, 0);
    const avgScoreValue = totalScore / data.avgScore.length;

    const avgData = data.avgScore.map((score, index) => ({
        index: `第 ${index + 1} 天`, // X 轴标签
        score: score, // Y 轴值
    }));

    const chatNumberData = data.messageCount.map((count, index) => ({
        index: `第 ${index + 1} 天`, // X 轴标签
        count: count, // Y 轴值
    }))

    const avgConfig = {
        data: avgData,
        xField: "index",  // X 轴
        yField: "score",  // Y 轴
        label: {
            position: "middle",
            style: { fill: "#FFFFFF" },
        },
        height: 300,
        maxColumnWidth: 40,
        color: "#5d65f8", // 统一颜色
        xAxis: { label: { autoHide: true, autoRotate: false } },
        yAxis: { min: 0, max: 1 }, // 评分一般 0~1 之间
    };

    const chatNumberConfig = {
        data: chatNumberData,
        xField: "index",  // X 轴
        yField: "count",  // Y 轴
        label: {
            position: "middle",
            style: { fill: "#FFFFFF" },
        },
        height: 300,
        maxColumnWidth: 40,
        color: ['#5d65f8'], // 统一颜色
        xAxis: { label: { autoHide: true, autoRotate: false } },
        yAxis: { min: 0, max: 100 },
    }


    return (
        <div className="container">
            <div className="item item1 personNumber">
                <Card
                    title="活跃用户数量"
                    style={{ height: '100%' }}
                    extra={
                        <Tooltip title="指标说明">
                            <InfoCircleOutlined />
                        </Tooltip>
                    }>
                    <span className='dataNumber'>{data.activeUserCount}</span>人
                </Card>
            </div>
            <div className="item item1">
                <Card
                    title="总对话次数"
                    style={{ height: '100%' }}
                    extra={
                        <Tooltip title="指标说明">
                            <InfoCircleOutlined />
                        </Tooltip>
                    }
                >
                    <span className='dataNumber'>{data.totalMessageCount}</span>次
                </Card>
            </div>
            <div className="item item1">
                <Card
                    title="一周对话平均分数"
                    style={{ height: '100%' }}
                    extra={
                        <Tooltip title="指标说明">
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
                    title="用户总量"
                    style={{ height: '100%' }}
                    extra={
                        <Tooltip title="指标说明">
                            <InfoCircleOutlined />
                        </Tooltip>
                    }
                >
                    <span className='dataNumber'>{data.totalUserCount}</span>人
                </Card>
            </div>

            <div className="item item4">
                <Card
                    title="一周对话得分"
                    style={{ height: '100%' }}
                    extra={
                        <Tooltip title="指标说明">
                            <InfoCircleOutlined />
                        </Tooltip>
                    }
                >
                    <Column {...avgConfig} />
                </Card>

            </div>

            <div className="item item2">
                <Card
                    title="数据库使用排行"
                    style={{ height: '100%' }}
                    extra={
                        <Tooltip title="指标说明">
                            <InfoCircleOutlined />
                        </Tooltip>
                    }
                >

                </Card>
            </div>
            <div className="item item2">
                <Card
                    title="活跃度"
                    style={{ height: '100%' }}
                    extra={
                        <Tooltip title="指标说明">
                            <InfoCircleOutlined />
                        </Tooltip>
                    }
                >

                </Card>
            </div>

            <div className="item item4">
                <Card
                    title="一周问答次数"
                    style={{ height: '100%' }}
                    extra={
                        <Tooltip title="指标说明">
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