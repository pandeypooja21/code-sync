"use client";
import { Moon, Sun, Sparkles, Wrench, File, Expand, Shrink, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import axios from "axios";
import LanguageSelector from "./LanguageSelector";
import { Box } from "@chakra-ui/react";
import Output from "./Output";
import { toast } from "react-toastify";

export default function CodeEditor({ file }) {
  const [selectedTheme, setSelectedTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(14);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updatedCode, setUpdatedCode] = useState("//Select a file to start coding..!");
  const [isFixing, setIsFixing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const monaco = useMonaco();
  const timeoutRef = useRef(null);
  const editorRef = useRef();
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const settingsRef = useRef(null);

  useEffect(() => {
    if (file) {
      fetchFileContent();
    }
  }, [file]);

  const fetchFileContent = async () => {
    if (!file?.id || !file?.workspaceId) return;
    try {
      // For now, we'll use mock data
      // In a real app, this would fetch from your backend API
      setUpdatedCode("// Your code here");
    } catch (error) {
      console.error("Error fetching file content:", error);
      toast.error("Failed to load file content");
    }
  };

  const handleEditorChange = (value) => {
    setUpdatedCode(value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => autoSaveFile(value), 1000);
  };

  const autoSaveFile = async (content) => {
    if (!file?.id || !file?.workspaceId) return;
    try {
      // For now, we'll just save to local storage
      // In a real app, this would save to your backend API
      localStorage.setItem(`file-${file.id}`, content);
      toast.success("Changes saved");
    } catch (error) {
      console.error("Error auto-saving file:", error);
      toast.error("Failed to save changes");
    }
  };

  const onSelect = (codeLanguage) => {
    setCodeLanguage(codeLanguage);
  };

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const generateDocs = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post("/api/generate-documentation", { code: updatedCode, language: codeLanguage });
      const documentation = res.data.documentation;
      const commentedDocs = `\n\n${documentation}`;
      setUpdatedCode((prevCode) => prevCode + commentedDocs);
      toast.success("Documentation generated!");
    } catch (error) {
      console.error("Failed to generate documentation:", error);
      toast.error("Failed to generate documentation");
    } finally {
      setIsLoading(false);
    }
  };

  const fixCode = async () => {
    setIsFixing(true);
    try {
      const res = await axios.post("/api/fix-code", { code: updatedCode, language: codeLanguage });
      const fixedCode = res.data.fixedCode;
      setUpdatedCode(fixedCode);
      toast.success("Code fixed!");
    } catch (error) {
      console.error("Failed to fix code:", error);
      toast.error("Failed to fix code");
    } finally {
      setIsFixing(false);
    }
  };

  const handleSettingsClick = (event) => {
    event.stopPropagation();
    setShowSettings(!showSettings);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`flex flex-col ${isExpanded ? 'h-screen fixed inset-0 z-50 bg-gray-950' : 'h-[88%]'}`}>
      <div className="flex justify-between items-center px-4 py-2 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <LanguageSelector onSelect={onSelect} />
          <div className="relative" ref={settingsRef}>
            <button
              onClick={handleSettingsClick}
              className="p-2 hover:bg-gray-800 rounded-md"
            >
              <Settings className="w-5 h-5 text-gray-400" />
            </button>
            {showSettings && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10">
                <div className="p-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Theme</span>
                    <button
                      onClick={() => setSelectedTheme(selectedTheme === "light" ? "vs-dark" : "light")}
                      className="p-1 hover:bg-gray-700 rounded"
                    >
                      {selectedTheme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Font Size</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setFontSize(prev => Math.max(prev - 1, 10))}
                        className="text-gray-400 hover:text-white"
                      >
                        -
                      </button>
                      <span className="text-sm">{fontSize}</span>
                      <button
                        onClick={() => setFontSize(prev => Math.min(prev + 1, 20))}
                        className="text-gray-400 hover:text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={generateDocs}
            disabled={isLoading}
            className="flex items-center space-x-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-md text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? "Generating..." : "Generate Docs"}</span>
          </button>
          <button
            onClick={fixCode}
            disabled={isFixing}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md text-sm"
          >
            <Wrench className="w-4 h-4" />
            <span>{isFixing ? "Fixing..." : "Fix Code"}</span>
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-800 rounded-md"
          >
            {isExpanded ? (
              <Shrink className="w-5 h-5 text-gray-400" />
            ) : (
              <Expand className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <Box flex="1" position="relative">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          language={codeLanguage}
          theme={selectedTheme}
          value={updatedCode}
          onChange={handleEditorChange}
          onMount={onMount}
          options={{
            fontSize: fontSize,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            lineNumbers: "on",
            folding: true,
            autoClosingBrackets: "always",
            autoClosingQuotes: "always",
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </Box>

      <Output code={updatedCode} language={codeLanguage} />
    </div>
  );
}