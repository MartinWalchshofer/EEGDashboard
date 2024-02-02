from daq_simulator import DAQSimulator

#on devices discovered event / prints discovered devices to the console
discovered_devices = []
def on_devices_discovered(devices):
    global discovered_devices
    cnt = 0
    discovered_devices = devices
    for device in discovered_devices:
        print('#' + str(cnt) + ': ' + device)
        cnt = cnt+1

#data available event / prints data to the console
def on_data_available(data):
    print(data)

#attach to device discovery event
DAQSimulator.add_devices_discovered_eventhandler(on_devices_discovered)

#start scanning for devices
DAQSimulator.start_scanning()

#select device
selectedId = int(input('Select device by id:\n'))

#detach from device discovery event
DAQSimulator.remove_devices_discovered_eventhandler(on_devices_discovered)

#stop scanning dor devices
DAQSimulator.stop_scanning()

#set acquisition parameters
samplingRate = 250
numberOfChannels = 4

#open device and start acquisition
simulator = DAQSimulator(discovered_devices[selectedId], samplingRate, numberOfChannels)

#attach to data available event
simulator.add_data_available_eventhandler(on_data_available)

#wait until acquisition is supposed to be terminated
input('Press ENTER to terminate data acquisition\n')

#detach from data available event
simulator.remove_data_available_eventhandler(on_data_available)

#close device and stop data acquisition
del simulator

input('Press ENTER to terminate the example')
