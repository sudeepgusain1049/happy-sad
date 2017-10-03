"use strict";

import React, { Component } from 'react';

const Confirm = (props) => {
    return (
        <div className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 className="modal-title">{this.props.header}</h4>
                    </div>
                    <div className="modal-body">
                        {this.props.body}
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-default" data-dismiss="modal">Cancel</button>
                        <button type="submit" className="btn btn-primary" onClick={this.props.onConfirm}>Confirm</button>
                    </div>
                </div >
            </div >
        </div>
    );
}

export default Confirm;