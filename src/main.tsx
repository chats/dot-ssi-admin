import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ConfigProvider, theme } from "antd";
import thTH from "antd/locale/th_TH";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ConfigProvider
            locale={thTH}
            theme={{
                algorithm: theme.defaultAlgorithm,
                token: {
                    // Seed Token
                    //colorPrimary: '#531dab',
                    colorPrimary: "#303F9F",
                    //colorPrimary: '#584A95',
                    //colorPrimary: '#4B3998',
                    borderRadius: 4,
                    //fontFamily: " 'Open Sans','Noto Sans Thai', sans-serif",
                    fontFamily: "'Noto Sans Thai', sans-serif",
                    //fontSize: 16,
                    //fontWeightStrong: 400,

                    // Alias Token
                    //colorBgContainer: '#E3F2FD',
                },
                components: {
                    /*
                    Button: {
                        defaultColor: "#6236A9",
                        defaultBorderColor: "#6236A9",
                        defaultBg: "#F7F3FF",

                        algorithm: true,
                    },
                    */
                },
            }}
        >
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ConfigProvider>
    </React.StrictMode>
);
