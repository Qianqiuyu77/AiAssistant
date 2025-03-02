import { InfoCircleOutlined } from "@ant-design/icons";
import { Card, Tooltip } from "antd";


const AddKnowLedgeBases = () => {


    return (
        (
            <Card
                title="新增知识库"
                bordered={false}
                extra={
                    <Tooltip title="指标说明">
                        <InfoCircleOutlined />
                    </Tooltip>
                }
                style={{ width: "100%", marginBottom: "20px" }}>
            </Card>
        )
    );
}

export default AddKnowLedgeBases