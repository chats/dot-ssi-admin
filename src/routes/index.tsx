import { useRoutes } from "react-router-dom";
import {
    ConnectionPage,
    CreateSchema,
    Error403,
    Error404,
    ExamCert,
    ExamSeat,
    ExamSeatDemo,
    HomePage,
    IssuedCredentialRecords,
    ProofRecords,
    SchemaPage,
    TouristGuideLicense,
    VerifyTouristGuideLicense,
} from "./elements";
import LoginCallback from "../auth/login-callback";
import LogoutCallback from "../auth/logout-callback";
import CredDefs from "../pages/ledgers/CredDefs";
import CreateCredDefs from "../pages/ledgers/CreateCredDefs";

const AppRouter: React.FC = () => {
    return useRoutes([
        {
            path: "/",
            element: <HomePage />,
        },
        {
            path: "/schemas",
            element: <SchemaPage />,
        },
        {
            path: "/schemas/create",
            element: <CreateSchema />,
        },
        {
            path: "/creddefs",
            element: <CredDefs />,
        },
        {
            path: "/creddefs/create",
            element: <CreateCredDefs />,
        },
        {
            path: "/connections",
            element: <ConnectionPage />,
        },
        {
            path: "/issue-cred-records",
            element: <IssuedCredentialRecords />,
        },
        {
            path: "/proof-records",
            element: <ProofRecords />,
        },
        {
            path: "/person",
            element: (
                //<PersonPage/>
                <Error403 />
            ),
        },
        {
            path: "/exam-seat",
            element: <ExamSeat />,
        },
        {
            path: "/exam-demo",
            element: <ExamSeatDemo />,
        },
        {
            path: "/exam-cert",
            element: <ExamCert />,
        },
        {
            path: "/tourist-guide-license",
            element: <TouristGuideLicense />,
        },
        {
            path: "/verify-guide-license",
            element: <VerifyTouristGuideLicense />,
        },
        {
            path: "/login-callback",
            element: <LoginCallback />,
        },
        {
            path: "/logout-callback",
            element: <LogoutCallback />,
        },
        //{ path: "*", element: <Navigate to="/404" replace /> },
        {
            path: "*",
            element: <Error404 />,
        },
    ]);
};

export default AppRouter;
