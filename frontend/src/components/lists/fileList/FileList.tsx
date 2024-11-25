"use client"

import React, {useState} from 'react';
import styles from "./fileList.module.scss";
import { useQuery, useMutation, gql } from '@apollo/client';
import {Button, Flex, Input, Modal} from "antd";
import {PlusOutlined} from "@ant-design/icons";

const GET_FILES = gql`
  query {
    root {
      folders {
        id
        name
        files {
          id
          name
        }
      }
    }
  }
`;

const CREATE_FILE = gql`
  mutation CreateFile($name: String!, $content: String!) {
    createFile(name: $name, content: $content) {
      id
      name
      content
    }
  }
`;

const MOVE_FILE = gql`
  mutation MoveFile($id: ID!, $folderId: ID!) {
    MoveFile(id: $id, folderId: $folderId)
  }
`;

const FileList = ({ folder, onSelectFile }: { folder: string, onSelectFile: (file: string) => void }) => {
    const { loading, error, data, refetch } = useQuery(GET_FILES);
    const [createFile, { data: mutationData, loading: mutationLoading, error: mutationError }] = useMutation(CREATE_FILE);
    const [moveFile] = useMutation(MOVE_FILE);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [content, setContent] = useState('');

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleCreateFile = async () => {
        try {
            const response = await createFile({ variables: { name, content } });
            const newFileId = response.data.createFile.id;
            const currentFolder = data.root.folders.find((f: { name: string }) => f.name === folder);

            if (currentFolder) {
                await moveFile({ variables: { id: newFileId, folderId: currentFolder.id } });
                await refetch();
                setIsModalOpen(false);
            } else {
                console.error('Current folder not found');
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error:', error.message);
            } else {
                console.error('Unknown error:', error);
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const selectedFolder = data.root.folders.find((f: { name: string }) => f.name === folder);

    return (
        <div>
            <p className={styles.title}>{folder}</p>
            <Button type="primary" onClick={showModal}>
                <PlusOutlined />
            </Button>
            <Modal title="Create file" open={isModalOpen} onOk={handleCreateFile} onCancel={handleCancel}>
                <Flex vertical gap={"10px"}>
                    <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <Input placeholder="Description" value={content} onChange={(e) => setContent(e.target.value)} />

                    {mutationLoading && <p>Creating file...</p>}
                    {mutationError && <p>Error: {mutationError.message}</p>}
                    {mutationData && <p>File created: {mutationData.createFile.name}</p>}
                </Flex>
            </Modal>
            <div className={styles.files_list}>
                {selectedFolder.files.map((file: { name: string }) => (
                    <div className={styles.files} key={file.name} onClick={() => onSelectFile(file.name)}>
                        {file.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileList;
