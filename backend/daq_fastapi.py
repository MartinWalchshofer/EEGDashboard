from fastapi import FastAPI, HTTPException, WebSocket
from daq_simulator import DAQSimulator
import queue
import json

apiStartScanning = 'StartScanning'
apiStopScanning = 'StopScanning'
apiGetAvailableDevices = 'GetAvailableDevices'
apiOpen = 'Open'
apiClose = 'Close'

samplingRate = 250
numberOfChannels = 8
rawDataFifoS = 10

app = FastAPI() 
device = None
acquisitionRunning = False
debugMessages = False
rawDataQueue = queue.Queue(samplingRate * rawDataFifoS)

discovered_devices = []
def on_devices_discovered(devices):
    global discovered_devices
    discovered_devices = devices

def on_data_available(data):
    rawDataQueue.put(data)

#start with 'uvicorn daq_fastapi:app --port 5832'
@app.post("/api/")
async def create_item(item_data: dict):
    global device
    global acquisitionRunning
    global debugMessages
    command = item_data.get('cmd')
    if debugMessages:
        print(command)
    res = []
    if command == apiStartScanning:
        DAQSimulator.add_devices_discovered_eventhandler(on_devices_discovered)
        DAQSimulator.start_scanning()
        res = {"msg": 'Scanning for devices...'}
    elif command == apiStopScanning:
        DAQSimulator.remove_devices_discovered_eventhandler(on_devices_discovered)
        DAQSimulator.stop_scanning()
        res = {"msg": 'Stopped scanning for devices...'}
    elif command == apiGetAvailableDevices:
        res = {'devices': discovered_devices}
    elif command == apiOpen:
        deviceName = item_data.get('args')
        if deviceName not in discovered_devices:
            raise HTTPException(status_code=400, detail= deviceName + 'not found.')
        device = DAQSimulator(deviceName, samplingRate, numberOfChannels)
        res = {"msg": 'Connected to' + deviceName}
        acquisitionRunning = True
        device.add_data_available_eventhandler(on_data_available)
    elif command == apiClose:
        acquisitionRunning = False
        if device is not None:
            device.remove_devices_discovered_eventhandler(on_data_available)
            del device
            device = None
    else:
        raise HTTPException(status_code=400, detail="Unknown api command")
    if debugMessages:
        print(res)
    return res

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while acquisitionRunning:
        while not rawDataQueue.empty():
            if debugMessages:
                print(json.dumps(f"sample: {rawDataQueue.get()}"))
            await websocket.send_text(json.dumps(f"sample: {rawDataQueue.get()}"))
    #TODO CHECK IF JAVASCRIPT SIDE IS FAST ENOUGH BUFFER MULTIPLE SAMPLES AND SEND WITH ONE PACKAGE OTHERWISE
        #data = await websocket.receive_text() #TODO REMOVE
        