"use strict";

import React from 'react';
import axios from 'axios';

export default class OptionRows extends React.Component {
    constructor(props) {
        super(props);
        this.removeOption = this.removeOption.bind(this);
    }

    componentDidMount() {
        let chkActive = $(this.refs.chkActive);

        chkActive.bootstrapToggle({
            on: 'Active',
            off: 'InActive'
        });

        chkActive.bootstrapToggle(this.props.isActive ? 'on' : 'off').change(function () {
            let updatedOption = {
                optionId: $(this).prop('id'),
                isActive: $(this).prop('checked')
            };
            axios.put("http://localhost:3002/api/feedbackOptions", updatedOption)
                .then(res => {
                    if (res.status === 200) {
                        //this.props.onAfterUpdate('Option '+ $(this).prop('checked') ? 'activaded' : 'deactivated' + ' successfully.');
                    }
                }).catch(error => {
                    //this.props.onAfterUpdate("There is some issue while "+ $(this).prop('checked') ? 'activaded' : 'deactivated' +  " option. Please try after sometime.");                    
                });
        });
    }

    removeOption(event) {
        //event.target.setAttribute("disabled", "disabled");         
        event.preventDefault();
        let optionTobeDeleted = { optionId: this.props._id };
        axios.delete("http://localhost:3002/api/feedbackOptions", { data: optionTobeDeleted })
            .then(res => {
                if (res.status === 200) {
                    this.props.onAfterDelete("Option deleted successfully.");
                }
            }).catch(error => {
                this.props.onAfterDelete("There is some issue while deleting option. Please try after sometime.");
            });
    }

    render() {
        return (
            <tr>
                <td>{this.props.option}</td>
                <td>
                    <a href="#" ref="btnDelete" className="btn btn-info btn-md margin-right" onClick={this.removeOption}>
                        <span className="glyphicon glyphicon-trash"></span>
                    </a>

                    <input type="checkbox" id={this.props._id}
                        ref="chkActive"
                        data-style="ios"
                        data-toggle="toggle"
                        data-on="Enabled"
                        data-off="Disabled" />
                </td>
            </tr>
        );
    }
}