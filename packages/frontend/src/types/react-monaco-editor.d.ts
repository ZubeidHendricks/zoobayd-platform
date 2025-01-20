declare module 'react-monaco-editor' {
  import * as React from 'react';
  import * as monacoEditor from 'monaco-editor';

  export interface MonacoEditorProps {
    width?: number | string;
    height?: number | string;
    value?: string;
    defaultValue?: string;
    language?: string;
    theme?: string;
    options?: monacoEditor.editor.IEditorOptions;
    onChange?: (value: string, event: monacoEditor.editor.IModelContentChangedEvent) => void;
    editorDidMount?: (editor: monacoEditor.editor.IStandaloneCodeEditor, monaco: typeof monacoEditor) => void;
    editorWillMount?: (monaco: typeof monacoEditor) => void;
    context?: any;
  }

  export default class MonacoEditor extends React.Component<MonacoEditorProps> {}
}