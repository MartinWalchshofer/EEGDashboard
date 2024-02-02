//API functions
const apiPath = 'http://localhost:5832/api/' // TODO PUT INTO .env
const apiStartScanning = 'StartScanning';
const apiStopScanning = 'StopScanning';
const apiGetAvailableDevices = 'GetAvailableDevices';
const apiOpen = 'Open'
const apiClose = 'Close'
const deviceDiscoveryRefreshRateMs = 500;

//variables
var isScanning = false;

//UI elements
const btnStartStop = document.getElementById('btnStartStop');
const divDevices = document.getElementById('divDevices');

//scan for available devices
const scanningTask = setInterval(GetAvailableDevices, deviceDiscoveryRefreshRateMs);

var devices = []

//start scanning for devices
try{
    StartScanning();
}
catch (error) {
    console.error('Message', 'Ensure that the backend server is running.')
    console.error('Error:', error);
}

btnStartStop.addEventListener('click', () => {
    StartScanning();
});

async function GetAvailableDevices() {
    var res = await SendAPIRequest(apiGetAvailableDevices);
    if (!(JSON.stringify(devices) === JSON.stringify(res.devices))) {
        devices = res.devices;
        console.log(devices);
        devices.forEach(deviceName => {
            var divDevice = document.createElement('divDevice');
            divDevice.className = 'device';
            const p = document.createElement('p');
            p.textContent = deviceName;
            divDevice.appendChild(p);
            divDevices.appendChild(divDevice);
        });
    }
}

async function StartScanning() {
    console.log(await SendAPIRequest(apiStartScanning));
}

async function StopScanning() {
    console.log(await SendAPIRequest(apiStopScanning));
}

async function SendAPIRequest(command) {
    try {
        const response = await fetch(apiPath, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cmd: command })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}