import {
    Table,
    Card,
    Skeleton,
    Collapse,
    Tooltip,
    Input,
    Row,
    Col,
    Button
} from "antd";
import { MessageType } from "../../../../types/chat";
import dayjs from "dayjs";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import {
    CaretRightOutlined,
    InfoCircleOutlined,
    UserOutlined,
    MessageOutlined,
    BookOutlined
} from "@ant-design/icons";

interface ChatInfosProps {
    messageInfos: MessageType[];
}

const ChatInfos = (props: ChatInfosProps) => {
    const { messageInfos } = props;
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useState({
        userId: "",
        question: "",
        knowledgeId: "",
        knowledge: ""
    });
    const [filteredData, setFilteredData] = useState<MessageType[]>([]);

    // 综合搜索处理
    const handleSearch = () => {
        const filtered = messageInfos.filter(item => {
            return (
                (searchParams.userId ? item.userId.toString().includes(searchParams.userId) : true) &&
                (searchParams.question ? item.question.toLowerCase().includes(searchParams.question.toLowerCase()) : true) &&
                (searchParams.knowledgeId ? item.knowledgeId.toString().includes(searchParams.knowledgeId) : true) &&
                (searchParams.knowledge ? (item.knowledge || "").toLowerCase().includes(searchParams.knowledge.toLowerCase()) : true)
            );
        });
        setFilteredData(filtered);
    };

    // 处理参数变化
    const handleParamChange = (name: string, value: string) => {
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 自动触发搜索（带防抖）
    useEffect(() => {
        handleSearch();
    }, [searchParams, messageInfos]);

    // 处理表格的列配置
    const columns: ColumnsType<MessageType> = [
        {
            title: "消息ID",
            dataIndex: "messageId",
            key: "messageId",
            render: (messageId: string) => <span>{messageId}</span>,
            align: "center",
        },
        {
            title: "用户ID",
            dataIndex: "userId",
            key: "userId",
            render: (userId: number) => <span>{userId}</span>,
            align: "center",
        },
        {
            title: "对话ID",
            dataIndex: "conversationId",
            key: "conversationId",
            render: (conversationId: number) => <span>{conversationId}</span>,
            align: "center",
        },
        {
            title: "问题",
            dataIndex: "question",
            key: "question",
            render: (question: string) => <span>{question}</span>,
            align: "center",
        },

        {
            title: "回答内容",
            dataIndex: "content",
            key: "content",
            render: (content: string) => (
                <Collapse
                    bordered={false}
                    expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                    ghost
                    items={[
                        {
                            key: "content",
                            label: content.slice(0, 40) + (content.length > 40 ? "..." : ""),
                            children: <div style={{ whiteSpace: 'pre-line' }}>{content}</div>,
                            showArrow: false,
                            style: { padding: 0, backgroundColor: "#f0f2f5" }
                        }
                    ]}
                />
            ),
            align: "center",
        },
        {
            title: "创建时间",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt) => dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss"),
            sorter: (a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
        },
        {
            title: "知识点",
            dataIndex: "knowledge",
            key: "knowledge",
            render: (knowledge: string) => (
                <Collapse
                    bordered={false}
                    expandIcon={({ isActive }) => <CaretRightOutlined style={{ color: "#1890ff" }} rotate={isActive ? 90 : 0} />}
                    ghost
                    items={[
                        {
                            key: "knowledge",
                            label: knowledge ? (knowledge.slice(0, 40) + (knowledge.length > 40 ? "..." : "")) : "未使用知识库",
                            children: <div style={{ whiteSpace: 'pre-line' }}>{knowledge}</div>,
                            showArrow: false,
                            style: { padding: 0, backgroundColor: "#f0f2f5" }
                        }
                    ]}
                />

            ),
            align: "center",
        },
        {
            title: "知识库ID",
            dataIndex: "knowledgeId",
            key: "knowledgeId",
            render: (knowledgeId: string) => <span>{knowledgeId || "未使用知识库"}</span>,
            align: "center",
        }

    ];

    useEffect(() => {
        setLoading(messageInfos && messageInfos.length === 0);
        setFilteredData(messageInfos);
    }, [messageInfos]);

    return (
        loading ? <Skeleton active /> :
            <Card
                title="对话信息"
                bordered={false}
                style={{ width: "100%", marginBottom: "20px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)" }}
                extra={
                    <Tooltip title="指标说明">
                        <InfoCircleOutlined />
                    </Tooltip>
                }
            >
                {/* 搜索栏 */}
                {/* 搜索栏 */}
                <div style={{ marginBottom: 24 }}>
                    <Row
                        gutter={[16, 8]}
                        align="middle"
                        justify="space-between"
                    >
                        {/* 搜索输入框列 */}

                        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                            <Input
                                placeholder="请输入用户ID..."
                                prefix={<UserOutlined />}
                                allowClear
                                value={searchParams.userId}
                                onChange={e => handleParamChange("userId", e.target.value)}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                            <Input
                                placeholder="请输入问题..."
                                prefix={<MessageOutlined />}
                                allowClear
                                value={searchParams.question}
                                onChange={e => handleParamChange("question", e.target.value)}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                            <Input
                                placeholder="请输入知识库ID..."
                                prefix={<BookOutlined />}
                                allowClear
                                value={searchParams.knowledgeId}
                                onChange={e => handleParamChange("knowledgeId", e.target.value)}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                            <Input
                                placeholder="请输入知识点..."
                                prefix={<BookOutlined />}
                                allowClear
                                value={searchParams.knowledge}
                                onChange={e => handleParamChange("knowledge", e.target.value)}
                            />
                        </Col>

                        {/* 重置按钮列 */}
                        <Col xs={24} sm={6} md={4} lg={4} xl={4}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                padding: '0 8px'
                            }}>
                                <Button
                                    style={{
                                        backgroundColor: '#5d65f8',
                                        color: '#fff',
                                    }}
                                    ghost
                                    onClick={() => setSearchParams({
                                        userId: "",
                                        question: "",
                                        knowledgeId: "",
                                        knowledge: ""
                                    })}
                                >
                                    重置筛选
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>


                {/* 数据表格 */}
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="messageId"
                    pagination={{
                        showSizeChanger: true,
                        pageSizeOptions: ["10", "20", "50", "100"],
                        showQuickJumper: true,
                    }}
                    rowClassName="table-row-hover"
                    style={{ backgroundColor: "#fff" }}
                    bordered
                />
            </Card>
    );
};

export default ChatInfos;