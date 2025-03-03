import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, InputNumber, InputNumberProps, message, Modal, Row, Slider, Switch, Tooltip } from "antd";
import { ChunksData } from "../../../../types/admin";
import "./index.scss";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { createKnowledgeBase, previewChunks } from "../../../../api";
import useBaseStore from "../../../../../zustand/baseStore";

const AddKnowLedgeBases = () => {
    const baseState = useBaseStore();
    const [chunksData, setChunksData] = useState<string[]>([]);
    const [chunkSize, setchunkSize] = useState(1);
    const [chunkOverlap, setchunkOverlap] = useState(0);
    const [humanSplit, setHumanSplit] = useState<boolean>(false);
    const [text, setText] = useState<string>("");
    const [form] = Form.useForm();
    const [editModalVisible, setEditModalVisible] = useState(false);

    const onChangeChunkSize: InputNumberProps['onChange'] = (newValue) => {
        setchunkSize(newValue as number);
    };

    const onChangeChunkOverlap: InputNumberProps['onChange'] = (newValue) => {
        setchunkOverlap(newValue as number);
    }

    const onHumanSplitChange = (e: boolean) => {
        setHumanSplit(e);
    }

    const onChangeInputArea = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setText(e.target.value);
    };

    const splitText = () => {
        if (!text.trim()) {
            message.warning("请输入内容后再上传");
            return;
        }

        const blob = new Blob([text], { type: "text/plain" });
        const file = new File([blob], "file.txt", { type: "text/plain" });
        const chunksData: ChunksData = {
            file: file,
            chunkSize: chunkSize,
            chunkOverlap: chunkOverlap,
            humanSplit: humanSplit
        }
        fetchgetPrviewChunks(chunksData);
    }

    async function fetchgetPrviewChunks(chunksData: ChunksData) {
        try {
            const res = await previewChunks(baseState.token, chunksData);

            if (res.data && res.data.chunksPreview) {
                console.log(res.data);
                setChunksData(res.data.chunksPreview);
            } else {
                message.error({
                    content: res.msg || "获取段落信息失败，请重试",
                    key: "loading",
                    duration: 2,
                });
            }

            console.log(res);
        } catch (err) {
            console.log(err);

            message.error({
                content: "获取段落信息失败，请重试",
                key: "loading",
                duration: 2,
            });
        }
    }


    // 打开编辑弹窗
    const handleNewKnowledgebase = () => {
        setEditModalVisible(true);
    };

    // 提交编辑表单
    const handleEditSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (!text.trim()) {
                message.warning("请输入内容后再上传");
                return;
            }

            const blob = new Blob([text], { type: "text/plain" });
            const file = new File([blob], "file.txt", { type: "text/plain" });

            const res = await createKnowledgeBase(
                baseState.token,
                {
                    chunkSize: chunkSize,
                    chunkOverlap: chunkOverlap,
                    humanSplit: humanSplit,
                    knowledgebaseName: values.knowledgebaseName,
                    knowledgebaseNameCN: values.knowledgebaseNameCN,
                    knowledgebaseIntroduce: values.knowledgebaseInfo,
                    knowledgebaseIcon: "https://miniprogram-1319929279.cos.ap-guangzhou.myqcloud.com/%E8%AE%A1%E7%AE%97%E6%9C%BA.png",
                    file: file
                }
            );

            if (res.data) {
                message.success("知识库新建成功");
                setText("");
                setChunksData([]);
                setEditModalVisible(false);
            } else {
                message.error(res.msg || "更新失败");
            }
        } catch (error) {
            console.error("新建知识库失败:", error);
            message.error("新建知识库失败，请稍后再试");
        }
    };

    // 添加Modal组件
    const NewKnowledgeModal = () => (
        <Modal
            title="编辑知识库"
            open={editModalVisible}
            onOk={handleEditSubmit}
            onCancel={() => setEditModalVisible(false)}
            destroyOnClose
            okText="保存"
            cancelText="取消"
        >
            <Form form={form} layout="vertical" preserve={false}>
                <Form.Item
                    label="知识库名称"
                    name="knowledgebaseNameCN"
                    rules={[{ required: true, message: '请输入知识库名称' }]}
                >
                    <Input placeholder="请输入知识库名称" />
                </Form.Item>

                <Form.Item
                    label="知识库简称"
                    name="knowledgebaseName"
                    rules={[{ required: true, message: '请输入知识库简称' }]}
                >
                    <Input placeholder="请输入知识库简称" />
                </Form.Item>

                <Form.Item
                    label="知识库信息"
                    name="knowledgebaseInfo"
                    rules={[{ required: false }]}
                >
                    <Input.TextArea rows={4} placeholder="请输入知识库描述信息" />
                </Form.Item>
            </Form>
        </Modal>
    );


    return (
        <Card
            title={
                <div className="card-header">
                    <span>新增知识库</span>
                    <Tooltip title="文本切分参数说明">
                        <InfoCircleOutlined className="info-icon" />
                    </Tooltip>
                </div>
            }
            bordered={false}
            className="knowledge-card"
        >
            <NewKnowledgeModal />
            <div className="guide-section">
                <h1>✂️ 📖 文本切分可视化</h1>
                <p className="guide-text">
                    当文本的信息更加集中准确的时候，大语言模型能够发挥最佳效果。<br />
                    文本切分策略严重影响模型效果，文本切分有很多不同的策略。<br />
                    这是一个工具，用于理解不同的文本切分/分割策略。
                </p>
            </div>

            <Form layout="vertical" className="knowledge-form">
                <Form.Item label="输入您的文本">
                    <TextArea
                        rows={6}
                        onBlur={splitText}
                        onChange={onChangeInputArea}
                        placeholder="请输入需要处理的文本内容..."
                        className="text-area"
                    />
                </Form.Item>

                {/* Chunk Size 滑块 */}
                <Form.Item label="Chunk Size" className="slider-item">
                    <Row gutter={16}>
                        <Col span={16}>
                            <Slider
                                min={1}
                                max={20}
                                value={chunkSize}
                                onChange={onChangeChunkSize}
                                tooltip={{ formatter: v => `${v} tokens` }}
                            />
                        </Col>
                        <Col span={6}>
                            <InputNumber
                                min={1}
                                max={20}
                                value={chunkSize}
                                onChange={onChangeChunkSize}
                                className="slider-input"
                            />
                        </Col>
                    </Row>
                </Form.Item>

                {/* Overlap 滑块 */}
                <Form.Item label="Overlap" className="slider-item">
                    <Row gutter={16}>
                        <Col span={16}>
                            <Slider
                                min={0}
                                max={chunkSize}  // 确保overlap不超过chunkSize
                                value={chunkOverlap}
                                onChange={onChangeChunkOverlap}
                                tooltip={{ formatter: v => `${v} tokens` }}
                            />
                        </Col>
                        <Col span={6}>
                            <InputNumber
                                min={0}
                                max={chunkSize}
                                value={chunkOverlap}
                                onChange={onChangeChunkOverlap}
                                className="slider-input"
                            />
                        </Col>
                    </Row>
                </Form.Item>

                <Form.Item label="是否人工切分过" className="switch-item">
                    <Switch
                        checked={humanSplit}
                        onChange={onHumanSplitChange}
                        checkedChildren="开启"
                        unCheckedChildren="关闭"
                    />
                </Form.Item>

                <Form.Item className="split-btn">
                    <Button
                        size="large"
                        style={{ backgroundColor: '#5d65f8', color: '#fff' }}
                        onClick={splitText}
                    >
                        切分预览
                    </Button>
                </Form.Item>

                <Form.Item label="切分好的文本段" className="preview-section">
                    <div className="preview-container">
                        {chunksData.length > 0 ? (
                            chunksData.map((chunk, index) => (
                                <div key={index} className="chunk-item">
                                    <div className="chunk-header">
                                        <span>段落 {index + 1}</span>
                                        <span>{chunk.length} 字符</span>
                                    </div>
                                    <div className="chunk-content">{chunk}</div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-preview">输入文本后自动生成分割预览</div>
                        )}
                    </div>
                </Form.Item>

                <Form.Item className="submit-item">
                    <Button
                        type="primary"
                        onClick={handleNewKnowledgebase}
                        className="submit-btn"
                    >
                        新建知识库
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default AddKnowLedgeBases;