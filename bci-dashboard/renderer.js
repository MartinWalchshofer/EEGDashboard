//API functions
const apiPath = 'http://localhost:5832/api/' // TODO PUT INTO .env
const apiStartScanning = 'StartScanning';
const apiStopScanning = 'StopScanning';
const apiGetAvailableDevices = 'GetAvailableDevices';
const apiOpen = 'Open'
const apiClose = 'Close'

//variables
var isScanning = false;

//UI elements
const btnStartStop = document.getElementById('btnStartStop');

//scan for available devices
const scanningTask = setInterval(GetAvailableDevices, 500);

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
    await SendAPIRequest(apiGetAvailableDevices);
}

async function StartScanning() {
    await SendAPIRequest(apiStartScanning);
}

async function StopScanning() {
    await SendAPIRequest(apiStopScanning);
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
        console.log('Response:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}