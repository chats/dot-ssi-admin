import { Button, Form, Input, message } from "antd";
import PageHeader from "../../layouts/PageHeader";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import "../../styles.css";
import "./CreateSchema.css";
import React from "react";
import { createSchema } from "../../utils/agent";

const AgentUrl = import.meta.env.VITE_ISSUER_API;
const AgentKey = import.meta.env.VITE_ISSUER_KEY;

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

const CreateSchema: React.FC = () => {
    const onFinish = (values: any) => {
        console.log("Received values of form:", values);
        createSchema(AgentUrl, AgentKey, values)
            .then(() => {
                message.success(
                    `Schema [${values["schema_name"]} ${values["schema_version"]}] created successfully`
                );
            })
            .catch(() => {
                message.error(
                    `Failed to create schema [${values["schema_name"]} ${values["schema_version"]}]`
                );
            });
    };

    return (
        <>
            <PageHeader title="Create Schema" back />
            <div className="form-container">
                <Form name="schema_form" onFinish={onFinish}>
                    <Form.Item
                        {...formItemLayout}
                        label="Name"
                        name="schema_name"
                        rules={[
                            {
                                required: true,
                                message: "Please enter schema name.",
                            },
                        ]}
                    >
                        <Input
                            placeholder="Tourist Guide License"
                            className="schema-input"
                        />
                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
                        label="Version"
                        name="schema_version"
                        rules={[
                            {
                                required: true,
                                message: "Please enter schema version.",
                            },
                        ]}
                    >
                        <Input placeholder="1.0" className="schema-input" />
                    </Form.Item>

                    <Form.List
                        name="attributes"
                        rules={[
                            {
                                validator: async (_, attrs) => {
                                    if (!attrs || attrs.length < 1) {
                                        return Promise.reject(
                                            new Error("At least 1 attribute")
                                        );
                                    }
                                },
                            },
                        ]}
                    >
                        {(fields, { add, remove }, { errors }) => (
                            <>
                                {fields.map((field, index) => (
                                    <Form.Item
                                        {...(index === 0
                                            ? formItemLayout
                                            : formItemLayoutWithOutLabel)}
                                        label={index === 0 ? "Attributes" : ""}
                                        required={false}
                                        key={field.key}
                                    >
                                        <Form.Item
                                            {...field}
                                            validateTrigger={[
                                                "onChange",
                                                "onBlur",
                                            ]}
                                            rules={[
                                                {
                                                    required: false,
                                                    whitespace: false,
                                                    message:
                                                        "Please input attribute or delete this field.",
                                                },
                                            ]}
                                            noStyle
                                        >
                                            <Input
                                                placeholder="attribute"
                                                className="schema-input"
                                            />
                                        </Form.Item>
                                        {fields.length > 1 ? (
                                            <MinusCircleOutlined
                                                className="dynamic-delete-button"
                                                onClick={() =>
                                                    remove(field.name)
                                                }
                                            />
                                        ) : null}
                                    </Form.Item>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="default"
                                        shape="round"
                                        onClick={() => add()}
                                        className="add-attribute-button"
                                        icon={<PlusOutlined />}
                                    >
                                        Add attribute
                                    </Button>
                                    <Form.ErrorList errors={errors} />
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="add-attribute-button"
                        icon={<PlusOutlined />}
                    >
                        Create Schema
                    </Button>
                </Form>
            </div>
        </>
    );
};

export default CreateSchema;
