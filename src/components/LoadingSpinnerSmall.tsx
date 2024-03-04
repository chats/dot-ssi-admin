import { Spin } from "antd";

const LoadingSpinnerSmall: React.FC = () => {
    return (
        <>
            <Spin size="default">
                <div
                    style={{
                        padding: "20px",
                        background: "rgba(0,0,0,0.2",
                        borderRadius: "4px",
                    }}
                />
            </Spin>
        </>
    );
};

export default LoadingSpinnerSmall;
