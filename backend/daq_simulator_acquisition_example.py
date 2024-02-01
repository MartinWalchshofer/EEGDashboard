from daq_simulator import DAQSimulator

discovered_devices = []

def on_devices_discovered(devices):
    global discovered_devices
    cnt = 0
    discovered_devices = devices
    for device in discovered_devices:
        print('#' + str(cnt) + ': ' + device)
        cnt = cnt+1

def on_data_available(data):
    print(data)

DAQSimulator.add_devices_discovered_eventhandler(on_devices_discovered)
DAQSimulator.start_scanning()
selectedId = int(input('Select device by id:'))
DAQSimulator.remove_devices_discovered_eventhandler(on_devices_discovered)
DAQSimulator.stop_scanning()
samplingRate = 250
numberOfChannels = 4
simulator = DAQSimulator(discovered_devices[selectedId], samplingRate, numberOfChannels)
simulator.add_data_available_eventhandler(on_data_available)
input('Press ENTER to terminate data acquisition')
simulator.remove_data_available_eventhandler(on_data_available)
del simulator
input('Press ENTER to terminate the example')
