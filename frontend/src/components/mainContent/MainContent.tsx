import React from "react";
import {useState} from "react";
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import FileList from "@/components/lists/fileList/FileList";
import FileEditor from "@/components/fileEditor/FileEditor";
import FolderList from "@/components/lists/folderList/FolderList";

const { Content, Sider } = Layout;

const siderItems: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
    (icon, index) => {
        const key = String(index + 1);

        return {
            key: `sub${key}`,
            icon: React.createElement(icon),
            label: `subnav ${key}`,

            children: new Array(4).fill(null).map((_, j) => {
                const subKey = index * 4 + j + 1;
                return {
                    key: subKey,
                    label: `option${subKey}`,
                };
            }),
        };
    },
);

const MainContent = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    const handleBreadcrumbClick = (item: string) => {
        if (item === 'Accueil') {
            setSelectedFolder(null);
            setSelectedFile(null);
        } else if (item === selectedFolder) {
            setSelectedFile(null);
        }
    };

    const generateBreadcrumbItems = () => {
        const items = [{ title: 'Accueil', onClick: () => handleBreadcrumbClick('Accueil') }];
        if (selectedFolder) {
            items.push({ title: selectedFolder, onClick: () => handleBreadcrumbClick(selectedFolder) });
        }
        if (selectedFile) {
            items.push({
                onClick(): void {
                }, title: selectedFile });
        }
        return items;
    };


    return (
        <Layout style={{ height: '100vh' }}
        >
            <Layout>
                <Sider width={200} style={{ background: colorBgContainer }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{ height: '100%', borderRight: 0 }}
                        items={siderItems}
                    />
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Breadcrumb
                        items={generateBreadcrumbItems()}
                        style={{ margin: '16px 0', cursor: 'pointer' }}
                    />
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {!selectedFolder && <FolderList onSelectFolder={setSelectedFolder} />}
                        {selectedFolder && !selectedFile && <FileList folder={selectedFolder} onSelectFile={setSelectedFile} />}
                        {selectedFile && <FileEditor file={selectedFile} />}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default MainContent;