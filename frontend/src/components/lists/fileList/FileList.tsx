import React from 'react';
import styles from "./fileList.module.scss";

const files = ['File1.txt', 'File2.txt', 'File3.txt'];

const FileList = ({ folder, onSelectFile }: { folder: string, onSelectFile: (file: string) => void }) => {
    return (
        <div>
            <p className={styles.title}>{folder}</p>
            <div className={styles.files_list}>
                {files.map(file => (
                    <div className={styles.files} key={file} onClick={() => onSelectFile(file)}>
                        {file}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileList;