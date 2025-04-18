// Initialize Monaco Editor
require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.36.1/min/vs' }});
require(['vs/editor/editor.main'], () => {
  window.editor = monaco.editor.create(document.getElementById('editor'), {
    value: '// Start coding...\n',
    language: 'javascript',
    theme: 'vs-dark',
    automaticLayout: true,
    autoClosingBrackets: 'always',
    minimap: { enabled: true }
  });
});

// Service Worker Registration (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  });
}

// Version Control System
const VERSION_KEY = 'code_versions';
localforage.config({ name: 'CodePWA' });

document.getElementById('saveVersion').addEventListener('click', async () => {
  const code = editor.getValue();
  const versions = (await localforage.getItem(VERSION_KEY)) || [];
  
  versions.push({
    timestamp: new Date().toISOString(),
    code,
    message: prompt('Version message:') || 'No message'
  });

  await localforage.setItem(VERSION_KEY, versions);
  updateVersionHistory();
});

// Display versions
async function updateVersionHistory() {
  const versions = await localforage.getItem(VERSION_KEY) || [];
  const historyDiv = document.getElementById('versionHistory');
  
  historyDiv.innerHTML = versions
    .map(v => `
      <div class="version">
        <small>${new Date(v.timestamp).toLocaleString()}</small>
        <p>${v.message}</p>
      </div>
    `).join('');
}

// Initialize Python support (Pyodide)
let pyodide;
async function initPyodide() {
  pyodide = await loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.21.3/full/' });
  console.log('Python runtime ready');
}
initPyodide();