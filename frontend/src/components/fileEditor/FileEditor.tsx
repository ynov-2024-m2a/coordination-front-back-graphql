import React, { useState } from 'react';

const FileEditor = ({ file }: { file: string }) => {
    const [content, setContent] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    return (
        <div>
            <h3>Editing {file}</h3>
            <textarea value={content} onChange={handleChange} rows={10} cols={50} />
        </div>
    );
};

export default FileEditor;