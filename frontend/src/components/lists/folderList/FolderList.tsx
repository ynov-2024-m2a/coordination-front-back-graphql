import React from 'react';
import styles from '@/components/lists/folderList/folderList.module.scss';
import { useQuery, gql } from '@apollo/client';

const GET_FOLDERS = gql`
    query {
      root {
        folders {
            name
        }
      }
    }
`;

const FolderList = ({ onSelectFolder }: { onSelectFolder: (folder: string) => void }) => {
    const { loading, error, data } = useQuery(GET_FOLDERS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <p className={styles.title}>Dossiers</p>
            <div className={styles.folders_list}>
                {data.root.folders.map((folder: {name: string}) => (
                    <div className={styles.folders} key={folder.name} onClick={() => onSelectFolder(folder.name)}>
                        {folder.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FolderList;