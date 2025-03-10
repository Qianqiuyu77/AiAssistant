import { InfoCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Col, Divider, Form, Input, InputNumber, InputNumberProps, message, Row, Slider, Switch, Tooltip, Upload } from "antd";
import "./index.scss";
import TextArea from "antd/es/input/TextArea";
import { useCallback, useState } from "react";
import { createKnowledgeBase } from "../../../../api";
import useBaseStore from "../../../../../zustand/baseStore";
import { useFileUploader, useTextSplitter } from "./hooks";

const AddKnowLedgeBases = () => {
    const baseState = useBaseStore();
    const [chunkSize, setchunkSize] = useState(100);
    const [chunkOverlap, setchunkOverlap] = useState(20);
    const [humanSplit, setHumanSplit] = useState<boolean>(false);
    const [text, setText] = useState<string>("");
    const [form] = Form.useForm();

    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const { knowProps, imgProps, dataFile, img, clearFile } = useFileUploader();
    const {
        chunksData,
        splitText,
        clearChunksData,
        chunkOverlapMarks,
        chunkSizeMarks,
    } = useTextSplitter({
        chunkSize,
        chunkOverlap,
        humanSplit,
        text,
        dataFile
    });

    // 输入处理函数
    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value),
        []
    );

    const onChangeChunkSize: InputNumberProps['onChange'] = (newValue) => {
        setchunkSize(newValue as number);
    };

    const onChangeChunkOverlap: InputNumberProps['onChange'] = (newValue) => {
        setchunkOverlap(newValue as number);
    }

    // 提交编辑表单
    const handleEditSubmit = async () => {
        try {
            const values = await form.validateFields();
            console.log(values);

            if (!text.trim() && !dataFile.name) {
                message.warning("请输入文本或上传文件后再提交");
                return;
            }
            if (
                !values.knowledgebaseName?.trim() ||
                !values.knowledgebaseNameCN?.trim() ||
                img === ''
            ) {
                message.warning("请输入完整信息后再提交");
                return;
            }
            setConfirmLoading(true);
            const blob = new Blob([text], { type: "text/plain" });
            const file = dataFile.name ? dataFile : new File([blob], "file.txt", { type: "text/plain" });

            const res = await createKnowledgeBase(
                baseState.token,
                {
                    chunkSize: chunkSize,
                    chunkOverlap: chunkOverlap,
                    humanSplit: humanSplit,
                    knowledgebaseName: values.knowledgebaseName,
                    knowledgebaseNameCN: values.knowledgebaseNameCN,
                    knowledgebaseIntroduce: values.knowledgebaseInfo,
                    knowledgebaseIcon: img,
                    file: file
                }
            );
            setConfirmLoading(false);

            if (res.data) {
                message.success("知识库新建成功");
                form.resetFields();
                setText("");
                clearChunksData();
                clearFile();

            } else {
                message.error(res.msg || "更新失败");
            }
        } catch {
            message.error("表单字段未填写完全");

            return;
        }

    };

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
            <div className="guide-section">
                <h1>✂️ 📖 文本切分可视化 && 新建知识库</h1>
                <p className="guide-text">
                    当文本的信息更加集中准确的时候，大语言模型能够发挥最佳效果。<br />
                    文本切分策略严重影响模型效果，文本切分有很多不同的策略。<br />
                    这是一个工具，用于理解不同的文本切分/分割策略。<br />
                    当调试好切分的内容后进行创建知识库
                </p>
            </div>

            <Form layout="vertical" className="knowledge-form" form={form} preserve={false}>

                <Form.Item label="知识库文本">
                    <TextArea
                        onChange={handleInputChange}
                        placeholder="请输入需要处理的文本内容..."
                        className="text-area"
                        value={text}
                    />
                </Form.Item>
                <Form.Item label="知识库文件">
                    <Upload {...knowProps}
                        maxCount={1}>
                        <Button icon={<UploadOutlined />}>上传文件</Button>
                    </Upload>
                </Form.Item>


                {
                    text && dataFile.name && <Form.Item >
                        <Alert message="文本与文件同时存在时优先选用文件内容" type="warning" showIcon />
                    </Form.Item>
                }


                {/* Chunk Size 滑块 */}
                <Form.Item label="Chunk Size" className="slider-item">
                    <Row gutter={16}>
                        <Col span={16}>
                            <Slider
                                styles={{
                                    track: {
                                        background: '#5d65f8',
                                    },
                                    handle: {
                                        background: '#5d65f8',
                                    }
                                }}
                                marks={chunkSizeMarks}
                                className="slider"
                                min={10}
                                max={1000}
                                value={chunkSize}
                                onChange={(onChangeChunkSize)}
                                tooltip={{ formatter: v => `${v} tokens` }}
                            />
                        </Col>
                        <Col span={6}>
                            <InputNumber
                                min={0}
                                max={500}
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
                                className="slider"
                                styles={{
                                    track: {
                                        background: '#5d65f8',
                                    }
                                }}
                                marks={chunkOverlapMarks}
                                min={0}
                                max={100}  // 确保overlap不超过chunkSize
                                value={chunkOverlap}
                                onChange={onChangeChunkOverlap}
                                tooltip={{ formatter: v => `${v} tokens` }}
                            />
                        </Col>
                        <Col span={6}>
                            <InputNumber
                                min={0}
                                max={100}
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
                        onChange={setHumanSplit}
                        checkedChildren="开启"
                        unCheckedChildren="关闭"
                    />
                </Form.Item>
                <Form.Item className="split-btn">
                    <Button
                        size="large"
                        style={{ backgroundColor: '#5d65f8', color: '#fff' }}
                        onClick={splitText}
                        disabled={!text.trim() && !dataFile.name}
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
                <Divider variant="dotted" style={{ borderColor: '#7cb305' }}>
                    新建知识库区
                </Divider>
                <Form.Item label="知识库名称" name="knowledgebaseNameCN" rules={[{ required: true, message: "请输入知识库名称" }]}>
                    <Input maxLength={10} placeholder="请输入知识库名称" showCount />
                </Form.Item>

                <Form.Item label="知识库简称" name="knowledgebaseName" rules={[{ required: true, message: "请输入知识库简称" }]}>
                    <Input maxLength={5} placeholder="请输入知识库简称" />
                </Form.Item>

                <Form.Item label="知识库信息" name="knowledgebaseInfo">
                    <TextArea rows={4} placeholder="请输入知识库描述信息" />
                </Form.Item>

                <Form.Item label="知识库图标" name="knowledgebaseIcon" rules={[{ required: true, message: "请输入知识库图标" }]}>
                    <Upload {...imgProps}
                        maxCount={1}>
                        <Button icon={<UploadOutlined />}>上传图片</Button>
                    </Upload>
                </Form.Item>

                <Form.Item className="split-btn">
                    <Button
                        size="large"
                        type="primary"
                        onClick={handleEditSubmit}
                        loading={confirmLoading}
                        className="submit-btn"
                        disabled={!text.trim() && !dataFile.name}
                    >
                        新建知识库
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default AddKnowLedgeBases;