import { Button, Divider, Table, message } from "antd";
import LoadingSpinner from "../../components/LoadingSpinner";
import PageHeader from "../../layouts/PageHeader";
import { EditFilled, DeleteFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";

//const AgentUrl = import.meta.env.VITE_EXAM_API;
//const AgentKey = import.meta.env.VITE_EXAM_KEY;
const AgentUrl = import.meta.env.VITE_ISSUER_API;
const AgentKey = import.meta.env.VITE_ISSUER_KEY;

const IssuedCredentialRecords: React.FC = () => {
    const [loading, setloading] = useState(true);
    const [proofRecords, setProofRecords] = useState([]);

    const handleDelete = (cred_ex_id: string) => {
        console.log("delete " + cred_ex_id);
        axios
            .delete(`${AgentUrl}/issue-credential/records/${cred_ex_id}`, {
                signal: AbortSignal.timeout(5000),
                headers: { apikey: AgentKey },
            })
            .then(() => {
                message.success(
                    `Presentation exchange id ${cred_ex_id} deleted`
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
            title: "Credential Exchange ID",
            dataIndex: "cred_ex_id",
            key: "cred_ex_id",
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
                        onClick={() => handleDelete(record["cred_ex_id"])}
                    />
                </div>
            ),
        },
    ];

    const data = loading
        ? []
        : proofRecords.map((row, index) => ({
              index: index + 1,
              cred_ex_id: row["credential_exchange_id"],
              name: row["credential_proposal_dict"]["comment"],
              created_at: row["created_at"],
              state: row["state"],
              key: row["presentation_exchange_id"],
          }));

    useEffect(() => {
        axios
            .get(`${AgentUrl}/issue-credential/records`, {
                signal: AbortSignal.timeout(5000),
                headers: { apikey: AgentKey },
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

export default IssuedCredentialRecords;
