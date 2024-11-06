import React, { useState, useEffect } from 'react';
import styles from './fileEditor.module.scss';
import { Editor as MonacoEditor } from '@monaco-editor/react';

const FileEditor = ({ file }: { file: string }) => {
    const [content, setContent] = useState('');
    const [language, setLanguage] = useState('plaintext');

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
            <p className={styles.title}>{file}</p>
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