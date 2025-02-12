import { useState } from "react";
import { login, register } from "../../api";
import { Input, Button, Typography, message, Card } from "antd";
import "./index.scss";

const { Title, Text } = Typography;

const Login = () => {
    const [userName, setUserName] = useState("");
    const [passWord, setPassWord] = useState("");
    const [isRegister, setIsRegister] = useState(false);

    const handleSubmit = async () => {
        message.loading({ content: "正在提交...", key: "loading" });
        const response = isRegister
            ? await register(userName, passWord)
            : await login(userName, passWord);
        console.log(response);

        if (response.data) {
            message.success({ content: isRegister ? "注册成功！" : "登录成功！", key: "loading" });
        } else {
            message.error({ content: response.msg || "操作失败", key: "loading" });
        }
    };

    return (
        <div className="login-container">
            <Card className="login-card">
                <Title level={2}>{isRegister ? "注册" : "登录"}</Title>
                <Input
                    placeholder="用户名"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="login-input"
                />
                <Input.Password
                    placeholder="密码"
                    value={passWord}
                    onChange={(e) => setPassWord(e.target.value)}
                    className="login-input"
                />
                <Button type="primary" block onClick={handleSubmit} className="login-button">
                    {isRegister ? "注册" : "登录"}
                </Button>
                <Text className="toggle-text" onClick={() => setIsRegister(!isRegister)}>
                    {isRegister ? "已有账号？去登录" : "没有账号？去注册"}
                </Text>
            </Card>
        </div>
    );
};

export default Login;