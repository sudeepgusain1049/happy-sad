
import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
const format = d3.format("d");
var w = 270,
    h = 270,
    r = 130,
    color = d3.scale.category20c();

export default class CustomPieGraph extends Component {
    constructor(props) {
        super(props);
        this.state = { width: 270, height: 270, radius: 130, data: [] };
        this.fitToParentSize = this.fitToParentSize.bind(this);
        this.graph = this.graph.bind(this);
    }
    // Custom code for resizing chart
    componentDidMount() {
        this.loadCommentsFromServer();
        window.addEventListener('resize', this.fitToParentSize);
    }

    componentWillReceiveProps() {
        this.fitToParentSize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.fitToParentSize);
    }

    fitToParentSize() {
        var windowHeight = $(window).height();
        var windowWidth = $(window).width();
        var widthPercent = 35;
        var heightPercent = 33;

        if (windowWidth > 767) {
            widthPercent = 20;
            heightPercent = 40;
        }

        if (windowHeight <= 500) {
            windowHeight = 500;
        }

        var pieheight = Math.round((windowHeight * heightPercent) / 100);
        var piewidth = Math.round((windowWidth * widthPercent) / 100);
        var pieradius = Math.round(pieheight / 2) < Math.round(piewidth / 2) ? Math.round(pieheight / 2) : Math.round(piewidth / 2);
        this.setState({ width: piewidth, height: pieheight, radius: pieradius });
        this.graph();
    }

    // --------------------------


    loadCommentsFromServer() {
        var previousdate = moment();
        previousdate = previousdate.subtract(1, "days");
        if (previousdate.day() == 0) {
            previousdate = previousdate.subtract(2, "days");
        }
        axios.get("http://34.193.92.171:3002/api/feedback", { params: { date: previousdate.valueOf() } })
            .then(res => {
                if (res.data.length == 0) {
                    $("#pieDiv").hide();
                }
                else {
                    $("#pieDiv").show();
                    var arr = []
                    arr.push([{ "label": "Happy", "value": res.data.happy, "total": res.data.happy + res.data.sad, "color": '#ffd103' }, { "label": "Sad", "value": res.data.sad, "total": res.data.happy + res.data.sad, "color": '#729DC8' }]);
                    this.setState({ data: arr });
                    this.graph();

                }
            })
    }
    graph() {
        d3.select("#pieDiv").select('svg').remove();
        var radius = this.state.radius;

        var vis = d3.select("#pieDiv")
            .append("svg:svg")
            .data(this.state.data)
            .attr("width", this.state.width)
            .attr("height", this.state.height)
            .append("svg:g")
            .attr("transform", "translate(" + Math.round(this.state.width / 2) + "," + Math.round(this.state.height / 2) + ")");

        var arc = d3.svg.arc()
            .outerRadius(radius);
        var pie = d3.layout.pie()
            .value(function (d) { return d.value; });
        var arcs = vis.selectAll("g.slice")
            .data(pie)
            .enter()
            .append("svg:g")
            .attr("class", "slice");
        arcs.append("svg:path")
            .attr("fill", function (d, i) {
                return d.data.color;
            })
            .attr("d", arc);
        arcs.append("svg:text")
            .attr("transform", function (d) {
                d.innerRadius = 0;
                d.outerRadius = radius;
                return "translate(" + arc.centroid(d) + ")";
            })
            .attr("text-anchor", "middle")
            .text(function (d, i) {
                var percentage = Math.round(d.data.value * 100 / d.data.total) + "%";
                return percentage == "0%" ? "" : percentage
            });
    }
    render() {
        return (
            <div id="pieDiv"></div>
        );
    }
}