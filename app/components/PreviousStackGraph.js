/**
 * Created by Amit Kumar Singh on 8/6/17.
 */
import React, { Component } from 'react';
import { BarStackTooltip } from 'react-d3-tooltip';
import PieGraph from "./customPieGraph";
import axios from 'axios';
import moment from 'moment';
var SimpleTooltip = require('react-d3-tooltip').SimpleTooltip;
var width = 850;
if ($(window).width() > $("body").width()) {
    width = 820;
}
const margin = { top: 50, right: 10, bottom: 50, left: 10 };
const xScale = 'ordinal';
const yTickFormat = d3.format("d");
var xLabel = "Daily Analysis";
var yLabel = "Emotion Count";
const title = "Bar Stack Chart";
const chartSeries = [
    {
        field: 'Happy',
        name: 'Happy',
        color:'#ffd103'
    },
    {
        field: 'Sad',
        name: 'Sad',
        color:'#729DC8'
    }
]


const x = function (d) {
    return moment(new Date(d.day)).format('h:mm A');
    // return d.day;

};

const options = [
    { value: 'Daily', label: 'Daily' },
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Yearly', label: 'Yearly' }
];

export default class Graph extends Component {
    constructor(props) {        
        super(props);
        var previousdate = moment();
        previousdate = previousdate.subtract(1, "days");        
        if (previousdate.day() == 0) {
            previousdate = previousdate.subtract(2, "days");
        }        
        var dayName = moment(previousdate).format('dddd');        
        var headingDate = previousdate.format("DD-MM-YYYY");  

        this.state = { data: [], width: 720, height: 400,headingDate: headingDate, dayName : dayName };        
        this.fitToParentSize = this.fitToParentSize.bind(this);          
    }


    loadCommentsFromServer() {        
        $("#loader").show();              
        var previousdate = moment();
        previousdate = previousdate.subtract(1, "days");        
        if (previousdate.day() == 0) {
            previousdate = previousdate.subtract(2, "days");
        }                    
        axios.get("http://34.193.92.171:3002/api/hourlyData", { params: { date: previousdate.valueOf() } })
            .then(res => {                
                $("#loader").hide();
                 
                var arr = []                
                if (res.data.length == 0) {
                    $("#graph").hide();
                    $("#text").text("No Mood Captured");
                }
                else {
                    $("#graph").show();
                    $("#text").text("");                    
                }
                for (var i = 0; i < res.data.length; i++) {
                    var object = {};
                    xLabel = "Hourly Analysis";
                    object.Happy = res.data[i].happy
                    object.Sad = res.data[i].sad
                    object.day = res.data[i].day
                    arr.push(object)
                }
                this.setState({ data: arr });
            })
    }

        // Custom code for resizing chart


    componentWillReceiveProps() {
        this.fitToParentSize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.fitToParentSize);
    }

    fitToParentSize() {
        var windowHeight = $(window).height();
        var windowWidth = $(window).width();
        var widthPercent = 80;
        var heightPercent = 60;

        if (windowWidth > 767) {
            widthPercent = 55;
            heightPercent = 60;
        }

        if (windowHeight <= 500) {
            windowHeight = 500;
        }
        
        var stackheight = (windowHeight * heightPercent) / 100;
        var stackwidth = (windowWidth * widthPercent) / 100;  
        this.setState({ width: stackwidth, height: stackheight });
    }

    // --------------------------

    componentDidMount() {
        this.loadCommentsFromServer();
         window.addEventListener('resize', this.fitToParentSize);        
        this.fitToParentSize();
    }

    componentDidUpdate() {
      modifyXaxis(5);
    }

    render() {
        return (
            <div ref='root'>
                <div id="controls">
                    <div className="page-header h2">Previous Day Analytics</div>
                    <div>
                        <div id="loader" className="loader"></div>
                        <div>
                            <div className="dayClass"><b> Date: {this.state.headingDate} ({this.state.dayName})</b></div>
                        </div>
                        <div>
                            <div className="col-sm-4">
                            <PieGraph />
                            </div>
                            <div id="graph" className="col-sm-8 stack">
                             <BarStackTooltip
                                title={title}
                                data={this.state.data}
                                width={this.state.width}
                                height={this.state.height}
                                chartSeries={chartSeries}
                                x={x}
                                xScale={xScale}
                                yTickFormat={yTickFormat}
                                xLabel={xLabel}
                                yLabel={yLabel}
                            >
                                <SimpleTooltip />
                            </BarStackTooltip>
                            </div>
                        </div>                                                                   
                    </div>
                    <div className="YesterdayError"><p id="text"></p></div>
                </div>
            </div>
        );
    }
}

