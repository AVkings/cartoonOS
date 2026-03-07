import React, { useState } from 'react';
import { buildAEXDocument, parseAEX } from '../../../utils/aexRuntime';
import { useFileStore } from '../../../store/useFileStore';
import { Save, Play, FileCode, Info, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useOSStore } from '../../../store/useOSStore';

const STARTER_TEMPLATE = `@app "My App"
@version "1.0"
@author "you"
@icon "🚀"
@description "My first AEX app"

---STYLE---
body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #90C2FF;
  font-family: 'Nunito', sans-serif;
}

.card {
  background: white;
  border: 4px solid black;
  box-shadow: 6px 6px 0 black;
  padding: 32px;
  text-align: center;
  border-radius: 12px;
}

h1 { font-size: 28px; font-weight: 900; }
button {
  background: #FF90E8;
  border: 3px solid black;
  box-shadow: 3px 3px 0 black;
  padding: 12px 24px;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
  border-radius: 8px;
  margin-top: 16px;
  font-family: inherit;
}
button:active { transform: translate(2px,2px); box-shadow: none; }

---RENDER---
<div class="card">
  <h1>🚀 Hello!</h1>
  <p id="msg">Welcome to AEX!</p>
  <button onclick="greet()">Click Me</button>
</div>

---SCRIPT---
let clicks = 0;

function greet() {
  clicks++;
  document.getElementById('msg').textContent = 'Clicked ' + clicks + ' times!';
  print('Click #' + clicks);
}

function print(msg) {
  console.log(msg);
}

print('App loaded!');
`;

export const CodeEditor: React.FC<{ fileId?: string }> = ({ fileId }) => {
    const { files, saveFile } = useFileStore();
    const { openWindow } = useOSStore();

    // Initial content and name computed during first render
    const initialCode = fileId && files[fileId] ? files[fileId].content : STARTER_TEMPLATE;
    const initialName = fileId && files[fileId] ? files[fileId].name : 'my_app.aex';

    const [code, setCode] = useState(initialCode);
    const [previewHtml, setPreviewHtml] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [fileName, setFileName] = useState(initialName);
    const [saved, setSaved] = useState(true);
    const [showSyntax, setShowSyntax] = useState(false);
    const [iframeVersion, setIframeVersion] = useState(0);

    const meta = parseAEX(code);

    const handleRun = () => {
        setIframeVersion(v => v + 1);
        setPreviewHtml(buildAEXDocument(code));
        setShowPreview(true);
    };

    const handleSave = () => {
        const id = fileId ?? `aex_user_${Date.now()}`;
        const name = fileName.endsWith('.aex') ? fileName : fileName + '.aex';
        saveFile(id, name, code, 'aex');
        setSaved(true);
        return id;
    };

    const handleRunExternal = () => {
        const id = handleSave();
        openWindow(id, `🚀 ${fileName.replace('.aex', '')}`);
    };

    return (
        <div className="flex flex-col h-full font-sans overflow-hidden bg-white">
            {/* Toolbar */}
            <div className="flex items-center gap-2 px-3 py-2 bg-neo-blue border-b-[3px] border-black shrink-0">
                <FileCode size={20} className="shrink-0" />
                <input
                    type="text"
                    value={fileName}
                    onChange={(e) => { setFileName(e.target.value); setSaved(false); }}
                    className="w-40 px-2 py-1 border-2 border-black rounded font-bold text-sm focus:outline-none"
                />

                {/* App meta preview */}
                <div className="flex items-center gap-1.5 bg-white border-2 border-black rounded px-2 py-1 text-sm font-bold">
                    <span>{meta.meta.icon}</span>
                    <span className="max-w-[120px] truncate">{meta.meta.app}</span>
                </div>

                <div className="flex-1" />

                <button
                    onClick={handleSave}
                    className={`flex items-center gap-1.5 px-3 py-1.5 border-[3px] border-black rounded-lg font-black text-sm shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all ${saved ? 'bg-gray-300 opacity-60' : 'bg-neo-green'}`}
                >
                    <Save size={14} /> {saved ? 'Saved' : 'Save .aex'}
                </button>
                <button
                    onClick={handleRun}
                    title="Preview in side panel"
                    className="flex items-center gap-1.5 px-3 py-1.5 border-[3px] border-black rounded-lg bg-white font-black text-sm shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                >
                    <Play size={14} /> Preview
                </button>
                <button
                    onClick={handleRunExternal}
                    title="Run as standalone window"
                    className="flex items-center gap-1.5 px-3 py-1.5 border-[3px] border-black rounded-lg bg-neo-pink font-black text-sm shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                >
                    <ExternalLink size={14} /> Run
                </button>
            </div>

            {/* Syntax Reference (collapsible) */}
            <div className="border-b-2 border-black shrink-0">
                <button
                    onClick={() => setShowSyntax(!showSyntax)}
                    className="flex items-center gap-2 px-3 py-1.5 w-full text-left bg-gray-100 hover:bg-gray-200 text-sm font-bold"
                >
                    <Info size={14} />
                    AEX Syntax Reference
                    {showSyntax ? <ChevronUp size={14} className="ml-auto" /> : <ChevronDown size={14} className="ml-auto" />}
                </button>
                {showSyntax && (
                    <div className="bg-gray-50 p-3 text-xs font-mono grid grid-cols-2 gap-x-6 gap-y-1 border-t border-gray-200">
                        <div><span className="text-purple-600">@app</span> <span className="text-green-600">"Name"</span> — app metadata</div>
                        <div><span className="text-blue-600">---STYLE---</span> — CSS block</div>
                        <div><span className="text-blue-600">---RENDER---</span> — HTML block</div>
                        <div><span className="text-blue-600">---SCRIPT---</span> — JS block</div>
                        <div><span className="text-orange-600">print(text)</span> — console log</div>
                        <div><span className="text-orange-600">aex.alert(text)</span> — dialog</div>
                        <div><span className="text-orange-600">aex.color.pink</span> — palette</div>
                        <div><span className="text-gray-500">True / False / None</span> — aliases</div>
                    </div>
                )}
            </div>

            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 flex flex-col overflow-hidden">
                    <textarea
                        className="flex-1 w-full p-4 font-mono text-sm bg-gray-950 text-green-300 resize-none outline-none leading-relaxed caret-green-400"
                        value={code}
                        onChange={(e) => { setCode(e.target.value); setSaved(false); }}
                        spellCheck={false}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        placeholder="Write your AEX code here..."
                    />
                    <div className="flex items-center justify-between px-3 py-1 border-t-2 border-black bg-gray-800 text-green-400 text-xs font-mono shrink-0">
                        <span>AEX · {code.split('\n').length} lines · {code.length} chars</span>
                        <span>{saved ? '✓ saved' : '● unsaved'}</span>
                    </div>
                </div>

                {showPreview && (
                    <div className="w-1/2 border-l-[3px] border-black flex flex-col shrink-0">
                        <div className="flex justify-between items-center px-3 py-2 bg-neo-yellow border-b-[3px] border-black shrink-0">
                            <span className="font-black text-sm">▶ Preview — {meta.meta.icon} {meta.meta.app}</span>
                            <button onClick={() => setShowPreview(false)} className="font-black text-lg leading-none">✕</button>
                        </div>
                        <iframe
                            key={iframeVersion}
                            srcDoc={previewHtml}
                            className="flex-1 border-none w-full"
                            sandbox="allow-scripts allow-same-origin allow-forms"
                            title="AEX Preview"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
