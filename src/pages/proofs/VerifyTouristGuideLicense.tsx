import { useNavigate } from "react-router-dom";
import {
    Predicate,
    createInvitation,
    createPresentation,
    deleteConnection,
    getRevealedAttrs,
    sendPresentationRequest,
} from "../../utils/agent";
import { useEffect, useState } from "react";
import { Button, Form, Input, QRCode, Result, Spin, Steps } from "antd";
import LoadingSpinner from "../../components/LoadingSpinner";
import PageHeader from "../../layouts/PageHeader";
import {
    QrcodeOutlined,
    FileDoneOutlined,
    SolutionOutlined,
    ArrowLeftOutlined,
    CheckCircleTwoTone,
} from "@ant-design/icons";
import useWebSocket from "react-use-websocket";
//import moment from "moment";

const VerifyTouristGuideLicense: React.FC = () => {
    const navigate = useNavigate();

    const AgentUrl = import.meta.env.VITE_VERIFIER_API;
    const AgentWss = import.meta.env.VITE_VERIFIER_WSS;
    const AgentKey = import.meta.env.VITE_VERIFIER_KEY;
    const CredDefId = import.meta.env.VITE_TOURIST_GUIDE_LICENSE_CREDDEFS_ID;

    const RequiredAttributes = ["license_no", "region_id", "name_th", "gender"];
    //const Predicates: Predicate[] = [
    //    { name: "expiry_date", type: ">=", value: 20230909 },
    //];
    /*
    const Predicates: Predicate[] = [
        {
            name: "expiry_date",
            type: ">=",
            value: parseInt(moment(Date.now()).format("YYYYMMDD")),
        },
    ];*/
    const Predicates: Predicate[] = [];

    const [start, setStart] = useState(true);
    const [index, setIndex] = useState(0);
    const [qrLink, setQrLink] = useState("");
    const [connection_id, setConnectionId] = useState("");
    const [loading, setLoading] = useState(false);
    const [abandon, setAbandon] = useState(false);
    //    const [pres_ex_id, setPresExId] = useState('')

    const getStart = async () => {
        setStart(false);
        invite();
    };

    const invite = async () => {
        setLoading(true);
        const inv = await createInvitation(AgentUrl, AgentKey);
        setConnectionId(inv["connection_id"]);
        setQrLink(inv["invitation_url"]);
        setLoading(false);
    };

    const requestPresentation = async () => {
        setLoading(true);
        const proofName = "Verify Drug Prescription";
        const presentation = createPresentation(
            CredDefId,
            proofName,
            connection_id,
            RequiredAttributes,
            Predicates
        );
        //console.log(JSON.stringify(presentation))
        await sendPresentationRequest(AgentUrl, AgentKey, presentation);
        //console.log(JSON.stringify(presentResult))
        setIndex((i) => i + 1);
    };

    const goBackStep0 = async () => {
        setStart(true);
        setFormValues(null);
        setIndex(0);
        // If go back to first step, should remove invition to avoid abandon connection
        await deleteConnection(AgentUrl, AgentKey, connection_id);
    };

    const finish = () => {
        setLoading(false);
        setIndex(2);
    };

    const cancel = () => {
        setLoading(false);
        goBackStep0();
    };

    const requestDeclined = () => {
        setAbandon(true);
        setIndex(2);
        setLoading(false);
    };

    const credentialVerified = async (pres_ex_id: string) => {
        //setLoading(true)
        const revealed = await getRevealedAttrs(AgentUrl, AgentKey, pres_ex_id);
        setFormValues(revealed);
        //setIndex(2)
        setLoading(false);
    };

    const setFormValues = (revealed: any) => {
        if (revealed == null) {
            form.setFieldsValue({
                license_no: "",
                region_id: "",
                name_th: "",
                gender: "",
            });
        } else {
            form.setFieldsValue({
                license_no: revealed["license_no"]["raw"],
                region_id: revealed["region_id"]["raw"],
                name_th: revealed["name_th"]["raw"],
                gender: revealed["gender"]["raw"],
            });
        }
    };

    const { lastMessage } = useWebSocket(`${AgentWss}?apikey=${AgentKey}`);

    const [form] = Form.useForm();

    useEffect(() => {
        if (lastMessage !== null) {
            // Checking webhook event from verifier agent.
            const data = JSON.parse(lastMessage.data);
            console.log(data);
            if (data["topic"] === "connections") {
                if (
                    data["payload"]["state"] == "active" &&
                    connection_id == data["payload"]["connection_id"]
                ) {
                    console.log("Try to request presentation.");
                    requestPresentation();
                }
            }
            if (
                data["topic"] === "present_proof" &&
                connection_id == data["payload"]["connection_id"]
            ) {
                if (data["payload"]["state"] == "request_sent") {
                    // Do something if request sent.
                }
                if (data["payload"]["state"] == "abandoned") {
                    requestDeclined();
                }
                if (data["payload"]["state"] == "verified") {
                    credentialVerified(
                        data["payload"]["presentation_exchange_id"]
                    );
                }
            }
        }
    }, [start, index, qrLink, lastMessage]);

    /*
    const connectionStatus = {
        [ReadyState.CONNECTING]: "Connecting",
        [ReadyState.OPEN]: "Open",
        [ReadyState.CLOSING]: "Closing",
        [ReadyState.CLOSED]: "Closed",
        [ReadyState.UNINSTANTIATED]: "Uninstantiated",
    }[readyState];
    */

    return (
        <>
            <PageHeader title="Verify Tourist Guide License" />
            <div className="page-content">
                <div
                    className="vertical-steps-container"
                    style={{
                        width: "650px",
                        display: "flex",
                        flexFlow: "row",
                        alignContent: "center",
                        marginTop: "20px",
                        marginBottom: "20px",
                    }}
                >
                    <Steps
                        current={index}
                        items={[
                            {
                                title: "เชื่อม Wallet",
                                icon: <QrcodeOutlined />,
                            },
                            {
                                title: "ตรวจสอบข้อมูล",
                                icon: <SolutionOutlined />,
                            },
                            {
                                title: "เสร็จสิ้น",
                                icon: <FileDoneOutlined />,
                            },
                        ]}
                    />
                </div>
                <div
                    className="page-content-right"
                    style={{ width: "850px", height: "500px" }}
                >
                    {/* -----------------------STEP 0------------------------------------------ */}
                    {index == 0 && (
                        <>
                            {start ? (
                                <div
                                    style={{
                                        padding: "0 24px",
                                    }}
                                >
                                    <h1 style={{ fontSize: "24px" }}>
                                        เชื่อมต่อกับ Wallet
                                    </h1>
                                    <span>
                                        โปรดเตรียมความพร้อมสำหรับการตรวจสอบข้อมูล
                                        ต้องมีโทรศัพท์มือถือที่ติดตั้ง SSI
                                        Wallet
                                    </span>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexFlow: "column",
                                            justifyContent: "center",
                                            margin: "40px 0",
                                            alignItems: "center",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                flexFlow: "column",
                                                justifyContent: "center",
                                                background: "#fff",
                                                borderRadius: "5px",
                                                border: "2px solid #eee",
                                                width: "650px",
                                                height: "320px",
                                            }}
                                        >
                                            <h3 style={{ alignSelf: "center" }}>
                                                โปรดเตรียม Mobile Wallet App
                                            </h3>
                                            <span
                                                style={{ alignSelf: "center" }}
                                            >
                                                เมื่อพร้อม คลิก 'ถัดไป'
                                                เพื่อดำเนินการต่อ
                                            </span>
                                            <Button
                                                style={{
                                                    marginTop: "40px",
                                                    width: "100px",
                                                    alignSelf: "center",
                                                }}
                                                type="primary"
                                                shape="round"
                                                onClick={getStart}
                                            >
                                                ถัดไป
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    style={{
                                        padding: "0 24px",
                                        height: "420px",
                                    }}
                                >
                                    <h1 style={{ fontSize: "24px" }}>
                                        สแกน QR code
                                        เพื่อตรวจสอบใบอนุญาตเป็นมัคคุเทศก์
                                    </h1>
                                    <span>
                                        ใช้โทรศัพท์มือถือที่ติดตั้ง SSI Wallet
                                        แล้วสแกน QR code เพื่อขอรับการตรวจสอบ
                                    </span>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            margin: "60px 0",
                                        }}
                                    >
                                        {loading ? (
                                            <div
                                                style={{
                                                    height: "300px",
                                                    width: "550px",
                                                    display: "flex",
                                                    flexFlow: "column",
                                                }}
                                            >
                                                <LoadingSpinner />
                                                <Button
                                                    style={{
                                                        marginTop: "24px",
                                                        maxWidth: "80px",
                                                        alignSelf: "center",
                                                    }}
                                                    shape="round"
                                                    onClick={cancel}
                                                >
                                                    ยกเลิก
                                                </Button>
                                            </div>
                                        ) : (
                                            <QRCode
                                                style={{ margin: "16px" }}
                                                size={200}
                                                errorLevel="L"
                                                value={qrLink}
                                                //icon="/ramafound-trans.png"
                                            />
                                        )}
                                    </div>
                                    <div
                                        className="steps-controls"
                                        style={{
                                            display: "flex",

                                            justifyContent: "spece-beetween",
                                        }}
                                    >
                                        <Button
                                            type="link"
                                            icon={<ArrowLeftOutlined />}
                                            onClick={goBackStep0}
                                        >
                                            ย้อนกลับ
                                        </Button>
                                        <span />
                                        {/*
                                        <Button
                                            type="primary"
                                            shape="round"
                                            disabled
                                        >
                                            ถัดไป
                                        </Button>
                                         */}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    {/* -----------------------STEP 1------------------------------------------ */}
                    {index == 1 && (
                        <>
                            <div style={{ padding: "0 24px" }}>
                                <h1 style={{ fontSize: "24px" }}>
                                    ตรวจสอบบันทึกข้อมูล
                                </h1>
                                <span>
                                    ตรวจสอบและบันทึกข้อมูลใบอนุญาตเป็นมัคคุเทศก์
                                    (Revealed Attibutes)
                                </span>
                            </div>
                            <div style={{ padding: "24px" }}>
                                <div
                                    style={{
                                        height: "84px",
                                        display: "flex",
                                        flexFlow: "column",
                                        alignItems: "center",
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <Spin size="large">
                                                <div
                                                    style={{
                                                        padding: "30px",
                                                        borderRadius: "4px",
                                                        width: "300px",
                                                    }}
                                                />
                                            </Spin>
                                            <span style={{ color: "#ffac00" }}>
                                                โปรดดำเนินการต่อบนโทรศัพท์มือถือ
                                            </span>
                                        </>
                                    ) : (
                                        <CheckCircleTwoTone
                                            twoToneColor="#52c41a"
                                            style={{
                                                fontSize: "32px",
                                                marginTop: "16px",
                                            }}
                                        />
                                    )}
                                </div>
                                <Form
                                    form={form}
                                    name="pesc_form"
                                    labelCol={{ span: 6 }}
                                    wrapperCol={{ span: 16 }}
                                    style={{ width: "100%" }}
                                >
                                    <Form.Item
                                        name="license_no"
                                        label="เลขที่ใบอนุญาติ"
                                    >
                                        <Input readOnly />
                                    </Form.Item>
                                    <Form.Item
                                        name="region_id"
                                        label="รหัสภูมิภาค"
                                    >
                                        <Input readOnly />
                                    </Form.Item>
                                    <Form.Item
                                        name="name_th"
                                        label="ชื่อ - สกุล"
                                    >
                                        <Input readOnly />
                                    </Form.Item>
                                    <Form.Item name="gender" label="เพศ">
                                        <Input readOnly />
                                    </Form.Item>
                                </Form>
                            </div>
                            <div
                                className="steps-controls"
                                style={{
                                    display: "flex",
                                    flexFlow: "row",
                                    justifyContent: "center",
                                }}
                            >
                                <Button
                                    style={{ width: "100px" }}
                                    type="primary"
                                    shape="round"
                                    onClick={finish}
                                    disabled={loading}
                                >
                                    ถัดไป
                                </Button>
                            </div>
                        </>
                    )}
                    {/* -----------------------STEP 2------------------------------------------ */}
                    {index == 2 && (
                        <>
                            {abandon ? (
                                <Result
                                    status="warning"
                                    title="ปฏิเสธการตรวจสอบ"
                                    subTitle="ท่านได้ปฏิเสธการตรวจสอบใบอนุญาตเป็นมัคคุเทศก์ หากต้องการตรวจใบอนุญาตเป็นมัคคุเทศก์โปรดเริ่มขั้นตอนใหม่อีกครั้ง หากเกิดจากปัญหาข้อบกพร่องของระบบโปรดแจ้งผู้ดูแลระบบเพื่อดำเนินการแก้ไข "
                                    extra={[
                                        <Button
                                            type="primary"
                                            onClick={() => navigate("/")}
                                        >
                                            กลับหน้าหลัก
                                        </Button>,
                                        <Button onClick={goBackStep0}>
                                            เริ่มใหม่
                                        </Button>,
                                    ]}
                                />
                            ) : (
                                <Result
                                    status="success"
                                    title="ตรวจสอบใบอนุญาตเป็นมัคคุเทศก์แล้ว"
                                    subTitle="ใบอนุญาตเป็นมัคคุเทศก์ได้รับการตรวจสอบความถูกต้องและบันทึกข้อมูลลงในระบบแล้ว"
                                    extra={[
                                        <Button
                                            type="primary"
                                            onClick={() => navigate("/")}
                                        >
                                            กลับหน้าหลัก
                                        </Button>,
                                        <Button onClick={goBackStep0}>
                                            เริ่มใหม่
                                        </Button>,
                                    ]}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default VerifyTouristGuideLicense;
