"use client";

import { useState, useEffect } from "react";
import {
  Folder,
  File,
  PlusCircle,
  Trash,
  ChevronDown,
  ChevronRight,
  Edit,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";

const NavPanel = ({ workspaceId, openFile }) => {
  const { user } = useUser();
  const router = useRouter();
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [folderStates, setFolderStates] = useState({});
  const [creatingType, setCreatingType] = useState(null);
  const [creatingParentFolderId, setCreatingParentFolderId] = useState(null);
  const [newItemName, setNewItemName] = useState("");
  const [renamingItem, setRenamingItem] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Load from localStorage
    const loadData = () => {
      try {
        const savedFolders = JSON.parse(localStorage.getItem(`folders-${workspaceId}`)) || [];
        const savedFiles = JSON.parse(localStorage.getItem(`files-${workspaceId}`)) || [];
        setFolders(savedFolders);
        setFiles(savedFiles);

        const initialFolderStates = {};
        savedFolders.forEach((folder) => {
          initialFolderStates[folder.id] = false;
        });
        setFolderStates(initialFolderStates);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load workspace data");
      }
    };

    loadData();
  }, [workspaceId, user, router]);

  const saveData = () => {
    try {
      localStorage.setItem(`folders-${workspaceId}`, JSON.stringify(folders));
      localStorage.setItem(`files-${workspaceId}`, JSON.stringify(files));
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save changes");
    }
  };

  const toggleFolder = (folderId) => {
    setFolderStates((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const createNewItem = async () => {
    if (!newItemName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    const newId = Math.random().toString(36).substr(2, 9);
    if (creatingType === "folder") {
      const newFolder = {
        id: newId,
        name: newItemName,
        parentId: creatingParentFolderId,
      };
      setFolders([...folders, newFolder]);
    } else {
      const newFile = {
        id: newId,
        name: `${newItemName}${newItemName.includes(".") ? "" : ".js"}`,
        parentId: creatingParentFolderId,
        content: "// Write your code here",
      };
      setFiles([...files, newFile]);
    }

    setNewItemName("");
    setCreatingType(null);
    setCreatingParentFolderId(null);
    saveData();
    toast.success(`${creatingType === "folder" ? "Folder" : "File"} created`);
  };

  const deleteItem = async (id, type) => {
    if (type === "folder") {
      setFolders(folders.filter((f) => f.id !== id));
      // Also delete all files in this folder
      setFiles(files.filter((f) => f.parentId !== id));
    } else {
      setFiles(files.filter((f) => f.id !== id));
    }
    saveData();
    toast.success(`${type === "folder" ? "Folder" : "File"} deleted`);
  };

  const renameItem = async (id, type) => {
    if (!newItemName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    if (type === "folder") {
      setFolders(folders.map((f) => 
        f.id === id ? { ...f, name: newItemName } : f
      ));
    } else {
      setFiles(files.map((f) =>
        f.id === id ? { ...f, name: `${newItemName}${newItemName.includes(".") ? "" : ".js"}` } : f
      ));
    }

    setNewItemName("");
    setRenamingItem(null);
    saveData();
    toast.success(`${type === "folder" ? "Folder" : "File"} renamed`);
  };

  const renderItem = (item, type) => {
    const isFolder = type === "folder";
    const icon = isFolder ? (
      folderStates[item.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />
    ) : (
      <File size={18} />
    );

    return (
      <div
        key={item.id}
        className={`flex items-center gap-2 px-2 py-1 hover:bg-gray-800 rounded-md cursor-pointer ${
          !item.parentId ? "ml-0" : "ml-4"
        }`}
      >
        <div
          className="flex items-center gap-2 flex-1"
          onClick={() => isFolder ? toggleFolder(item.id) : openFile(item)}
        >
          {icon}
          {renamingItem?.id === item.id ? (
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") renameItem(item.id, type);
                if (e.key === "Escape") {
                  setNewItemName("");
                  setRenamingItem(null);
                }
              }}
              className="bg-gray-700 px-2 py-1 rounded text-sm w-full"
              autoFocus
            />
          ) : (
            <span className="text-sm text-gray-300">{item.name}</span>
          )}
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => {
              setRenamingItem({ id: item.id, type });
              setNewItemName(item.name);
            }}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => deleteItem(item.id, type)}
            className="p-1 hover:bg-gray-700 rounded text-red-400"
          >
            <Trash size={14} />
          </button>
          {isFolder && (
            <>
              <button
                onClick={() => {
                  setCreatingType("folder");
                  setCreatingParentFolderId(item.id);
                }}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <PlusCircle size={14} />
              </button>
              <button
                onClick={() => {
                  setCreatingType("file");
                  setCreatingParentFolderId(item.id);
                }}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <File size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderFolderContents = (folderId) => {
    const folderFiles = files.filter((f) => f.parentId === folderId);
    const subFolders = folders.filter((f) => f.parentId === folderId);

    return (
      <>
        {subFolders.map((folder) => (
          <div key={folder.id}>
            {renderItem(folder, "folder")}
            {folderStates[folder.id] && renderFolderContents(folder.id)}
          </div>
        ))}
        {folderFiles.map((file) => renderItem(file, "file"))}
      </>
    );
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">Files</h2>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setCreatingType("folder");
              setCreatingParentFolderId(null);
            }}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <Folder size={18} />
          </button>
          <button
            onClick={() => {
              setCreatingType("file");
              setCreatingParentFolderId(null);
            }}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <File size={18} />
          </button>
        </div>
      </div>

      {creatingType && (
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder={`New ${creatingType}...`}
            className="bg-gray-700 px-2 py-1 rounded text-sm flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") createNewItem();
              if (e.key === "Escape") {
                setNewItemName("");
                setCreatingType(null);
              }
            }}
            autoFocus
          />
          <button
            onClick={createNewItem}
            className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
          >
            Create
          </button>
        </div>
      )}

      <div className="space-y-1">
        {renderFolderContents(null)}
      </div>
    </div>
  );
};

export default NavPanel;