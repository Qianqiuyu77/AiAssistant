/* eslint-disable react-hooks/exhaustive-deps */
import Skeleton from "antd/es/skeleton/Skeleton";
import { BookOutlined, InfoCircleOutlined, MessageOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Tooltip, Table, Button, Col, Input, Row } from "antd";
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { AdminKnowledgeBase } from "../../../../types/admin";

import './index.scss'

interface KnowledgeBaseProps {
    knowledgeBases: AdminKnowledgeBase[]
}

const KnowledgeManger = (props: KnowledgeBaseProps) => {
    const { knowledgeBases } = props
    const [loading, setLoading] = useState(true);
    const [filteredData, setFilteredData] = useState<AdminKnowledgeBase[]>([]);

    const [searchParams, setSearchParams] = useState({
        knowledgebaseId: "",
        knowledgebaseName: "",
        knowledgebaseInfo: "",
        ownerId: ""
    });

    // 综合搜索处理
    const handleSearch = () => {
        const filtered = knowledgeBases.filter(item => {
            return (
                (searchParams.knowledgebaseId ? item.knowledgebaseId.toString().includes(searchParams.knowledgebaseId) : true) &&
                (searchParams.knowledgebaseName ? item.knowledgebaseName.toLowerCase().includes(searchParams.knowledgebaseName.toLowerCase()) : true) &&
                (searchParams.ownerId ? item.ownerId.toString().includes(searchParams.ownerId) : true) &&
                (searchParams.knowledgebaseInfo ? (item.knowledgebaseInfo || "").toLowerCase().includes(searchParams.knowledgebaseInfo.toLowerCase()) : true)
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
    }, [searchParams, knowledgeBases]);

    const columns: ColumnsType<AdminKnowledgeBase> = [
        { title: "知识库ID", dataIndex: "knowledgebaseId", key: "knowledgebaseId", width: 100, align: "center" },
        { title: "知识库名称", dataIndex: "knowledgebaseName", key: "knowledgebaseName" },
        { title: "知识库简称", dataIndex: "knowledgebaseNameSimple", key: "knowledgebaseNameSimple", sorter: (a, b) => a.knowledgebaseNameSimple.localeCompare(b.knowledgebaseNameSimple) },
        {
            title: "创建时间",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (timestamp) => dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss"),
            sorter: (a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
        },
        {
            title: "知识库信息",
            dataIndex: "knowledgebaseInfo",
            key: "knowledgebaseInfo"
        },
        { title: "知识库所有者id", dataIndex: "ownerId", key: "ownerId", sorter: (a, b) => a.ownerId - b.ownerId },

        {
            title: "操作",
            key: "resetPassword",
            align: "center",
            render: () => (
                (
                    <div className="table-operation">
                        <Button type="primary" size="small">
                            编辑
                        </Button>
                        <Button type="primary" danger size="small">
                            删除
                        </Button>


                    </div>
                )
            ),
        },
    ];

    useEffect(() => {
        setLoading(knowledgeBases && knowledgeBases.length === 0);
        setFilteredData(knowledgeBases);
    }, [knowledgeBases]);



    return (
        loading ? <Skeleton active /> :
            <Card
                title="知识库管理"
                bordered={false}
                style={{ width: "100%", marginBottom: "20px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)" }}
                extra={
                    <Tooltip title="指标说明">
                        <InfoCircleOutlined />
                    </Tooltip>
                }
            >
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
                                placeholder="请输入知识库ID..."
                                prefix={<UserOutlined />}
                                allowClear
                                value={searchParams.knowledgebaseId}
                                onChange={e => handleParamChange("knowledgebaseId", e.target.value)}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                            <Input
                                placeholder="请输入知识库名称..."
                                prefix={<MessageOutlined />}
                                allowClear
                                value={searchParams.knowledgebaseName}
                                onChange={e => handleParamChange("knowledgebaseName", e.target.value)}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                            <Input
                                placeholder="请输入知识库拥有者ID..."
                                prefix={<BookOutlined />}
                                allowClear
                                value={searchParams.ownerId}
                                onChange={e => handleParamChange("ownerId", e.target.value)}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                            <Input
                                placeholder="请输入知识库信息..."
                                prefix={<BookOutlined />}
                                allowClear
                                value={searchParams.knowledgebaseInfo}
                                onChange={e => handleParamChange("knowledgebaseInfo", e.target.value)}
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
                                        knowledgebaseId: "",
                                        knowledgebaseName: "",
                                        knowledgebaseInfo: "",
                                        ownerId: ""
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
                    rowKey="knowledgebaseId"
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
}

export default KnowledgeManger