/**
 * Created by sonamyadav on 8/6/17.
 */
import React, { Component } from 'react';
import { BarStackTooltip } from 'react-d3-tooltip';
import axios from 'axios';
import moment from 'moment';
var SimpleTooltip = require('react-d3-tooltip').SimpleTooltip;

const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const width = { width: 500 };
const xScale = 'ordinal';
const yTickFormat = d3.format("d");
var xLabel = "Daily Analysis";
var yLabel = "Emotion Count";
const title = "Bar Stack Chart";
const chartSeries = [
    {
        field: 'Happy',
        name: 'Happy',
        color: '#ffd103'
    },
    {
        field: 'Sad',
        name: 'Sad',
        color: '#729DC8'
    }
]

function getGetOrdinal(n) {
    var s = ["th", "st", "nd", "rd"],
        v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

const x = function (d) {

    var day = d.day;
    var date = day.getDate();
    var month = day.getMonth();

    if (d.type.toLowerCase() != "weekly") {
        if (date.toString().length == 1) {
            date = "0" + date;
        }
    }

    if (month.toString().length == 1) {
        month = "0" + month;
    }

    var entryDate = "";
    if (d.type.toLowerCase() == "daily") {
        entryDate = date + "-" + month + "-" + day.getUTCFullYear();
    }
    else if (d.type.toLowerCase() == "monthly") {
        entryDate = month + ", " + day.getUTCFullYear();
    }
    else if (d.type.toLowerCase() == "yearly") {
        entryDate = day.getUTCFullYear();
    }
    else if (d.type.toLowerCase() == "weekly") {
        entryDate = getGetOrdinal(date) + " Week, " + month + ", " + day.getUTCFullYear();
    }

    return entryDate;
};

export default class Graph extends Component {
    constructor(props) {
        super(props);
        var sDate = moment().subtract(8, 'd')
        var eDate = moment().subtract(1, 'd')
        this.state = { data: [], startDate: sDate, endDate: eDate, type: "Daily", width: 500, height: 500 };
        this.tabChange = this.tabChange.bind(this);
        this.fillDateRange = this.fillDateRange.bind(this);
        this.fitToParentSize = this.fitToParentSize.bind(this);
    }

    loadCommentsFromServer() {
        $("#loader").show();
        axios.post("http://34.193.92.171:3002/api/getHistoricalResult", {
            type: this.state.type, fromDate: this.state.startDate, toDate: this.state.endDate
        }).then(res => {
            $("#loader").hide();
            var arr = []
            if (res.data.length == 0) {
                $("#chart").hide();
                $("#text").text("No Mood Captured");
            }
            else {
                $("#chart").show();
                $("#text").text("")
            }
            for (var i = 0; i < res.data.length; i++) {
                var object = {};

                if (this.state.type.toLowerCase() == "daily") {
                    xLabel = "Daily Analysis";
                    object.day = new Date(res.data[i].year, res.data[i].month, res.data[i].date);
                }
                else if (this.state.type.toLowerCase() == "monthly") {
                    xLabel = "Monthly Analysis";
                    object.day = new Date(res.data[i].year, res.data[i].month, "01");
                }
                else if (this.state.type.toLowerCase() == "yearly") {
                    xLabel = "Yearly Analysis";
                    object.day = new Date(res.data[i].year, "01", "01");
                }
                else if (this.state.type.toLowerCase() == "weekly") {
                    xLabel = "Weekly Analysis";
                    var week = this.getWeekOfMonth(res.data[i].date)
                    object.day = new Date(res.data[i].year, res.data[i].month, week);
                }

                object.Happy = res.data[i].happy
                object.Sad = res.data[i].sad
                object.type = this.state.type
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
            widthPercent = 77;
            heightPercent = 67;
            if (!$(this.refs.dateRange).hasClass('pull-right'))
                $(this.refs.dateRange).addClass('pull-right');
        }
        else {
            if ($(this.refs.dateRange).hasClass('pull-right'))
                $(this.refs.dateRange).removeClass('pull-right');
        }

        if (windowHeight <= 500) {
            windowHeight = 500;
        }

        var heightpercent = (windowHeight * heightPercent) / 100;
        var widthpercent = (windowWidth * widthPercent) / 100;
        this.setState({ width: widthpercent, height: heightpercent });
    }

    //

    componentDidMount() {
        this.dateRange();
        // Custom code for resizing chart  
        window.addEventListener('resize', this.fitToParentSize);
        this.fitToParentSize();
    }

    componentDidUpdate() {
        modifyXaxis(11);
    }

    getWeekOfMonth(dateOfMonth) {
        var date = new Date(dateOfMonth);
        var month = date.getMonth(),
            year = date.getFullYear(),
            firstWeekday = new Date(year, month, 1).getDay(),
            lastDateOfMonth = new Date(year, month + 1, 0).getDate(),
            offsetDate = 7 - firstWeekday,
            daysAfterFirstWeek = lastDateOfMonth - offsetDate,
            weeksInMonth = Math.ceil(daysAfterFirstWeek / 7) + 1,
            week = 0;

        var noOfDaysAfterRemovingFirstWeek = date.getDate() - offsetDate;
        if (noOfDaysAfterRemovingFirstWeek <= 0) {
            week = 1;
        } else if (noOfDaysAfterRemovingFirstWeek <= 7) {
            week = 2;
        } else if (noOfDaysAfterRemovingFirstWeek <= 14) {
            week = 3;
        } else if (noOfDaysAfterRemovingFirstWeek <= 21) {
            week = 4;
        } else if (weeksInMonth >= 5 && noOfDaysAfterRemovingFirstWeek <= 28) {
            week = 5;
        } else if (weeksInMonth === 6) {
            week = 6;
        }
        return week;
    };

    tabChange(obj) {
        this.setState({ type: obj.target.innerHTML }, this.loadCommentsFromServer);
    }

    changeDateRange(start, end) {
        if (new Date(start).getMinutes() == 0) {
            start = moment(start).add(new Date().getUTCHours(), 'h')
        }

        this.setState({ startDate: start, endDate: end }, this.loadCommentsFromServer);
    }

    dateRange() {
        $('#reportrange').daterangepicker({
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            "maxDate": this.state.endDate,
            "showDropdowns": true,
            "locale": {
                "format": "DD-MMM-YYYY",
            }
        }, this.fillDateRange);

        this.fillDateRange(this.state.startDate, this.state.endDate);
    }

    fillDateRange(start, end) {
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        this.changeDateRange(start, end);
    }

    render() {
        console.log("===", this.state.data)
        return (
            <div ref='root'>
                <div className="page-header h2">Historical Data Analytics</div>
                <div>

                    <div className="btn-group pull-left">
                        <button type="button"
                            className={`btn btn-primary ${this.state.type === "Daily" ? "active" : ''}`}
                            onClick={this.tabChange}>Daily</button>
                        <button type="button"
                            className={`btn btn-primary ${this.state.type === "Weekly" ? "active" : ''}`}
                            onClick={this.tabChange}>Weekly</button>
                        <button type="button"
                            className={`btn btn-primary ${this.state.type === "Monthly" ? "active" : ''}`}
                            onClick={this.tabChange}>Monthly</button>
                        <button type="button"
                            className={`btn btn-primary ${this.state.type === "Yearly" ? "active" : ''}`}
                            onClick={this.tabChange}>Yearly</button>
                    </div>
                    <div ref="dateRange" className="pull-right">
                        <div id="reportrange" className="daterange">
                            <i className="glyphicon glyphicon-calendar fa fa-calendar"></i>&nbsp;
                                        <b className="caret"></b>
                        </div>
                    </div>
                    <div id="daily" className="tab-pane fade in active">
                        <div className="align-chart">
                            <div id="loader" className="loader"></div>
                            <div id="chart">
                                <BarStackTooltip
                                    title={title}
                                    data={this.state.data}
                                    chartSeries={chartSeries}
                                    x={x}
                                    xScale={xScale}
                                    yTickFormat={yTickFormat}
                                    xLabel={xLabel}
                                    yLabel={yLabel}
                                    width={this.state.width}
                                    height={this.state.height}
                                >
                                    <SimpleTooltip />
                                </BarStackTooltip>
                            </div>
                        </div>
                        <div className="error"><p id="text"></p></div>
                    </div>
                </div>
            </div>
        );
    }
}