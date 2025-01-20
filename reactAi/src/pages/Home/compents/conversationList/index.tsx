import { PlusOutlined } from "@ant-design/icons";
import { ChatInfo } from "../../../../types/chat";
import "./index.scss";
import { Dropdown, DropdownProps, MenuProps, message, Popconfirm, PopconfirmProps } from "antd";
import { useState } from "react";
import * as XLSX from 'xlsx';

interface ConversationListProps {
    chatInfos: ChatInfo[];
    currentCid: number;
    openHistoryConversation: (conversationId: number) => void;
    openNewConversation: () => void;
    renameConversation: (conversationId: number, newName: string) => void;
    deleteConversation: (conversationId: number) => void;
}

const ConversationList = (conversationListProps: ConversationListProps) => {
    const {
        chatInfos = [],
        currentCid = -1,
        openHistoryConversation,
        openNewConversation,
        renameConversation,
        deleteConversation,
    } = conversationListProps;

    const [open, setOpen] = useState(false); // 控制下拉菜单的显示与隐藏
    const [renamingId, setRenamingId] = useState<number | null>(null); // 当前正在重命名的对话ID
    const [newName, setNewName] = useState(""); // 新的对话名称

    const deleteConfirm: PopconfirmProps["onConfirm"] = () => {
        deleteConversation(currentCid);
        setOpen(false);
    };

    const deleteCancel: PopconfirmProps["onCancel"] = () => {
        message.error("取消删除");
        setOpen(false);
    };

    const renameClick = () => {
        const chatInfo = chatInfos.find((item) => item.conversationId === currentCid);
        if (chatInfo) {
            setNewName(chatInfo.conversationMsg.substring(0, 8))
            setRenamingId(currentCid)
            setOpen(false);
        }
    }

    const submitRename = (chatInfo: ChatInfo) => {
        if (newName.trim() === chatInfo.conversationMsg.substring(0, 8)) {
            setRenamingId(null);
            setNewName("");
            return;
        }
        if (newName.trim()) {
            renameConversation(chatInfo.conversationId, newName.trim());
        } else {
            message.error("对话名称不能为空");
        }
        setRenamingId(null);
        setNewName("");
    }

    const saveChatInfoAsExcel = () => {
        // 找到对应的对话信息
        const chatInfo = chatInfos.find((item) => item.conversationId === currentCid);
        if (!chatInfo) {
            message.error("未找到对应的对话信息");
            return;
        }

        // 提取对话信息中的conversationInfo数据
        const conversationInfo = chatInfo.conversationInfo.map(info => ({
            "question": info.question,
            "content": info.content,
            "knowledge": info.knowledge,
            "createdAt": info.createdAt ? new Date(info.createdAt).toLocaleString() : "未定义的时间戳"
        }));

        // 创建一个工作表
        const ws = XLSX.utils.json_to_sheet(conversationInfo);

        // 创建一个新的工作簿并将工作表添加到其中
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "对话信息");

        // 生成Excel文件并触发下载
        XLSX.writeFile(wb, `${chatInfo.conversationMsg}_${currentCid}.xlsx`);

        message.success("保存成功");
    };

    const handleOpenChange: DropdownProps["onOpenChange"] = (nextOpen, info) => {
        if (info.source === "trigger" || nextOpen) {
            setOpen(nextOpen);
        }
    };

    const items: MenuProps["items"] = [
        {
            label: (
                <div
                    className="menu-item"
                    onClick={() => saveChatInfoAsExcel()}
                >
                    <img src="src/images/分享.png" alt="" />
                    保存
                </div>
            ),
            key: "0",
        },
        {
            label: (
                <div
                    className="menu-item"
                    onClick={() => renameClick()}
                >
                    <img src="src/images/重命名.png" alt="" />
                    重命名
                </div>
            ),
            key: "1",
        },
        {
            label: (
                <Popconfirm
                    title="删除此对话"
                    description="是否要删除此对话？"
                    onConfirm={deleteConfirm}
                    onCancel={deleteCancel}
                    okText="Yes"
                    cancelText="No"
                    placement="top"
                >
                    <div
                        className="menu-item"
                        style={{
                            color: "#f93a37",
                        }}
                    >
                        <img src="src/images/删除.png" alt="" />
                        删除
                    </div>
                </Popconfirm>
            ),
            key: "3",
        },
    ];



    return (
        <div className="conversationList">
            <div
                className="conversation"
                onClick={() => openNewConversation()}
            >
                <PlusOutlined style={{ position: "absolute", left: "1rem", top: "1rem" }} />
                新增对话
            </div>
            {chatInfos &&
                chatInfos.map((chatInfo) => {
                    const isRenaming = renamingId === chatInfo.conversationId;
                    const isActive = currentCid === chatInfo.conversationId;

                    return (
                        <div
                            className="conversation"
                            style={{
                                backgroundColor: isActive ? "#5d65f8" : "#fff",
                                color: isActive ? "#fff" : "#000",
                            }}
                            key={chatInfo.conversationId}
                            onClick={() => !isRenaming && openHistoryConversation(chatInfo.conversationId)}
                        >
                            {isRenaming ? (
                                <input
                                    autoFocus
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    maxLength={8}
                                    onBlur={() => submitRename(chatInfo)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            submitRename(chatInfo)
                                        }
                                    }}
                                    style={{
                                        width: "80%",
                                        height: "80%",
                                        fontSize: "1rem",
                                        outline: "none",
                                        border: "none",
                                        backgroundColor: "transparent",
                                        color: "#fff",
                                    }}
                                />
                            ) : (
                                <div>{chatInfo.conversationMsg.substring(0, 8)}</div>
                            )}
                            {isActive && (
                                <Dropdown
                                    menu={{ items }}
                                    trigger={["click"]}
                                    open={open}
                                    onOpenChange={handleOpenChange}
                                >
                                    <img src="src/images/白省略.png" alt="操作" />
                                </Dropdown>
                            )}
                        </div>
                    );
                })}
        </div>
    );
};

export default ConversationList;