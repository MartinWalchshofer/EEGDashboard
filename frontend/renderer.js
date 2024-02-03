const WebSocket = require('ws');

//API functions

const serverPath = 'localhost';     // TODO PUT INTO .env
const communicationPort = '5832';   // TODO PUT INTO .env
const apiPath = '/api/';            // TODO PUT INTO .env
const wsPath = '/ws';               // TODO PUT INTO .env
const fullWsPath = 'ws://' + serverPath + ':' + communicationPort + wsPath; 
const fullApiPath = 'http://' + serverPath + ':' + communicationPort + apiPath;
const apiStartScanning = 'StartScanning';
const apiStopScanning = 'StopScanning';
const apiGetAvailableDevices = 'GetAvailableDevices';
const apiOpen = 'Open';             //TODO
const apiClose = 'Close';           //TODO
const deviceDiscoveryRefreshRateMs = 500;

//variables
var devices = [];
var isScanning = false;
var backendReachable = false;
var dataSocket = null;

//UI elements
const divDevices = document.getElementById('divDevices');

//start scanning for devices
var scanningTask = null;
try{
    //scan for available devices
    scanningTask = StartScanning().then(() => {
        backendReachable = true;

    //show error message if backend not found
    if(!backendReachable) {
        var divError = document.createElement('divError');
        divError.className = 'errorMessage';
        const p = document.createElement('p');
        p.textContent = 'Backend not reachable';
        divError.appendChild(p);
        divDevices.appendChild(divError);
    }
    });
}
catch (error) {
    //stop scanning
    StopScanning();
    
    console.error('Message', 'Ensure that the backend server is running.')
    console.error('Error:', error);
}

async function Open(deviceName){
    await StopScanning();

    console.log(deviceName); // TODO REMOVE
    //Open device
    await console.log(await SendAPIRequest(apiOpen, deviceName));

    //attach to websocket
    if(dataSocket == null)
        dataSocket = new WebSocket(fullWsPath);
}

async function StartScanning() { 
    console.log(await SendAPIRequest(apiStartScanning, null));
    scanningTask = setInterval(GetAvailableDevices, deviceDiscoveryRefreshRateMs);
    isScanning = true;
}

async function StopScanning() {
    if(scanningTask != null)
        clearInterval(scanningTask);
    if(isScanning){
        console.log(await SendAPIRequest(apiStopScanning, null));
        isScanning = false;
    }
}

async function GetAvailableDevices() {
    var res = await SendAPIRequest(apiGetAvailableDevices, null);
    if(res != null)
    {
        if (!(JSON.stringify(devices) === JSON.stringify(res.devices))) {
            devices = res.devices;
            console.log(devices);
            devices.forEach(deviceName => {
                var divDevice = document.createElement('divDevice');
                divDevice.className = 'device';
                const p = document.createElement('p');
                p.textContent = deviceName;
                divDevice.appendChild(p);
                divDevice.addEventListener('click', function(event) {
                    Open(event.target.innerText)
                })
                divDevices.appendChild(divDevice);
            });
        }
    } 
}

async function SendAPIRequest(command, arguments) {
    var jsCmd;
    if(arguments != null)
        jsCmd = JSON.stringify({ cmd: command , args: arguments});
    else
        jsCmd = JSON.stringify({ cmd: command });
    console.log(jsCmd)
    const response = await fetch(fullApiPath, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
            body: jsCmd
    });
    const data = await response.json();
    return data;
}