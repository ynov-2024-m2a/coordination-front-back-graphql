import React from "react";
import { useState } from "react";
import { FolderOutlined, FileOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import FileList from "@/components/lists/fileList/FileList";
import FileEditor from "@/components/fileEditor/FileEditor";
import FolderList from "@/components/lists/folderList/FolderList";
import { useQuery, gql } from "@apollo/client";

const { Content, Sider } = Layout;

const GET_FILES = gql`
  query {
    root {
      folders {
        name
        files {
          name
        }
      }
    }
  }
`;

const MainContent = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const { loading, error, data } = useQuery(GET_FILES);

  console.log(data )  

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error("GraphQL Error:", error);
    return <p>Error: {error.message}</p>;
  }

  const siderItems: MenuProps["items"] = data.root.folders.map(
    (folder: any, index: number) => {
      const key = String(index + 1);
      return {
        key: `sub${key}`,
        icon: <FolderOutlined />,
        label: folder.name,
        children: folder.files.map((file: any, subIndex: number) => ({
          key: `${key}-${subIndex + 1}`,
          icon: <FileOutlined />,
          label: file.name,
        })),
      };
    }
  );
  const handleBreadcrumbClick = (item: string) => {
    if (item === "Accueil") {
      setSelectedFolder(null);
      setSelectedFile(null);
    } else if (item === selectedFolder) {
      setSelectedFile(null);
    }
  };

  const generateBreadcrumbItems = () => {
    const items = [
      { title: "Accueil", onClick: () => handleBreadcrumbClick("Accueil") },
    ];
    if (selectedFolder) {
      items.push({
        title: selectedFolder,
        onClick: () => handleBreadcrumbClick(selectedFolder),
      });
    }
    if (selectedFile) {
      items.push({
        onClick(): void {},
        title: selectedFile,
      });
    }
    return items;
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
            items={siderItems}
          />
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Breadcrumb
            items={generateBreadcrumbItems()}
            style={{ margin: "16px 0", cursor: "pointer" }}
          />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}>
            {!selectedFolder && (
              <FolderList onSelectFolder={setSelectedFolder} />
            )}
            {selectedFolder && !selectedFile && (
              <FileList
                folder={selectedFolder}
                onSelectFile={setSelectedFile}
              />
            )}
            {selectedFile && <FileEditor file={selectedFile} />}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainContent;
