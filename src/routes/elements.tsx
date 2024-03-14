import { ElementType, Suspense, lazy } from "react";
import LoadingScreen from "../components/LoadingScreen";

const Loadable = (Component: ElementType) => (props: any) =>
    (
        <Suspense fallback={<LoadingScreen />}>
            <Component {...props} />
        </Suspense>
    );

export const HomePage = Loadable(lazy(() => import("../pages/HomePage")));

export const ConnectionPage = Loadable(
    lazy(() => import("../pages/admins/ConnectionPage"))
);

export const IssuedCredentialRecords = Loadable(
    lazy(() => import("../pages/admins/IssuedCredentialRecord"))
);

export const ProofRecords = Loadable(
    lazy(() => import("../pages/admins/ProofRecords"))
);
export const SchemaPage = Loadable(
    lazy(() => import("../pages/ledgers/Schemas"))
);
export const PersonPage = Loadable(
    lazy(() => import("../pages/vcs/PersonPage"))
);
export const TouristGuideLicense = Loadable(
    lazy(() => import("../pages/vcs/TouristGuideLicense"))
);

export const ExamSeat = Loadable(lazy(() => import("../pages/vcs/ExamSeat")));
export const ExamCert = Loadable(lazy(() => import("../pages/vcs/ExamCert")));
export const ExamSeatDemo = Loadable(
    lazy(() => import("../pages/vcs/ExamSeatDemo"))
);

export const VerifyTouristGuideLicense = Loadable(
    lazy(() => import("../pages/proofs/VerifyTouristGuideLicense"))
);
export const CreateSchema = Loadable(
    lazy(() => import("../pages/ledgers/CreateSchema"))
);
export const Error403 = Loadable(
    lazy(() => import("../pages/errors/Error403"))
);
export const Error404 = Loadable(
    lazy(() => import("../pages/errors/Error404"))
);
