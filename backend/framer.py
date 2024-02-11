import numpy as np

class Framer:
    __frame = None
    __frameOut = None
    __cnt = 0
    def __init__(self, channel_count, samples_count):
        self.__frame = np.zeros((samples_count, channel_count))
        self.__frameOut = np.zeros((samples_count, channel_count))
        self.__cnt = 0

    def setData(self, data):
        if isinstance(data, list):
            data = np.array([data])

        if isinstance(data, np.ndarray):
            if data.shape[1] is not self.__frame.shape[1]:
                raise ValueError("Dimensions do not match.")
            for i in range(0, data.shape[1]):
                self.__frame[self.__cnt, i] = data[0, i]
            self.__cnt = self.__cnt + 1
            if self.__cnt >= self.__frame.shape[0]:
                self.__cnt = 0
        else:
            raise TypeError("Type not supported.")
        
    def getFrame(self):
        return None # todo copy in correct order


        