import {
    Alert,
    Button,
    Form,
    Input,
    QRCode,
    Result,
    //Select,
    Spin,
    Steps,
} from "antd";
import PageHeader from "../../layouts/PageHeader";
//import { IdcardOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
//import { randomCid } from "../../utils/randValues";
import {
    createInvitation,
    createOffer,
    deleteConnection,
    //    requestExamData,
    sendOffer,
} from "../../utils/agent";
import { Link } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import {
    QrcodeOutlined,
    FileDoneOutlined,
    SolutionOutlined,
} from "@ant-design/icons";
//import dayjs from 'dayjs';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
    },
};

const ExamSeatDemo: React.FC = () => {
    const AgentUrl = import.meta.env.VITE_ISSUER_API;
    const AgentWss = import.meta.env.VITE_ISSUER_WSS;
    const AgentKey = import.meta.env.VITE_ISSUER_KEY;
    //    const ExamSeatId = import.meta.env.VITE_CREDDEF_EXAM_SEAT;
    const CredDefId = import.meta.env.VITE_CREDDEF_EXAM_TEST;
    //    const ExamDemoQr = "b82c0c1b-610c-4d46-b7d6-0638eccde5b3";
    //    const ExamDemoAPI =
    //("https://dot-staging-api.innovasive.dev/provider/exam/request/examinee/qr_code");
    //    const ExamDemoKey = "7p4AhBQN1BWD5xvqgyI";

    const [index, setIndex] = useState(0);
    const [qrLink, setQrLink] = useState("");
    const [connection_id, setConnectionId] = useState("");
    //    const [person, setPerson] = useState({})
    const [attrs, setAttrs] = useState({});
    const { lastMessage, readyState } = useWebSocket(
        `${AgentWss}?apikey=${AgentKey}`
    );

    const [loading, setLoading] = useState(false);
    // const [abandon, setAbandon] = useState(false);
    const [offerSent, setOfferSent] = useState(false);

    const handleSubmit = async (values: any) => {
        setAttrs(values);
        invite();
        setIndex((i) => i + 1);
    };

    const invite = async () => {
        setLoading(true);
        const inv = await createInvitation(AgentUrl, AgentKey);
        setConnectionId(inv["connection_id"]);
        setQrLink(inv["invitation_url"]);
        setLoading(false);
    };

    //const nextStep = () => {
    //    setIndex((i) => i + 1);
    //};

    /*
    const handleScanQr = async () => {
        console.log(JSON.stringify(license));
        const offer = createOffer(connection_id, CredDefId, license);
        console.log(JSON.stringify(offer));
        const offerResult = await sendOffer(AgentUrl, offer);
        console.log(offerResult);
        setIndex(2);
    };*/

    const sendCredentialOffer = async () => {
        setLoading(true);
        const offer = createOffer(connection_id, CredDefId, attrs);
        //        console.log(JSON.stringify(offer));
        const result = await sendOffer(AgentUrl, AgentKey, offer);

        return result;
    };

    const credentialAck = () => {
        setLoading(false);
        setIndex(2);
    };

    /*
    const credentialAbandon = () => {
        setLoading(false);
        setAbandon(true);
        setIndex(2);
    };
*/
    const goBackStep0 = async () => {
        setIndex(0);
        //setAbandon(false);
        setOfferSent(false);
        setLoading(false);
        // If go back to first step, should remove invition to avoid abandon connection
        await deleteConnection(AgentUrl, AgentKey, connection_id);
    };

    const [form] = Form.useForm();

    const setFormValues = async () => {
        //const data = await requestExamData(
        //    `${ExamDemoAPI}/${ExamDemoQr}`,
        //    ExamDemoKey
        //);
        //const participant = data["participant"];
        //const profile = participant["profile"];
        /*
        form.setFieldsValue({
            examiner_id: participant["examiner_id"],
            id_card_number: profile["profile"]["id_card_number"],
            exam_title: participant["exam_title"],
            exam_round: participant["exam_round"],
            general_start_exam_date: participant["general_start_exam_date"],
            general_end_exam_date: participant["general_end_exam_date"],
            location:
                participant["location"]["address"] +
                " " +
                participant["location"]["subdistrict_th"] +
                " " +
                participant["location"]["district_th"] +
                " " +
                participant["location"]["province_th"] +
                " " +
                participant["location"]["zip_code"],
            name_th:
                profile["title_name_th"] +
                profile["first_name_th"] +
                profile["last_name_th"],
            name_en:
                profile["title_name_en"] +
                profile["first_name_en"] +
                profile["last_name_en"],
            phone: profile["phone"],
            email: profile["email"],
        });
        */
        form.setFieldsValue({
            "examiner_id ": "6701000001",
            id_card_number: "9689517171674",
            exam_title:
                "การทดสอบความรู้ความสามารถในการเป็นมัคคุเทศก์ เดือนตุลาคม 2567  รูปแบบการทดสอบ ON-SITE (สอบในสถานที่)",
            exam_round: "รอบเช้า",
            general_start_exam_date: "2024-10-20 08:30:00",
            general_end_exam_date: "2024-10-20 10:30:00",
            location:
                "325 ถ.อรุณอมรินทร์ ศิริราช เขตบางกอกน้อย กรุงเทพมหานคร 10700",
            name_th: "นางสาว สุภาพร ชินวงศ์",
            name_en: "Miss Supaporn Chinwong",
            phone: "0971234567",
            email: "UserDot_12@mailinator.com",
        });
    };
    useEffect(() => {
        setFormValues();
    }, []);

    useEffect(() => {
        if (lastMessage !== null) {
            const data = JSON.parse(lastMessage.data);
            console.log(data);
            if (data["topic"] === "connections") {
                const state = data["payload"]["state"];
                const conid = data["payload"]["connection_id"];
                if (state == "active" && conid == connection_id) {
                    console.log("Try to send credential offer.");
                    sendCredentialOffer();
                }
            }
            if (
                data["topic"] === "issue_credential" &&
                connection_id === data["payload"]["connection_id"]
            ) {
                const state = data["payload"]["state"];
                if (state === "request_received") {
                    //setCredExId(data['payload']['credential_exchange_id'])
                }
                if (state === "offer_sent") {
                    setOfferSent(true);
                }
                //if (state === 'credential_acked' && cred_ex_id === data['payload']['credential_exchange_id']) {
                if (state === "credential_acked") {
                    credentialAck();
                }
                //if (state === 'abandoned' && cred_ex_id === data['payload']['credential_exchange_id']) {
                if (state === "abandoned") {
                    console.log("It's abandon");
                    // credentialAbandon();
                }
            }
        }
    }, [lastMessage, form]);
    //        }, [lastMessage]);

    const connectionStatus = {
        [ReadyState.CONNECTING]: "Connecting",
        [ReadyState.OPEN]: "Open",
        [ReadyState.CLOSING]: "Closing",
        [ReadyState.CLOSED]: "Closed",
        [ReadyState.UNINSTANTIATED]: "Uninstantiated",
    }[readyState];

    return (
        <>
            <PageHeader title="ข้อมูลการสมัครสอบ" />
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
                                title: "ตรวจสอบข้อมูล",
                                icon: <QrcodeOutlined />,
                            },
                            {
                                title: "สแกนรับเอกสาร",
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
                    style={{ width: "850px", height: "680px" }}
                >
                    {index == 0 && (
                        <div
                            style={{
                                minHeight: "400px",
                                color: "#555",
                                margin: "24px",
                            }}
                        >
                            <div style={{}}>
                                {/*<h1>ข้อมูลการสมัครสอบ</h1>*/}
                                <span>
                                    ข้อมูลในแบบฟอร์มนี้อาจได้มาจากเชื่อมโยงข้อมูลจากแอปพลิเคชันอื่น
                                    โปรตรวจสอบยืนยันความถูกต้อง
                                    หากมีข้อผิดพลาดโปรดทำการแก้ไขที่แอปพลิเคชันนั้น
                                    ๆ ก่อนดำเนินการต่อ
                                </span>
                            </div>
                            <div style={{ margin: "24px 0" }}>
                                <Form
                                    form={form}
                                    name="person_form"
                                    onFinish={handleSubmit}
                                >
                                    <Form.Item
                                        name="examiner_id "
                                        {...formItemLayout}
                                        label="เลขที่"
                                    >
                                        <Input style={{ width: "300px" }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="exam_title"
                                        {...formItemLayout}
                                        label="วิชาที่สอบ"
                                    >
                                        <Input style={{ width: "600px" }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="exam_round"
                                        {...formItemLayout}
                                        label="รอบสอบ"
                                    >
                                        <Input style={{ width: "300px" }} />
                                    </Form.Item>

                                    <Form.Item
                                        name="general_start_exam_date"
                                        {...formItemLayout}
                                        label="เวลาเริ่ม"
                                    >
                                        <Input style={{ width: "300px" }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="general_end_exam_date"
                                        {...formItemLayout}
                                        label="เวลาสิ้นสุด"
                                    >
                                        <Input style={{ width: "300px" }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="location"
                                        {...formItemLayout}
                                        label="สถานที่สอบ"
                                    >
                                        <Input style={{ width: "500px" }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="id_card_number"
                                        {...formItemLayout}
                                        label="เลขประจำตัวประชาชน"
                                    >
                                        <Input style={{ width: "300px" }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="name_th"
                                        {...formItemLayout}
                                        label="ชื่อ-สกุล (ไทย)"
                                    >
                                        <Input style={{ width: "300px" }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="name_en"
                                        {...formItemLayout}
                                        label="ชื่อ-สกุล (อังกฤษ)"
                                    >
                                        <Input style={{ width: "300px" }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="phone"
                                        {...formItemLayout}
                                        label="เบอร์โทรศัพท์"
                                    >
                                        <Input style={{ width: "300px" }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="email"
                                        {...formItemLayout}
                                        label="อีเมล"
                                    >
                                        <Input style={{ width: "300px" }} />
                                    </Form.Item>
                                    <Form.Item
                                        wrapperCol={{ offset: 5, span: 24 }}
                                    >
                                        <div style={{ marginTop: "20px" }}>
                                            <Button
                                                style={{ width: "120px" }}
                                                shape="round"
                                                type="primary"
                                                htmlType="submit"
                                            >
                                                ดำเนินการต่อ
                                            </Button>
                                        </div>
                                    </Form.Item>
                                </Form>
                            </div>
                            {/*
                            <div style={{background: '#fff', display: 'flex', justifyContent: 'center'}}>
                                <Button type='primary' onClick={handleSubmit}>Submit</Button>
                            </div>
                            */}
                        </div>
                    )}
                    {index == 1 && (
                        <>
                            {connectionStatus !== "Open" && (
                                <Alert
                                    message="Websocket Not Connected"
                                    showIcon
                                    description="Please refresh web application to initialized websocket connection."
                                    type="error"
                                    closable
                                />
                            )}
                            <div style={{ minHeight: "400px", margin: "24px" }}>
                                <div style={{}}>
                                    <h1>สแกนรับเอกสาร</h1>
                                    <span>
                                        ใช้แอปพลิเคชัน Mobile Wallet สแกน QR
                                        code เพื่อรับเอกสาร,
                                        ระบบจะทำการเชื่อมต่อระหว่าง Wallet
                                        ของผู้ออกเอกสารและผู้รับเอกสารแล้วทำการส่งเอกสารให้ผู้รับอัตโนมัติ
                                    </span>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        marginTop: "60px",
                                    }}
                                >
                                    {loading ? (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexFlow: "column",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                marginTop: "40px",
                                            }}
                                        >
                                            <Spin
                                                tip="รอดำเนินการ..."
                                                size="large"
                                            >
                                                <div
                                                    style={{
                                                        padding: "30px",
                                                        borderRadius: "4px",
                                                        width: "300px",
                                                    }}
                                                />
                                            </Spin>
                                            {offerSent && (
                                                <span
                                                    style={{
                                                        color: "#ffac00",
                                                        padding: "20px 0",
                                                    }}
                                                >
                                                    โปรดดำเนินการต่อบน Mobile
                                                    Wallet
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexFlow: "column",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <QRCode
                                                style={{ margin: "16px" }}
                                                size={200}
                                                errorLevel="L"
                                                value={qrLink}
                                            />
                                            <div
                                                style={{ textAlign: "center" }}
                                            >
                                                <p
                                                    style={{
                                                        fontSize: "16px",
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    Please scan QR code.
                                                </p>
                                                {/*
                                                <Button onClick={nextStep}>
                                                    Next
                                                </Button>
                                                 */}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    {/* 
                                <Button type="default" onClick={handleScanQr}>
                                    Scan QR Done
                                </Button>
                                */}
                                </div>
                            </div>
                        </>
                    )}
                    {index == 2 && (
                        <div style={{ minHeight: "400px", marginTop: "60px" }}>
                            <Result
                                status="success"
                                title="ออกเอกสาร VC ใบเข้าสอบแล้ว"
                                subTitle="ออกเอกสารใบเข้่าสอบ Verifiable Credential และส่งไปยัง Wallet ผู้ถือเอกสารเรียบร้อยแล้ว."
                                extra={[
                                    <Link to="/">
                                        <Button
                                            style={{ width: "150px" }}
                                            shape="round"
                                            type="primary"
                                            key="console"
                                        >
                                            ไปยังหน้าหลัก
                                        </Button>
                                    </Link>,
                                    <Button
                                        style={{ width: "150px" }}
                                        shape="round"
                                        key="issue"
                                        onClick={goBackStep0}
                                    >
                                        ออกเอกสารอีกครั้ง
                                    </Button>,
                                ]}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ExamSeatDemo;
