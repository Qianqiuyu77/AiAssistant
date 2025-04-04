import { TableProps } from "antd";
import { EcharsData, KnowledgeBaseType } from "../../../../types/admin";

export interface IChartData {
    echarsData: EcharsData;
}

export const useMakeEcharsData = (ichartData: IChartData) => {
    const { echarsData } = ichartData;
    const nonZeroScores = echarsData.avgScore.filter(score => score > 0); // 过滤掉 0 分

    // 计算最大评分
    const maxScore = nonZeroScores.length > 0 ? Math.max(...nonZeroScores).toFixed(2) : "0.00";

    // 计算最小评分
    const minScore = nonZeroScores.length > 0 ? Math.min(...nonZeroScores).toFixed(2) : "0.00";


    // 平均评分
    const totalScore = nonZeroScores.reduce((acc, score) => acc + score, 0);
    const avgScoreValue = nonZeroScores.length > 0 ? totalScore / nonZeroScores.length : 0; // 避免除以 0

    //计算考试平均分
    const noZeroExamScores = echarsData.examCount.filter(score => score > 0); // 过滤掉 0 分
    console.log(noZeroExamScores);

    const examTotalScore = noZeroExamScores.reduce((acc, score) => acc + score, 0);
    const examAvgScoreValue = noZeroExamScores.length > 0 ? examTotalScore / noZeroExamScores.length : 0; // 避免除以 0

    const avgData = echarsData.avgScore.map((score, index) => ({
        index: `第 ${index + 1} 天`, // X 轴标签
        score: score, // Y 轴值
    }));

    const chatNumberData = echarsData.messageCount.map((count, index) => ({
        index: `第 ${index + 1} 天`, // X 轴标签
        count: count, // Y 轴值
    }))

    const examNumberData = echarsData.examCount.map((count, index) => ({
        index: `第 ${index + 1} 天`, // X 轴标签
        count: count, // Y 轴值
    }))

    const knowledgeCountData = echarsData.knowledgeBasesData
        .filter(item => item.useCount > 0) // 过滤掉 useCount 为 0 的数据，避免空白部分
        .map(item => ({
            type: item.knowledgeNameCN, // 使用 knowledgeNameCN 作为分类
            value: item.useCount, // 统计 useCount
        }));

    const avgConfig = {
        data: avgData,
        xField: "index",  // X 轴
        yField: "score",  // Y 轴
        label: {
            style: { fill: "#FFFFFF" },
        },
        height: 300,
        maxColumnWidth: 40,
        color: "#5d65f8", // 统一颜色
        xAxis: { label: { autoHide: true, autoRotate: false } },
        yAxis: { min: 0.5, max: 1 }, // 评分一般 0~1 之间
    };

    const chatNumberConfig = {
        data: chatNumberData,
        xField: "index",  // X 轴
        yField: "count",  // Y 轴
        label: {
            style: { fill: "#FFFFFF" },
        },
        height: 300,
        maxColumnWidth: 40,
        color: ['#5d65f8'], // 统一颜色
        xAxis: { label: { autoHide: true, autoRotate: false } },
        yAxis: { min: 0, max: 100 },
    }

    const examNumberConfig = {
        data: examNumberData,
        xField: "index",  // X 轴
        yField: "count",  // Y 轴
        label: {
            style: { fill: "#FFFFFF" },
        },
        height: 300,
        maxColumnWidth: 40,
        color: ['#5d65f8'], // 统一颜色
        xAxis: { label: { autoHide: true, autoRotate: false } },
        yAxis: { min: 0, max: 100 },
    }


    const knowledgeCountConfig = {
        data: knowledgeCountData,
        angleField: "value", // 使用 useCount 作为角度字段
        colorField: "type", // 使用 knowledgeNameCN 作为分类
        innerRadius: 0.6, // 设置内半径，让其变成空心的
        legend: {
            color: {
                title: false,
                position: 'right',
                rowPadding: 5,
            },
        },
        height: 320,
        width: 320,

    };


    const sortedData = [...echarsData.knowledgeBasesData]
        .sort((a, b) => b.avgScore - a.avgScore) // 按 avgScore 排序（降序）
        .map((item, index) => ({
            ...item,
            rank: index + 1, // 添加排名字段
        }));


    const columns: TableProps<KnowledgeBaseType>['columns'] = [
        {
            title: '排名',
            dataIndex: 'rank',
            key: 'rank',
            className: 'rankColumn',
        },
        {
            title: 'KnowledgeName',
            dataIndex: 'knowledgeNameCN',
            key: 'knowledgeNameCN',
            className: 'knowledgeNameColumn rankColumn',
        },
        {
            title: 'avgScore',
            dataIndex: 'avgScore',
            key: 'avgScore',
            className: 'rankColumn',
        }
    ];

    return {
        maxScore,
        minScore,
        avgScoreValue,
        avgConfig,
        chatNumberConfig,
        knowledgeCountConfig,
        sortedData,
        columns,
        examNumberConfig,
        examAvgScoreValue,
    }
}