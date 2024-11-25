import React, { useState, useEffect } from 'react';
import styles from './fileEditor.module.scss';
import { Editor as MonacoEditor } from '@monaco-editor/react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Button, Flex } from 'antd';

const GET_FILES = gql`
  query {
    root {
      folders {
        id
        name
        files {
          id
          name
          content
        }
      }
    }
  }
`;

const UPDATE_FILE = gql`
  mutation updateFileContent($id: ID!, $content: String!) {
    updateFileContent(id: $id, content: $content) {
      id
      name
      content
    }
  }
`;

const FileEditor = ({ file }: { file: string }) => {
    const [content, setContent] = useState('');
    const [language, setLanguage] = useState('plaintext');
    const { data } = useQuery(GET_FILES);
    const [updateFileContent] = useMutation(UPDATE_FILE);

    useEffect(() => {
        if (data) {
            const selectedFile = data.root.folders
                .flatMap((folder: { files: { name: string, content: string }[] }) => folder.files)
                .find((f: { name: string }) => f.name === file);
            if (selectedFile) {
                setContent(selectedFile.content);
            }
        }
    }, [data, file]);

    const handleSave = async () => {
        const selectedFile = data.root.folders
            .flatMap((folder: { files: { id: string, name: string, content: string }[] }) => folder.files)
            .find((f: { name: string }) => f.name === file);
        if (selectedFile) {
            console.log('Updating file with ID:', selectedFile.id);
            await updateFileContent({ variables: { id: selectedFile.id, content } });
        } else {
            console.error('File not found:', file);
        }
    };

    const handleEditorChange = (value: string | undefined) => {
        setContent(value || '');
    };

    const getLanguageFromExtension = (filename: string) => {
        const extension = filename.split('.').pop();
        switch (extension) {
            case 'js':
                return 'javascript';
            case 'ts':
                return 'typescript';
            case 'java':
                return 'java';
            case 'py':
                return 'python';
            case 'cpp':
                return 'cpp';
            case 'cs':
                return 'csharp';
            case 'go':
                return 'go';
            default:
                return 'plaintext';
        }
    };

    useEffect(() => {
        setLanguage(getLanguageFromExtension(file));
    }, [file]);

    return (
        <div className={styles.container}>
            <Flex gap="10px">
                <p className={styles.title}>{file}</p>
                <Button onClick={handleSave}>Save</Button>
            </Flex>
            <MonacoEditor
                height="70vh"
                language={language}
                theme="light"
                value={content}
                onChange={handleEditorChange}
            />
        </div>
    );
};

export default FileEditor;