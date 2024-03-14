import {
    HomeOutlined,
    ClearOutlined,
    CreditCardOutlined,
    AuditOutlined,
} from "@ant-design/icons";

const navigation = [
    { label: "Home", key: "/", icon: <HomeOutlined /> },
    //{ label: 'Connections', key: '/connections', icon: <ApartmentOutlined />},
    /*
    { label: "Schemas", key: "/schema", icon: <DatabaseOutlined /> },
    */
    {
        label: "Ledgers",
        key: "/ledgers",
        icon: <ClearOutlined />,
        children: [
            { label: "Schema", key: "/schemas" },
            { label: "Creddefs", key: "/creddefs" },
        ],
    },

    {
        label: "Issue Credential",
        key: "/credentials",
        icon: <CreditCardOutlined />,
        children: [
            //{ label: 'Person', key: '/person', },
            //{ label: "Exam Seat", key: "/exam-seat" },
            { label: "Exam Demo", key: "/exam-demo" },
            //{ label: "Exam Certificate", key: "/exam-cert" },
            { label: "Tourist Guide License", key: "/tourist-guide-license" },
            //{ label: 'E-Exam Certificate', key: '/e-exam-cert',}
        ],
    },

    {
        label: "Present Proof",
        key: "/proofs",
        icon: <AuditOutlined />,
        children: [
            { label: "Verify Guide License", key: "/verify-guide-license" },
            //{ label: 'Verify Guide License (2)', key: '/verify-guide-license2', }
        ],
    },
    {
        label: "Admin",
        key: "/clear",
        icon: <ClearOutlined />,
        children: [
            { label: "Connections", key: "/connections" },
            { label: "Credential Offers", key: "/credential-offers" },
            { label: "Issued Credential Records", key: "/issue-cred-records" },
            { label: "Proofs Records", key: "/proof-records" },
        ],
    },
    //{ label: 'DOT Admin', key: '/proofs-dot', icon: <AuditOutlined />, children: [
    //  { label: 'Verify E-Exam', key: '/verify-e-exam', },
    //]},
];

export default navigation;
