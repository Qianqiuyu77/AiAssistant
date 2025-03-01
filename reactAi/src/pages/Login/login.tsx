import { useState } from "react";
import { login, register } from "../../api";
import { Form, Input, Button, Typography, message, Card, Divider } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./login.scss";

const { Title, Text } = Typography;

const Login = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values: { username: string; password: string }) => {
        setLoading(true);
        try {
            const response = isRegister
                ? await register(values.username, values.password)
                : await login(values.username, values.password);

            if (response.data) {
                message.success({
                    content: (
                        <span style={{ fontSize: "1.1em" }}>
                            {isRegister ? "🎉 注册成功！" : "👋 欢迎回来！"}
                        </span>
                    ),
                    key: "loading",
                    duration: 2,
                });

                if (isRegister) {
                    setIsRegister(false); // 注册成功后重置为登录状态
                    navigate("/login");
                } else {
                    navigate("/home", { state: { userName: response.data.userName, userId: response.data.userId } });// 登录成功后跳转到首页
                }
            } else {
                message.error({
                    content: response.msg || "操作失败，请重试",
                    key: "loading",
                    duration: 2,
                });
            }
        } catch (err) {
            console.log(err);
            message.error({
                content: "网络错误，请检查连接",
                key: "loading",
                duration: 2,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <Card className="login-card" hoverable>
                <div className="card-header">
                    <img src="src/images/ai.png" className="logo" />
                    <Title level={2} className="title">
                        {isRegister ? "新同学注册" : "欢迎登录"}
                    </Title>
                    <Text type="secondary" className="subtitle">
                        {isRegister ? "加入我们，开启你的学习之旅" : "请使用您的账号登录"}
                    </Text>
                </div>

                <Form
                    form={form}
                    name="login"
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="username"
                        rules={[
                            { required: true, message: "请输入用户名！" },
                            { min: 4, message: "用户名至少4个字符" },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="input-icon" />}
                            placeholder="请输入用户名"
                            allowClear
                        />
                    </Form.Item>

                    <TransitionGroup component={null}>
                        <CSSTransition
                            key={isRegister ? "register-password" : "login-password"}
                            timeout={400}
                            classNames="form-item"
                        >
                            <Form.Item
                                name="password"
                                rules={[
                                    { required: true, message: "请输入密码！" },
                                    { min: 6, message: "密码至少6个字符" },
                                    {
                                        pattern: /^(?=.*[A-Za-z])(?=.*\d).*$/,
                                        message: "需包含字母和数字",
                                    },
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="input-icon" />}
                                    placeholder="请输入密码"
                                />
                            </Form.Item>
                        </CSSTransition>
                    </TransitionGroup>

                    {isRegister && (
                        <CSSTransition
                            in={isRegister}
                            timeout={400}
                            classNames="form-item"
                            unmountOnExit
                        >
                            <Form.Item
                                name="confirm"
                                dependencies={["password"]}
                                rules={[
                                    { required: true, message: "请确认密码！" },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue("password") === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error("两次输入的密码不一致！"));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="input-icon" />}
                                    placeholder="确认密码"
                                />
                            </Form.Item>
                        </CSSTransition>
                    )}

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            className="submit-btn"
                        >
                            {isRegister ? "立即注册" : "登录"}
                        </Button>
                    </Form.Item>

                    <Divider plain>或</Divider>

                    <div className="toggle-container">
                        <Text type="secondary">
                            {isRegister ? "已有账号？" : "没有账号？"}
                        </Text>
                        <Button
                            type="link"
                            onClick={() => {
                                setIsRegister(!isRegister);
                                form.resetFields();
                            }}
                            className="toggle-btn"
                        >
                            {isRegister ? "去登录" : "立即注册"}
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Login;