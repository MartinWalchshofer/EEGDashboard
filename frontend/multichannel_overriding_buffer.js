class MultiChannelOverridingBuffer {
    #data;
    #cnt;

    constructor(numberOfChannels, samplingRate, timeS)
    {
        this.#data = [];
        this.#cnt = 0;
        var rows = numberOfChannels;
        var cols = samplingRate * timeS;
        for (let i = 0; i < rows; i++) {
            this.#data[i] = [];
            for (let j = 0; j < cols; j++) {
                this.#data[i][j] = 0;
            }
        }
    }

    setData(data)
    {
        for(let i = 0; i < data.length; i++)
        {
            this.#data[i][this.#cnt] = data[i];
        }
        this.#cnt++;
        
        if(this.#cnt >= this.#data[0].length)
        {
            this.#cnt = 0;
        }         
    }

    getData()
    {
        return this.#data;
    }
}

module.exports = MultiChannelOverridingBuffer;