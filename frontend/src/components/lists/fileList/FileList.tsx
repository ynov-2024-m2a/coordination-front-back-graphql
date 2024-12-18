"use client"

import React, {useState} from 'react';
import styles from "./fileList.module.scss";
import { useQuery, useMutation, useSubscription, gql} from '@apollo/client';
import {Button, Flex, Input, message, Modal, Upload, UploadProps} from "antd";
import {PlusOutlined, InboxOutlined} from "@ant-design/icons";

const { Dragger } = Upload;

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

const ROOT_UPDATED = gql`
  subscription {
    rootUpdated {
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

const MOVE_FILE = gql`
  mutation MoveFile($id: ID!, $folderId: ID!) {
    MoveFile(id: $id, folderId: $folderId)
  }
`;

const FileList = ({ folder, onSelectFile }: { folder: string, onSelectFile: (file: string) => void }) => {
    const { loading, error, data, refetch } = useQuery(GET_FILES);
    const [createFile, { loading: mutationLoading, error: mutationError }] = useMutation(CREATE_FILE);
    const [moveFile] = useMutation(MOVE_FILE);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [content, setContent] = useState('');

     // Gestion de la subscription
    useSubscription(ROOT_UPDATED, {
        onSubscriptionData: ({ subscriptionData }) => {
        if (subscriptionData?.data?.rootUpdated) {
            console.log("Root updated:", subscriptionData.data.rootUpdated);
            refetch(); // Met à jour les données locales
        }
        },
    });

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleCreateFile = async () => {
        try {
            if (!name || !content) {
                setIsModalOpen(false);
            } else {
                const response = await createFile({variables: {name, content}});
                const newFileId = response.data.createFile.id;
                const currentFolder = data.root.folders.find((f: { name: string }) => f.name === folder);

                if (currentFolder) {
                    await moveFile({variables: {id: newFileId, folderId: currentFolder.id}});
                    await refetch();
                    setIsModalOpen(false);
                } else {
                    console.error('Current folder not found');
                }
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

    const props: UploadProps = {
      name: 'file',
      multiple: true,
      directory: false,
      customRequest: async (options) => {
          const { file, onSuccess, onError } = options;

          try {
              const fileReader = new FileReader();
              fileReader.onload = async (event) => {
                  const content = event.target?.result;
                  if (typeof content === "string") {
                      const response = await createFile({ variables: { name: (file as File).name, content } });
                      const newFileId = response.data.createFile.id;
                      const currentFolder = data.root.folders.find((f: { name: string }) => f.name === folder);

                      if (currentFolder) {
                          await moveFile({ variables: { id: newFileId, folderId: currentFolder.id } });
                          await refetch();
                          onSuccess?.("Upload succeeded!");
                      } else {
                          throw new Error("Current folder not found");
                      }
                  }
              };
              fileReader.onerror = (error) => onError?.(error);
              fileReader.readAsText(file as Blob);
          } catch (error) {
              if (error instanceof Error) {
                  console.error("Upload error:", error.message);
              }
          }
      },
      onChange(info) {
          const { status } = info.file;
          if (status !== "uploading") {
              console.log(info.file, info.fileList);
          }
          if (status === "done") {
              message.success(`${info.file.name} file uploaded successfully.`);
          } else if (status === "error") {
              message.error(`${info.file.name} file upload failed.`);
          }
      },
      onDrop(e) {
          console.log("Dropped files", e.dataTransfer.files);
      },
  };

    const selectedFolder = data.root.folders.find((f: { name: string }) => f.name === folder);

    return (
        <div>
            <Flex gap={"10px"} justify="space-between">
                <p className={styles.title}>{folder}</p>
                <Button type="primary" onClick={showModal}>
                    <PlusOutlined />
                </Button>
                <Modal title="Create file" open={isModalOpen} onOk={handleCreateFile} onCancel={handleCancel}>
                    <Flex vertical gap={"10px"}>
                        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                        <Input placeholder="Description" value={content} onChange={(e) => setContent(e.target.value)} />
                        <Dragger {...props}>
                            <p>
                                <InboxOutlined />
                            </p>
                            <p>Click or drag file to this area to upload</p>
                            <p>
                                Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                                banned files.
                            </p>
                        </Dragger>

                        {mutationLoading && <p>Creating file...</p>}
                        {mutationError && <p>Error: {mutationError.message}</p>}
                    </Flex>
                </Modal>
            </Flex>
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
