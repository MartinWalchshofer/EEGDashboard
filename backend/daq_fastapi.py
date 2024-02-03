from fastapi import FastAPI, HTTPException, WebSocket
from daq_simulator import DAQSimulator

apiStartScanning = 'StartScanning'
apiStopScanning = 'StopScanning'
apiGetAvailableDevices = 'GetAvailableDevices'
apiOpen = 'Open'
apiClose = 'Close'

app = FastAPI()

discovered_devices = []
def on_devices_discovered(devices):
    global discovered_devices
    discovered_devices = devices

#start with 'uvicorn daq_fastapi:app --port 5832'
@app.post("/api/")
async def create_item(item_data: dict):
    command = item_data.get('cmd')
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
    else:
        raise HTTPException(status_code=400, detail="Unknown api command")
    return res

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        #TODO SEND DATA HERE
        data = await websocket.receive_text() #TODO REMOVE
        await websocket.send_text(f"Message text was: {data}") #TODO REMOVE