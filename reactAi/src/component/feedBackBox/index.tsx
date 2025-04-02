import { useState } from 'react';
import { CloseCircleOutlined } from "@ant-design/icons";
import { Card, Button, Form, Input, Rate, Select, message } from "antd";

interface FeedBackBoxProps {
    closeFeedBack: () => void;
}

interface FeedbackValues {
    content: string;
    rating: number;
    type: 'suggestion' | 'bug' | 'other';
    contact?: string;
}

const FeedBackBox = ({ closeFeedBack }: FeedBackBoxProps) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (values: FeedbackValues) => {
        try {
            setSubmitting(true);
            console.log(values);

            // await onSubmit?.(values);
            message.success('反馈已提交，感谢您的意见！');
            closeFeedBack();
        } catch (error) {
            console.error(error);
            message.error('提交失败，请稍后再试');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card
            title="用户反馈"
            extra={<CloseCircleOutlined onClick={closeFeedBack} />}
            style={{ width: 500 }}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{ type: 'suggestion', rating: 5 }}
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="反馈类型"
                    name="type"
                    rules={[{ required: true }]}
                >
                    <Select>
                        <Select.Option value="suggestion">功能建议</Select.Option>
                        <Select.Option value="bug">错误报告</Select.Option>
                        <Select.Option value="other">其他</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="满意度评分"
                    name="rating"
                    rules={[{ required: true }]}
                >
                    <Rate />
                </Form.Item>

                <Form.Item
                    label="反馈内容"
                    name="content"
                    rules={[{ required: true, message: '请输入反馈内容' }]}
                >
                    <Input.TextArea
                        rows={4}
                        placeholder="请详细描述您的反馈内容..."
                        maxLength={500}
                        showCount
                    />
                </Form.Item>

                <Form.Item
                    label="联系方式（可选）"
                    name="contact"
                    help="便于我们回复您的反馈"
                >
                    <Input placeholder="邮箱/手机号/微信" />
                </Form.Item>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <Button onClick={closeFeedBack}>取消</Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={submitting}
                    >
                        提交反馈
                    </Button>
                </div>
            </Form>
        </Card>
    );
};

export default FeedBackBox;