import React from 'react';
import styles from "./fileList.module.scss";
import { useQuery, gql } from '@apollo/client';
import { InboxOutlined } from '@ant-design/icons';
import type {  UploadProps  } from 'antd';
import { message, Upload } from 'antd';

const GET_FILES = gql`
    query {
      root {
        files {
          name      
        }
      }
    }
`;
const { Dragger } = Upload;

const FileList = ({ folder, onSelectFile }: { folder: string, onSelectFile: (file: string) => void }) => {
    const { loading, error, data } = useQuery(GET_FILES, {
        variables: { folder },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

const props: UploadProps = {
    name: 'file',
    multiple: true,
    directory: true,
    fileList: [
        {
          uid: '0',
          name: 'xxx.png',
          status: 'uploading',
          percent: 33,
        },
        {
          uid: '-1',
          name: 'yyy.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: '-2',
          name: 'zzz.png',
          status: 'error',
        },
      ],
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

    return (
        <div>
            <p className={styles.title}>{folder}</p>
            <div className={styles.files_list}>
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
            </div>
        </div>
    );
};

export default FileList;