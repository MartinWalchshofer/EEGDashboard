from fastapi import FastAPI

app = FastAPI()

#start with 'uvicorn daq_fastapi:app --port 5832'
@app.post("/api/")
async def create_item(item_data: dict):
    command = item_data.get('cmd')
    res = []
    if command == 'StartScanning':
        res = {"msg": 'Scanning for devices...'}
    elif command == 'StartScanning':
        res = {"msg": 'Stopped scanning for devices...'}
    return {"msg": 'Scanning for devices...'}