const MultiChannelOverridingBuffer = require('./multichannel_overriding_buffer')

class TimeseriesPlot {
    #buffer;
    #xdata;
    #divTag;
    constructor(numberOfChannels, samplingRate, displayedTimeS, divTag)
    {
        this.#divTag = divTag;
        this.#buffer = new MultiChannelOverridingBuffer(numberOfChannels, samplingRate, displayedTimeS);
        this.#InitializeTimeSeriesPlot(numberOfChannels, samplingRate, displayedTimeS, this.#divTag );
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
                  color: 'rgb(55, 128, 191)',
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
                range: [-50, 50], //TOOD
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