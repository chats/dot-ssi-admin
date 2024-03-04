import { Button, Divider, Table, message } from "antd";
import { EditFilled, DeleteFilled } from "@ant-design/icons";
import PageHeader from "../../layouts/PageHeader";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getSchemas } from "../../utils/agent";

const Schemas: React.FC = () => {
    const AgentUrl = import.meta.env.VITE_ISSUER_API;
    const AgentKey = import.meta.env.VITE_ISSUER_KEY;

    const [loading, setLoading] = useState(true);
    const [schemas, setSchemas] = useState([]);

    useEffect(() => {
        getSchemas(AgentUrl, AgentKey)
            .then((res) => {
                if (res && res.data) {
                    setSchemas(res.data["schema_ids"]);
                }
            })
            .catch(() => {
                message.error("Failed to get schemas.");
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
        { title: "Schema ID", dataIndex: "schema", key: "schema" },
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
        : schemas.map((row, index) => ({
              index: index + 1,
              schema: row,
              key: row,
          }));

    return (
        <>
            <PageHeader
                title="Schema"
                links={[
                    {
                        target: "/schemas/create",
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

export default Schemas;
