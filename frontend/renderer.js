const WebSocket = require('ws');

//API functions

const wsPath = 'ws://localhost:5832/ws' // TODO PUT INTO .env
const ws = new WebSocket(wsPath); //TODO AFTER OPEN
const apiPath = 'http://localhost:5832/api/' // TODO PUT INTO .env
const apiStartScanning = 'StartScanning';
const apiStopScanning = 'StopScanning';
const apiGetAvailableDevices = 'GetAvailableDevices';
const apiOpen = 'Open'
const apiClose = 'Close'
const deviceDiscoveryRefreshRateMs = 500;

//variables
var devices = []
var isScanning = false;
var backendReachable = false;

//UI elements
const divDevices = document.getElementById('divDevices');

//start scanning for devices
var scanningTask = null;
try{
    //scan for available devices
    scanningTask = StartScanning();
    backendReachable = true;
}
catch (error) {
    //stop scanning
    StopScanning(scanningTask);
    
    console.error('Message', 'Ensure that the backend server is running.')
    console.error('Error:', error);
}

//show error message if backend not found
if(!backendReachable) {
    var divError = document.createElement('divError');
    divError.className = 'errorMessage';
    const p = document.createElement('p');
    p.textContent = 'Backend not reachable';
    divError.appendChild(p);
    divDevices.appendChild(divError);
}

async function Open(deviceName){
    StopScanning()

}

async function StartScanning() {
    isScanning = true;
    console.log(await SendAPIRequest(apiStartScanning));
    scanningTask = setInterval(GetAvailableDevices, deviceDiscoveryRefreshRateMs);
    return scanningTask;
}

async function StopScanning(scanningTask) {
    if(scanningTask != null)
        clearInterval(scanningTask);
    if(isScanning){
        console.log(await SendAPIRequest(apiStopScanning));
        isScanning = false;
    }
}

async function GetAvailableDevices() {
    var res = await SendAPIRequest(apiGetAvailableDevices);
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
                    //TODO CALL OPEN
                    console.log('div text:', event.target.innerText);
                })
                divDevices.appendChild(divDevice);
            });
        }
    } 
}

async function SendAPIRequest(command) {
    const response = await fetch(apiPath, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cmd: command })
    });
    const data = await response.json();
    return data;
}