import { Button, Divider, Table, message } from "antd";
import { EditFilled, DeleteFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import PageHeader from "../../layouts/PageHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import { deleteConnection, getConnections } from "../../utils/agent";

const AgentUrl = import.meta.env.VITE_ISSUER_API;
const AgentKey = import.meta.env.VITE_ISSUER_KEY;

const ConnectionPage: React.FC = () => {
    const [loading, setloading] = useState(true);
    const [connections, setConnections] = useState([]);

    const handleDelete = (connection_id: string) => {
        console.log("delete " + connection_id);
        deleteConnection(AgentUrl, AgentKey, connection_id)
            .then(() => {
                message.success(`Connection id ${connection_id} deleted`);
                reloadData();
            })
            .catch(() => {
                message.error(
                    `Cannot deletete connection ${connection_id} deleted`
                );
            });
    };

    const reloadData = () => {
        getConnections(AgentUrl, AgentKey).then((res) => {
            setConnections(res!.data["results"]);
        });
    };

    useEffect(() => {
        reloadData();
        setloading(false);
    }, []);

    const cols = [
        {
            title: "#",
            dataIndex: "index",
            key: "index",
            align: "right" as const,
            width: "100px",
        },
        { title: "Connection ID", dataIndex: "connection", key: "connection" },
        { title: "Their DID", dataIndex: "did", key: "did" },
        { title: "Their Label", dataIndex: "label", key: "label" },
        { title: "State", dataIndex: "state", key: "state" },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            align: "center" as const,
            width: "200px",
            render: (_: any, record: any) => (
                <div>
                    <Button
                        type="link"
                        icon={<EditFilled />}
                        danger
                        size="large"
                        onClick={() => console.log(record)}
                        disabled
                    />
                    <Divider type="vertical" style={{ marginInline: "0" }} />
                    <Button
                        type="link"
                        icon={<DeleteFilled />}
                        danger
                        size="large"
                        onClick={() => handleDelete(record["connection"])}
                    />
                </div>
            ),
        },
    ];
    const data = loading
        ? []
        : connections.map((row, index) => ({
              index: index + 1,
              connection: row["connection_id"],
              label: row["their_label"],
              did: row["their_did"],
              state: row["state"],
              key: row["connection_id"],
          }));

    return (
        <>
            <PageHeader title="Connections" />
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

export default ConnectionPage;
