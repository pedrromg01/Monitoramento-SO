const si = require('systeminformation');
const fs = require('fs');
const path = require('path');
const { dialog } = require('electron');

let logFilePath = null;

// Garante que o log será salvo mesmo que o usuário não escolha um caminho
if (!logFilePath) {
    logFilePath = path.join(__dirname, 'logs.txt');
}

async function atualizarInformacoes() {
    try {
        const sys = await si.system();
        document.getElementById('system').innerHTML = `<strong>Sistema:</strong> <span>${sys.manufacturer}, ${sys.model}</span>`;

        const osInfo = await si.osInfo();
        document.getElementById('os').innerHTML = `<strong>OS:</strong> <span>${osInfo.distro} ${osInfo.arch}</span>`;

        const cpu = await si.cpu();
        document.getElementById('cpu').innerHTML = `<strong>Processador:</strong> <span>${cpu.manufacturer} ${cpu.brand}</span>`;

        const gpu = await si.graphics();
        const hasGPU = gpu.controllers && gpu.controllers.length > 0;
        document.getElementById('gpu').innerHTML = `<strong>Placa de Vídeo:</strong> <span>${hasGPU ? gpu.controllers[0].model : 'Nenhuma'}</span>`;

        const cpuLoad = await si.currentLoad();
        const cpuLoadElement = document.getElementById('cpuLoad');
        cpuLoadElement.innerHTML = `<strong>Uso do CPU:</strong> <span>${cpuLoad.currentLoad.toFixed(2)}%</span>`;
        cpuLoadElement.querySelector('span').style.transition = "all 0.5s ease-in-out";

        const mem = await si.mem();
        const usedMem = mem.used;
        const totalMem = mem.total;
        const ramLoadElement = document.getElementById('ramLoad');
        ramLoadElement.innerHTML = `<strong>Uso da RAM:</strong> <span>${((usedMem / totalMem) * 100).toFixed(2)}%</span>`;
        ramLoadElement.querySelector('span').style.transition = "all 0.5s ease-in-out";

        // Salvando logs
        const logData = `${new Date().toISOString()} - CPU: ${cpuLoad.currentLoad.toFixed(2)}%, RAM: ${((usedMem / totalMem) * 100).toFixed(2)}%\n`;
        fs.appendFileSync(logFilePath, logData, 'utf8');

    } catch (error) {
        console.error("Erro ao atualizar informações:", error);
    }
}

setInterval(atualizarInformacoes, 10000); // Atualiza a cada 10 segundos

function salvarLogs() {
    dialog.showSaveDialog({
        title: 'Salvar arquivo de log',
        defaultPath: 'log.txt',
        filters: [{ name: 'Text Files', extensions: ['txt'] }]
    }).then(result => {
        if (!result.canceled) {
            logFilePath = result.filePath;
        }
    }).catch(err => console.error("Erro ao salvar logs:", err));
}

document.getElementById('saveLogsButton').addEventListener('click', salvarLogs);
