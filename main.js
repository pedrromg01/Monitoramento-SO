const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        title: "Sistema de Monitoramento",
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Novo arquivo para segurança
            nodeIntegration: true, // Habilita o uso de módulos Node.js
            contextIsolation: false // Permite acessar o `require` no renderer.js
        }
    });

    win.loadFile(path.join(__dirname, 'src/index.html'));
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
