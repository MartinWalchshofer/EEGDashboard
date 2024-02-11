import threading
import time
import random

class DAQSimulator:
    __deviceName = ['DAQ-0000.00.00', 'DAQ-0000.00.01']
    __isScanning = False
    __eventHandlers = []

    @staticmethod
    def start_scanning():
        if not DAQSimulator.__isScanning:
            DAQSimulator.__isScanning = True
            DAQSimulator.__on_devices_discovered(DAQSimulator.__deviceName)

    @staticmethod
    def stop_scanning():
        if DAQSimulator.__isScanning:
            DAQSimulator.__isScanning = False

    @staticmethod
    def add_devices_discovered_eventhandler(handler):
        DAQSimulator.__eventHandlers.append(handler)

    @staticmethod
    def remove_devices_discovered_eventhandler(handler):
        DAQSimulator.__eventHandlers.remove(handler)

    @staticmethod
    def __on_devices_discovered(*args, **kwargs):
        for handler in DAQSimulator.__eventHandlers:
            handler(*args, **kwargs)
        
    def __init__(self, device_name, sampling_rate, channel_count):
        self.sampling_rate = sampling_rate
        self.channel_count = channel_count
        self.__deviceName = device_name
        self.__acquisitionRunning = False
        self.__acquisitionThread = None
        self.__eventHandlers = []
        self.__open()

    def __del__(self):
        self.__close()

    def __open(self):
        if not self.__acquisitionRunning:
            self.__acquisitionRunning = True
            self.__acquisitionThread = threading.Thread(target=self.__acquisitionThread_dowork)
            self.__acquisitionThread.start()
           
    def __close(self):
        if self.__acquisitionRunning:
            self.__acquisitionRunning = False
            self.__acquisitionThread.join(500)

    def __acquisitionThread_dowork(self):
        while self.__acquisitionRunning:
            time.sleep(1/self.sampling_rate)
            data = [0]*self.channel_count
            for i in range(self.channel_count):
                data[i] = random.uniform(-10, 10)
            for handler in self.__eventHandlers:
                handler(data)

    def add_data_available_eventhandler(self, handler):
        self.__eventHandlers.append(handler)

    def remove_data_available_eventhandler(self, handler):
        self.__eventHandlers.remove(handler)