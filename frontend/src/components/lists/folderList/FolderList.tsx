import React from 'react';
import styles from '@/components/lists/folderList/folderList.module.scss';

const folders = ['Folder1', 'Folder2', 'Folder3'];

const FolderList = ({ onSelectFolder }: { onSelectFolder: (folder: string) => void }) => {
    return (
        <div>
            <p className={styles.title}>Dossiers</p>
            <div className={styles.folders_list}>
                {folders.map(folder => (
                    <div className={styles.folders} key={folder} onClick={() => onSelectFolder(folder)}>
                        {folder}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FolderList;