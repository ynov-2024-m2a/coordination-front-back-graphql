import React from 'react';
import styles from "./fileList.module.scss";
import { useQuery, gql } from '@apollo/client';

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

const FileList = ({ folder, onSelectFile }: { folder: string, onSelectFile: (file: string) => void }) => {
    const { loading, error, data } = useQuery(GET_FILES);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const selectedFolder = data.root.folders.find((f: { name: string }) => f.name === folder);

    return (
        <div>
            <p className={styles.title}>{folder}</p>
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