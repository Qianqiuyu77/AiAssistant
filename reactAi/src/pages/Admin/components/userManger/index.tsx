import { useEffect, useState } from "react";
import { Table, Input, Skeleton, Button, Space, Card, message, Popconfirm, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { UserData } from "../../../../types/admin";
import "./index.scss"
import useBaseStore from "../../../../../zustand/baseStore";
import { resetPassword } from "../../../../api";
import { InfoCircleOutlined } from "@ant-design/icons";

dayjs.extend(isBetween);

interface UserMangerProps {
    userDatas: UserData[];
}

const UserManger = (props: UserMangerProps) => {
    const { userDatas = [] } = props;

    const baseState = useBaseStore();

    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(userDatas.length === 0);
    }, [userDatas]);

    // 处理搜索逻辑
    const filteredData = userDatas.filter(user => user?.userName?.toLowerCase().includes(searchText.toLowerCase()) || user?.userId?.toString().includes(searchText));

    // 处理密码重置
    const handleResetPassword = async (userId: number) => {
        console.log(`重置密码请求 - 用户ID: ${userId}`);
        message.success(`已发送重置密码请求 - 用户ID: ${userId}`);
        try {
            const res = await resetPassword(baseState.token, baseState.userId)
            if (res.data) {
                message.success({
                    content: `重置用户${userId}密码成功`,
                    key: "loading",
                    duration: 2,
                })
            } else {
                message.error({
                    content: res.msg || `重置用户${userId}密码失败`,
                    key: "loading",
                    duration: 2,
                });
            }
        } catch (error) {
            console.log(error)
            message.error({
                content: `重置用户${userId}密码失败`,
                key: "loading",
                duration: 2,
            });
        }


    };

    // 表格列配置
    const columns: ColumnsType<UserData> = [
        { title: "用户ID", dataIndex: "userId", key: "userId", width: 100, align: "center" },
        { title: "用户名", dataIndex: "userName", key: "userName", sorter: (a, b) => a.userName.localeCompare(b.userName) },
        {
            title: "创建时间",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (timestamp) => dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss"),
            sorter: (a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
        },
        { title: "是否管理员", dataIndex: "isAdmin", key: "isAdmin", render: (isAdmin) => (isAdmin ? "是" : "否"), width: 150, align: "center" },
        {
            title: "最后登录时间",
            dataIndex: "lastLoginTime",
            key: "lastLoginTime",
            render: (timestamp) => dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss"),
            sorter: (a, b) => dayjs(a.lastLoginTime).valueOf() - dayjs(b.lastLoginTime).valueOf(),
        },
        { title: "最后登录IP", dataIndex: "lastLoginIp", key: "lastLoginIp", render: (ip) => ip || "N/A", align: "center" },
        {
            title: "重置密码",
            key: "resetPassword",
            align: "center",
            render: (_, record) => (
                <Popconfirm
                    title="确认重置密码？"
                    description={`确定要重置用户 ${record.userName} 的密码吗？`}
                    onConfirm={() => handleResetPassword(record.userId)}
                    okText="是"
                    cancelText="否"
                >
                    <Button type="primary" danger size="small">
                        重置
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        loading ? <Skeleton active /> : (
            <Card
                title="用户管理"
                bordered={false}
                extra={
                    <Tooltip title="指标说明">
                        <InfoCircleOutlined />
                    </Tooltip>
                }
                style={{ width: "100%", marginBottom: "20px" }}>
                <Space style={{ marginBottom: 16 }}>
                    <Input.Search
                        placeholder="搜索用户名或用户id..."
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
                    rowKey="userId"
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
};

export default UserManger;
