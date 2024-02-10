class MultiChannelOverridingBuffer {
    #data;
    #cnt;

    constructor(numberOfChannels, samplingRate, timeS)
    {
        this.#data = [];
        this.#cnt = 0;
        var rows = samplingRate * timeS;
        var cols = numberOfChannels;
        for (let i = 0; i < rows; i++) {
            this.#data[i] = [];
            for (let j = 0; j < cols; j++) {
                this.#data[i][j] = 0;
            }
        }
    }

    setData(data)
    {
        this.#data[this.#cnt]=data.slice();
        this.#cnt++;

        if(this.#cnt >= this.#data.length)
            this.#cnt = 0;
    }

    getData()
    {
        return this.#data;
    }
}

module.exports = MultiChannelOverridingBuffer;