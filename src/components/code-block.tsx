"use client"

import { useTheme } from 'next-themes';
import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/hljs';

SyntaxHighlighter.registerLanguage('json', json);

type CodeBlockProps = {
  code: string;
  showLineNumbers: boolean;
};

const CodeBlock: React.FC<CodeBlockProps> = ({ code, showLineNumbers }) => {
  const { theme } = useTheme();
  const color = theme === "dark" ? "white" : "black";
  return (
    <SyntaxHighlighter
      customStyle={{
        backgroundColor: "transparent",
        color,
      }}
      language="json" 
      style={vs} 
      showLineNumbers={showLineNumbers}
      wrapLongLines={true}
    >
      {code}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
