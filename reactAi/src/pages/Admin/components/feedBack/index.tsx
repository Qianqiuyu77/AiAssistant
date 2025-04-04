import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, Skeleton, Card, Tooltip, Space, Input, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { FeedbackInfo, FeedType } from "../../../../types/feedback"

interface FeedBackProps {
    feedBackInfos: FeedbackInfo[]
}

const FeedBack = (props: FeedBackProps) => {
    const { feedBackInfos = [] } = props;

    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(feedBackInfos.length === 0);
    }, [feedBackInfos]);

    // 处理搜索逻辑
    const filteredData = feedBackInfos.filter(feedback => feedback?.userId?.toString().includes(searchText));

    // 表格列配置
    const columns: ColumnsType<FeedbackInfo> = [
        { title: "反馈Id", dataIndex: "feedbackId", key: "feedbackId", width: 100, align: "center" },
        { title: "用户ID", dataIndex: "userId", key: "userId", width: 100, align: "center" },
        {
            title: "创建时间",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (timestamp) => dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss"),
            sorter: (a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
        },
        {
            title: "反馈类型", dataIndex: "feedType", key: "feedType", align: "center",
            filters: [
                {
                    text: '信息',
                    value: FeedType.INFO,
                },
                {
                    text: 'bug',
                    value: FeedType.BUG,
                },
                {
                    text: '表扬',
                    value: FeedType.PRISE,
                },
                {
                    text: '其他',
                    value: FeedType.OTHER,
                },
            ],
            filterSearch: true,
            onFilter: (value, record) => record.feedType.startsWith(value as string),
            render: (feedType) => (
                <>
                    {feedType === FeedType.INFO && <Tag color="blue">信息</Tag>}
                    {feedType === FeedType.BUG && <Tag color="red">bug</Tag>}
                    {feedType === FeedType.PRISE && <Tag color="green">表扬</Tag>}
                    {feedType === FeedType.OTHER && <Tag color="orange">其他</Tag>}
                </>
            ),

        },
        { title: "反馈分数", dataIndex: "score", key: "score", align: "center" },
        { title: "反馈信息", dataIndex: "feedInfo", key: "feedInfo", align: "center" },
        { title: "联系方式", dataIndex: "userInfo", key: "userInfo", render: (messageId) => messageId || "暂无", align: "center" },
        { title: "对话id", dataIndex: "messageId", key: "messageId", render: (messageId) => messageId || "无", align: "center" }

    ];

    return (
        loading ? <Skeleton active /> : (
            <Card
                title="反馈信息"
                bordered={false}
                extra={
                    <Tooltip title="反馈信息">
                        <InfoCircleOutlined />
                    </Tooltip>
                }
                style={{ width: "100%", marginBottom: "20px" }}>
                <Space style={{ marginBottom: 16 }}>
                    <Input.Search
                        placeholder="搜索用户id..."
                        allowClear
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 400 }}
                    />
                    <Button onClick={() => setSearchText("")} style={{ backgroundColor: "#5d65f8", color: "#fff", marginLeft: "5rem" }}>
                        重置
                    </Button>
                </Space>

                {/* 表格 */}
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="feedbackId"
                    pagination={{
                        showSizeChanger: true, // 允许用户更改分页大小
                        pageSizeOptions: ["10", "20", "50", "100"], // 可选分页大小
                        showQuickJumper: true, // 允许跳页
                    }}
                    rowClassName="table-row-hover"
                    style={{ backgroundColor: "#fff" }}
                    bordered
                />
            </Card>
        )
    );
}

export default FeedBack