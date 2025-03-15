"use client"

import { useTheme } from 'next-themes';
import React, { useMemo } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import { docco, atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

SyntaxHighlighter.registerLanguage('json', json);

type CodeBlockProps = {
  code: string;
  showLineNumbers: boolean;
};

const CodeBlock: React.FC<CodeBlockProps> = ({ code, showLineNumbers }) => {
  const { theme } = useTheme();
  
  // Formatear el JSON para una mejor visualización
  const formattedCode = useMemo(() => {
    try {
      // Intentar parsear el código como JSON
      const parsedJson = JSON.parse(code);
      
      // Si existe parametersSchema como string, parsearlo también
      if (parsedJson.parametersSchema && typeof parsedJson.parametersSchema === 'string') {
        try {
          // Parsear el parametersSchema que está como string
          const parsedSchema = JSON.parse(parsedJson.parametersSchema);
          
          // Reemplazar el string con el objeto parseado
          parsedJson.parametersSchema = parsedSchema;
        } catch (schemaError) {
          console.error("Error al parsear parametersSchema:", schemaError);
        }
      }
      
      // Función recursiva para eliminar conversationId en objetos anidados
      const removeConversationId = (obj: any): any => {
        if (!obj || typeof obj !== 'object') return obj;
        
        // Si es un array, procesar cada elemento
        if (Array.isArray(obj)) {
          return obj.map(item => removeConversationId(item));
        }
        
        // Crear una copia del objeto para no modificar el original
        const result: any = {};
        
        // Copiar todas las propiedades excepto conversationId
        for (const key in obj) {
          if (key !== 'conversationId') {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
              // Procesar objetos anidados
              result[key] = removeConversationId(obj[key]);
            } else {
              // Copiar valores primitivos
              result[key] = obj[key];
            }
          }
        }
        
        return result;
      };
      
      // Aplicar la función para eliminar conversationId
      const processedJson = removeConversationId(parsedJson);
      
      // Formatear el JSON con indentación de 2 espacios
      return JSON.stringify(processedJson, null, 2);
    } catch (error) {
      // Si no es un JSON válido, devolver el código original
      console.error("Error al formatear JSON:", error);
      return code;
    }
  }, [code]);
  
  // Seleccionar el estilo según el tema
  const codeStyle = theme === "dark" ? atomOneDark : docco;
  
  return (
    <div className="rounded-lg overflow-hidden border border-border">
      <style jsx global>{`
        /* Estilos para las claves del JSON */
        .hljs-attr {
          display: inline !important;
          white-space: pre !important;
          word-break: keep-all !important;
          overflow-wrap: normal !important;
          font-weight: 600;
          color: ${theme === "dark" ? "#f92672" : "#905"};
        }
        
        /* Estilos para los valores del JSON */
        .hljs-string {
          white-space: pre-wrap;
          word-break: break-word;
          color: ${theme === "dark" ? "#a6e22e" : "#690"};
        }
        
        /* Estilos para los números */
        .hljs-number {
          color: ${theme === "dark" ? "#ae81ff" : "#07a"};
        }
        
        /* Estilos para los booleanos */
        .hljs-literal {
          color: ${theme === "dark" ? "#66d9ef" : "#07a"};
        }
      `}</style>
      <SyntaxHighlighter
        customStyle={{
          backgroundColor: theme === "dark" ? "#1a1a1a" : "#f8f8f8",
          fontSize: "14px",
          padding: "20px",
          borderRadius: "8px",
          margin: 0,
        }}
        language="json" 
        style={codeStyle}
        showLineNumbers={showLineNumbers}
        wrapLongLines={true}
        lineNumberStyle={{
          minWidth: "3em",
          paddingRight: "1em",
          color: theme === "dark" ? "#666" : "#999",
          textAlign: "right",
          userSelect: "none",
        }}
        codeTagProps={{
          style: {
            display: 'block',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            maxWidth: '100%'
          }
        }}
      >
        {formattedCode}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
