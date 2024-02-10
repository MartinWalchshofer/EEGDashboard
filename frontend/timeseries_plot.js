const MultiChannelOverridingBuffer = require('./multichannel_overriding_buffer')

class TimeseriesPlot {
    #buffer;
    #xdata;
    #divTag;
    #range;
    #offsets;
    #numberOfChannels;
    constructor(numberOfChannels, samplingRate, displayedTimeS, divTag)
    {
        let amplitude = 200;
        this.#divTag = divTag;
        this.#numberOfChannels = numberOfChannels;
        this.#buffer = new MultiChannelOverridingBuffer(numberOfChannels, samplingRate, displayedTimeS);
        this.#InitializeTimeSeriesPlot(numberOfChannels, samplingRate, displayedTimeS, this.#divTag );
        this.#range = new Array(2);
        if(numberOfChannels % 2 === 0)
        {
            this.#range[0] = -amplitude * numberOfChannels/2;
            this.#range[1] = amplitude * numberOfChannels/2;
        }
        else
        {
            this.#range[0] = -amplitude * (numberOfChannels-1)/2;
            this.#range[1] = amplitude * (numberOfChannels-1)/2;
        }    
        this.#offsets = new Array(numberOfChannels);
        for(let i = 0; i < numberOfChannels;i++)
        {
            if(numberOfChannels % 2 === 0)
            {
                this.#offsets[i] = amplitude * (numberOfChannels/2) - amplitude/2 - i * amplitude;
            }
            else
            {
                this.#offsets[i] = amplitude * ((numberOfChannels/2)-0.5)- i * amplitude;
            }
        }
    }

    #InitializeTimeSeriesPlot(numberOfChannels, samplingRate, displayedTimeS, divTag) {
        this.#xdata = new Array(samplingRate*displayedTimeS);
        for (let i = 0; i < this.#xdata.length; i++) {
            this.#xdata[i] = i/samplingRate;
        }

        let data = this.#buffer.getData();
        if(data.length !== numberOfChannels) {
            throw new Error("Dimensions do not fit.");
        }
  
        let traces = [];
        for(let i = 0; i < numberOfChannels; i++)
        {
            let trace = {
                type: 'scatter',
                x: this.#xdata,
                y: data[i], 
                mode: 'lines',
                name: 'trace ' + i+1,
                line: {
                  color: 'rgb(255, 255, 255)',
                  width: 1
                }
              };
            traces.push(trace);
        }

        let layout = {
            xaxis: {
                title: 't [s]', 
                showgrid: true,
                font: {
                    color: 'white'
                }
                },
            yaxis: {
                range: this.#range,
                showline: false, 
                showticklabels: false,
                showgrid: false,
                zeroline: false,
                },
            plot_bgcolor: '#22333b',
            paper_bgcolor:'#22333b',
            hovermode: false,
            dragmode: false ,
            showlegend: false,
            margin: 0,
            padding: 0,
        };

        let config = {displayModeBar: false};

        //initialize plot
        Plotly.newPlot(divTag, traces, layout, config);
    }

    setData(data)
    {
        //TODO CHECK DIMENSIONS

        for(let i = 0; i < this.#numberOfChannels; i++)
        {
            data[i] = data[i]+this.#offsets[i];
        }

        this.#buffer.setData(data);
    }

    update()
    {
        let data = this.#buffer.getData();
        let update = {
            y: data
        };
        Plotly.update(this.#divTag, update);
    }
}

module.exports = TimeseriesPlot;