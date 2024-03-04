import { Button, Divider, Table, message } from "antd";
import LoadingSpinner from "../../components/LoadingSpinner";
import PageHeader from "../../layouts/PageHeader";
import { EditFilled, DeleteFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";

const AgentUrl = import.meta.env.VITE_VERIFIER_AGENT_URL;

const ProofRecords: React.FC = () => {
    const [loading, setloading] = useState(true);
    const [proofRecords, setProofRecords] = useState([]);

    const handleDelete = (pres_ex_id: string) => {
        console.log("delete " + pres_ex_id);
        axios
            .delete(`${AgentUrl}/present-proof/records/${pres_ex_id}`, {
                signal: AbortSignal.timeout(5000),
            })
            .then(() => {
                message.success(
                    `Presentation exchange id ${pres_ex_id} deleted`
                );
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setloading(false);
            });
    };

    const cols = [
        {
            title: "#",
            dataIndex: "index",
            key: "index",
            align: "right" as const,
            width: "100px",
        },
        {
            title: "Presentation Exchange ID",
            dataIndex: "pres_ex_id",
            key: "pres_ex_id",
        },
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Created At", dataIndex: "created_at", key: "created_at" },
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
                        onClick={() => handleDelete(record["pres_ex_id"])}
                    />
                </div>
            ),
        },
    ];

    const data = loading
        ? []
        : proofRecords.map((row, index) => ({
              index: index + 1,
              pres_ex_id: row["presentation_exchange_id"],
              name: row["presentation_request"]["name"],
              created_at: row["created_at"],
              state: row["state"],
              key: row["presentation_exchange_id"],
          }));

    useEffect(() => {
        axios
            .get(`${AgentUrl}/present-proof/records`, {
                signal: AbortSignal.timeout(5000),
            })
            .then((res) => {
                setProofRecords(res.data["results"]);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setloading(false);
            });
    });

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

export default ProofRecords;
