import {
    Button,
    Checkbox,
    Form,
    Input,
    InputNumber,
    Select,
    message,
} from "antd";
import PageHeader from "../../layouts/PageHeader";
import { useEffect, useState } from "react";
import { createCredDefs, getSchemas } from "../../utils/agent";
//import LoadingSpinner from "../../components/LoadingSpinner";
import { PlusOutlined } from "@ant-design/icons";
import LoadingSpinnerSmall from "../../components/LoadingSpinnerSmall";

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
    },
};

const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
    },
};

const CreateCredDefs: React.FC = () => {
    const AgentUrl = import.meta.env.VITE_ISSUER_API;
    const AgentKey = import.meta.env.VITE_ISSUER_KEY;
    //const AgentUrl = import.meta.env.VITE_EXAM_API;
    //const AgentKey = import.meta.env.VITE_EXAM_KEY;

    const [loading, setLoading] = useState(true);
    const [schemas, setSchemas] = useState([]);

    const createSchemaOptions = () => {
        getSchemas(AgentUrl, AgentKey)
            .then((res) => {
                if (res && res.data) {
                    setSchemas(res.data["schema_ids"]);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onFinish = (values: any) => {
        setLoading(true);
        createCredDefs(AgentUrl, AgentKey, values)
            .then(() => {
                message.success(`Credential Definition created successfully`);
            })
            .catch(() => {
                message.error(`Failed to create Credential Definition`);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        createSchemaOptions();
    }, []);

    return (
        <>
            <PageHeader title="Create Credential Definitions" back />
            <div style={{ marginBottom: "25px" }}>
                {loading ? <LoadingSpinnerSmall /> : null}
            </div>
            <div className="form-container">
                <Form name="schema_form" onFinish={onFinish}>
                    <Form.Item
                        {...formItemLayout}
                        label="Schema ID"
                        name="schema_id"
                        rules={[
                            {
                                required: true,
                                message: "Please select schema id.",
                            },
                        ]}
                    >
                        <Select
                            options={schemas.map((schema: string) => {
                                return { label: schema, value: schema };
                            })}
                        />
                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
                        label="Revocation Registry Size"
                        name="revocation_registry_size"
                        rules={[
                            {
                                required: true,
                                message: "Please enter registry size.",
                            },
                        ]}
                    >
                        <InputNumber
                            min={500}
                            max={2000}
                            defaultValue={1000}
                            className="schema-input"
                        />
                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
                        label="Tag"
                        name="tag"
                        rules={[
                            {
                                required: true,
                                message: "Please enter tag.",
                            },
                        ]}
                    >
                        <Input placeholder="default" className="schema-input" />
                    </Form.Item>
                    <Form.Item
                        {...formItemLayoutWithOutLabel}
                        name="support_revocation"
                        initialValue={false}
                        valuePropName="checked"
                    >
                        <Checkbox>Support Revocation</Checkbox>
                    </Form.Item>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            margin: "20px",
                        }}
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="add-attribute-button"
                            icon={<PlusOutlined />}
                        >
                            Create Schema
                        </Button>
                    </div>
                </Form>
            </div>
        </>
    );
};

export default CreateCredDefs;
