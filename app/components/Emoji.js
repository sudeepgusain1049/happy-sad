/**
 * Created by sonamyadav on 6/6/17.
 */

import React, { Component } from 'react';
import axios from 'axios';
const sadQuotes = [
    ["BE STRONG because things will get better it might be stormy now but it can't rain forever"],
    ["The more you praise and celebrate your life, the more there is in life to celebrate."],
    ["With every rising of the sun think of your life as just begun."],
    ["Life is too short for us to dwell on sadness. Cheer up and live life to the fullest."]
]

class Emoji extends Component {
    constructor(props) {
        super(props);
        this.state = { data: [] };
    }
    handleCommentSubmit(feedback) {

        axios.post("http://34.193.92.171:3002/api/feedback", {
            feedback: feedback
        }).then(res => {         
            var rdmQuote = Math.floor(Math.random() * sadQuotes.length);
            if (feedback == "SAD") {
                $("#text").text(sadQuotes[rdmQuote])
            }
            else if (feedback == "HAPPY") {
                $("#text").text("Nice to hear that..stay happy stay healthy!! ")
            }
            else {
                $("#text").text("cheer up..Being happy never goes out of style!!")
            }
        })
    }
    render() {
        return (
            <div className="aspectwrapper">
                <div className='container'>
                    <h1>How are you feeling today ?</h1>
                    <img src='./public/img/happy.png' onClick={this.handleCommentSubmit.bind(this, "HAPPY")} id="first" />
                    <img src='./public/img/neutral1.png' onClick={this.handleCommentSubmit.bind(this, "neutral")} id="second" />
                    <img src='./public/img/sad2.png' onClick={this.handleCommentSubmit.bind(this, "SAD")} id="third" />
                    <div>
                        <p id="text"></p>
                    </div>
                </div>
            </div>
        )
    }
}
export default Emoji;
