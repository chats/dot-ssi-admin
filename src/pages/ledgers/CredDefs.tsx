import { Button, Divider, Table, message } from "antd";
import { useEffect, useState } from "react";
import { getCredDefs } from "../../utils/agent";
import { EditFilled, DeleteFilled } from "@ant-design/icons";

import PageHeader from "../../layouts/PageHeader";
import LoadingSpinner from "../../components/LoadingSpinner";

const CredDefs: React.FC = () => {
    const AgentUrl = import.meta.env.VITE_ISSUER_API;
    const AgentKey = import.meta.env.VITE_ISSUER_KEY;

    //const AgentUrl = import.meta.env.VITE_EXAM_API;
    //const AgentKey = import.meta.env.VITE_EXAM_KEY;

    const [loading, setLoading] = useState(true);
    const [creddefs, setCredDefs] = useState([]);
    useEffect(() => {
        getCredDefs(AgentUrl, AgentKey)
            .then((res) => {
                if (res && res.data) {
                    console.log(res.data);
                    setCredDefs(res.data["credential_definition_ids"]);
                }
            })
            .catch(() => {
                message.error("Failed to get credential definition.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const cols = [
        {
            title: "#",
            dataIndex: "index",
            key: "index",
            align: "right" as const,
            width: "100px",
        },
        { title: "Creddefs ID", dataIndex: "creddef", key: "creddef" },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            align: "center" as const,
            width: "200px",
            render: () => (
                <div>
                    <Button
                        type="link"
                        icon={<EditFilled />}
                        danger
                        size="large"
                        onClick={() => console.log("")}
                        disabled
                    />
                    <Divider type="vertical" style={{ marginInline: "0" }} />
                    <Button
                        type="link"
                        icon={<DeleteFilled />}
                        danger
                        size="large"
                        onClick={() => console.log("")}
                        disabled
                    />
                </div>
            ),
        },
    ];
    const data = loading
        ? []
        : creddefs.map((row, index) => ({
              index: index + 1,
              creddef: row,
              key: row,
          }));

    return (
        <>
            <PageHeader
                title="Credential Definitions"
                links={[
                    {
                        target: "/creddefs/create",
                        label: "Create",
                        primary: true,
                    },
                ]}
            />
            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="page-content">
                    <div style={{ width: "100%", minHeight: "400px" }}>
                        <Table dataSource={data} columns={cols} />
                    </div>
                </div>
            )}
        </>
    );
};

export default CredDefs;
