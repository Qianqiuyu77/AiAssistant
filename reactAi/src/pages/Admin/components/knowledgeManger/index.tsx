import Skeleton from "antd/es/skeleton/Skeleton";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Card, Tooltip, Table, Button } from "antd";
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