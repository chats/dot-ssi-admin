import { Button, Layout, Menu, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import { useNavigate } from "react-router-dom";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { useState } from "react";
import AppRouter from "./routes";
import navigation from "./routes/navigations";

const App: React.FC = () => {
    const navigate = useNavigate();

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout style={{ height: "100vh" }}>
            <Sider
                width="250"
                theme="light"
                trigger={null}
                collapsible
                collapsed={collapsed}
            >
                <div className="brand">
                    <img src="./dot-logo-240.png" />
                    <h1>DOT SSI Admin</h1>
                </div>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={["/home"]}
                    defaultOpenKeys={["/proofs", "/credentials"]}
                    items={navigation}
                    onClick={({ key }) => {
                        //if (key === "signout") {
                        //TODO: create sign out feature.
                        //} else {
                        navigate(key);
                        //}
                    }}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={
                            collapsed ? (
                                <MenuUnfoldOutlined />
                            ) : (
                                <MenuFoldOutlined />
                            )
                        }
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: "16px",
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content
                    style={{
                        margin: "24px 16px",
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                    }}
                >
                    <AppRouter />
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;
