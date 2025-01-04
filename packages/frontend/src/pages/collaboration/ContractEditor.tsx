import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MonacoEditor from 'react-monaco-editor';

interface ContractVersion {
    versionNumber: number;
    code: string;
    author: string;
    createdAt: Date;
    optimizationScore?: number;
    securityScore?: number;
    comments?: {
        author: string;
        text: string;
        createdAt: Date;
    }[];
}

interface CollaborativeContract {
    _id: string;
    title: string;
    blockchainType: string;
    domain: string;
    currentVersion: number;
    versions: ContractVersion[];
}

const ContractEditor: React.FC = () => {
    const { contractId } = useParams<{ contractId: string }>();
    const [contract, setContract] = useState<CollaborativeContract | null>(null);
    const [currentCode, setCurrentCode] = useState('');
    const [versionHistory, setVersionHistory] = useState<ContractVersion[]>([]);
    const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
    const [newComment, setNewComment] = useState('');
    const [analysis, setAnalysis] = useState<{
        optimizationScore?: number;
        securityScore?: number;
        suggestions?: string[];
    }>({});
    const websocketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Fetch contract details
        const fetchContractDetails = async () => {
            try {
                const response = await axios.get(`/api/collaboration/contracts/${contractId}`);
                setContract(response.data);
                setCurrentCode(response.data.versions[response.data.currentVersion - 1].code);
                setVersionHistory(response.data.versions);
            } catch (error) {
                console.error('Failed to fetch contract details', error);
            }
        };

        // Analyze contract code
        const analyzeContract = async () => {
            try {
                const response = await axios.post('/api/contracts/optimize', { contractCode: currentCode });
                setAnalysis(response.data);
            } catch (error) {
                console.error('Failed to analyze contract', error);
            }
        };

        // Establish WebSocket connection
        const establishWebSocketConnection = () => {
            const ws = new WebSocket(`ws://localhost:3001/collaboration/${contractId}`);

            ws.onopen = () => {
                console.log('WebSocket connection established');
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                
                if (data.type === 'version_update') {
                    setVersionHistory(prev => [...prev, data.version]);
                    // Automatically update to latest version if it's the most recent
                    if (data.version.versionNumber > contract!.currentVersion) {
                        setCurrentCode(data.version.code);
                    }
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error', error);
            };

            websocketRef.current = ws;
        };

        fetchContractDetails();
        analyzeContract();
        establishWebSocketConnection();

        // Cleanup WebSocket on component unmount
        return () => {
            if (websocketRef.current) {
                websocketRef.current.close();
            }
        };
    }, [contractId, currentCode]);

    const handleCodeChange = (newCode: string) => {
        setCurrentCode(newCode);
    };

    const saveVersion = async () => {
        try {
            await axios.post(`/api/collaboration/contracts/${contractId}/versions`, {
                code: currentCode
            });
            // Trigger analysis of new version
            const response = await axios.post('/api/contracts/optimize', { contractCode: currentCode });
            setAnalysis(response.data);
        } catch (error) {
            console.error('Failed to save version', error);
        }
    };

    const addComment = async () => {
        if (!newComment.trim()) return;

        try {
            await axios.post(`/api/collaboration/contracts/${contractId}/comments`, {
                versionNumber: contract?.currentVersion,
                text: newComment
            });
            
            setNewComment('');
        } catch (error) {
            console.error('Failed to add comment', error);
        }
    };

    const selectVersion = (version: ContractVersion) => {
        setSelectedVersion(version.versionNumber);
        setCurrentCode(version.code);
    };

    const addCollaborator = async () => {
        const email = prompt('Enter collaborator email:');
        if (email) {
            try {
                await axios.post(`/api/collaboration/contracts/${contractId}/collaborators`, { email });
                alert('Collaborator added successfully');
            } catch (error) {
                console.error('Failed to add collaborator', error);
                alert('Failed to add collaborator');
            }
        }
    };

    if (!contract) return <div>Loading contract...</div>;

    return (
        <div className="flex h-screen">
            {/* Sidebar for Version History */}
            <div className="w-64 bg-gray-100 p-4 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Version History</h2>
                {versionHistory.map(version => (
                    <div 
                        key={version.versionNumber}
                        className={`p-2 mb-2 cursor-pointer ${
                            selectedVersion === version.versionNumber 
                                ? 'bg-blue-200' 
                                : 'bg-white hover:bg-gray-200'
                        } rounded shadow`}
                        onClick={() => selectVersion(version)}
                    >
                        <div className="flex justify-between">
                            <span>v{version.versionNumber}</span>
                            <span className="text-xs text-gray-500">
                                {new Date(version.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="text-sm text-gray-600">
                            By {version.author}
                        </div>
                        {version.optimizationScore && (
                            <div className="text-xs">
                                Opt Score: {version.optimizationScore}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center p-4 bg-white shadow">
                    <h1 className="text-2xl font-bold">{contract.title}</h1>
                    <div className="space-x-2">
                        <span className="text-sm text-gray-500">
                            Blockchain: {contract.blockchainType}
                        </span>
                        <span className="text-sm text-gray-500">
                            Domain: {contract.domain}
                        </span>
                    </div>
                    <div className="space-x-2">
                        <button 
                            onClick={saveVersion}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Save Version
                        </button>
                        <button 
                            onClick={addCollaborator}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Add Collaborator
                        </button>
                    </div>
                </div>

                {/* Code Editor */}
                <div className="flex-1 flex">
                    <div className="w-2/3">
                        <MonacoEditor
                            language="typescript"
                            theme="vs-dark"
                            value={currentCode}
                            onChange={handleCodeChange}
                            options={{
                                selectOnLineNumbers: true,
                                roundedSelection: false,
                                readOnly: false,
                                cursorStyle: 'line',
                                automaticLayout: true,
                            }}
                        />
                    </div>

                    {/* Analysis and Comments Sidebar */}
                    <div className="w-1/3 bg-gray-50 p-4 overflow-y-auto">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Contract Analysis</h3>
                            <div className="space-y-2">
                                {analysis.optimizationScore !== undefined && (
                                    <div>
                                        <span className="font-medium">Optimization Score:</span>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div 
                                                className={`h-2.5 rounded-full ${
                                                    analysis.optimizationScore > 70 
                                                        ? 'bg-green-500' 
                                                        : analysis.optimizationScore > 40 
                                                            ? 'bg-yellow-500' 
                                                            : 'bg-red-500'
                                                }`} 
                                                style={{width: `${analysis.optimizationScore}%`}}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-600">
                                            {analysis.optimizationScore}%
                                        </span>
                                    </div>
                                )}

                                {analysis.suggestions && (
                                    <div>
                                        <h4 className="font-medium">Optimization Suggestions:</h4>
                                        <ul className="list-disc list-inside text-sm text-gray-600">
                                            {analysis.suggestions.map((suggestion, index) => (
                                                <li key={index}>{suggestion}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Comments</h3>
                            <div className="space-y-2 mb-4">
                                {contract.versions[contract.currentVersion - 1]?.comments?.map((comment, index) => (
                                    <div key={index} className="bg-white p-2 rounded shadow-sm">
                                        <div className="text-sm font-medium">{comment.author}</div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(comment.createdAt).toLocaleString()}
                                        </div>
                                        <div className="text-sm">{comment.text}</div>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="w-full p-2 border rounded mb-2"
                                    rows={3}
                                />
                                <button
                                    onClick={addComment}
                                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                                >
                                    Post Comment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContractEditor;