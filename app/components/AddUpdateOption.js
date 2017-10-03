"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { ManageOptionActionType } from '../actionTypes/ManageOptionActionType'
import { addOption } from '../actionCreators/ManageOptionActionCreator'

const ErrorDiv = function (props) {
    return (
        <div className="alert alert-danger">{props.message}</div>
    );
}

class AddUpdateOptionComponent extends React.Component {
    constructor(props) {
        super(props);
        this.saveOptionHandleClick = this.saveOptionHandleClick.bind(this);
    }

    componentDidMount() {
        if (this.props.isAddOptionPopupVisible) {
            $(this.refs.AddUpdateOptionPopup).modal('show');
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.isAddOptionPopupVisible !== nextProps.isAddOptionPopupVisible) {
            if (!nextProps.isAddOptionPopupVisible)
                $(this.refs.AddUpdateOptionPopup).modal('hide');
            else
                $(this.refs.AddUpdateOptionPopup).modal('show');
        }
    }

    saveOptionHandleClick(event) {
        event.preventDefault();

        this.props.saveOption({
            option: this.props.option,
            isActive: true,
            type: this.props.selectedOptionType
        });
    }

    render() {
        return (
            <div className="modal fade" ref="AddUpdateOptionPopup">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">Add Option</h4>
                        </div>
                        <div className="modal-body">
                            {this.props.hasError ? <ErrorDiv message={this.props.error} /> : null}
                            <form className="form-horizontal" onSubmit={this.Save}>
                                <div className="form-group">
                                    <label className="control-label col-sm-2" htmlFor="txtOption">Option:</label>
                                    <div className="col-sm-10">
                                        <input type="text" className="form-control"
                                            id="txtOption"
                                            placeholder="Enter option"
                                            value={this.props.option}
                                            onChange={(event) => this.props.handleOptionChange(event.target.value.trim())} />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-default" ref="btnPopupClose" data-dismiss="modal">Cancel</button>
                            <button type="submit" className="btn btn-primary" ref="btnSave" onClick={this.saveOptionHandleClick}>Save</button>
                        </div>
                    </div >
                </div >
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        isAddOptionPopupVisible: state.manageOption.addOptionPopup.show,
        type: state.manageOption.type,
        option: state.manageOption.addOptionPopup.option,
        error: state.manageOption.addOptionPopup.error,
        hasError: state.manageOption.addOptionPopup.hasError,
        isReloadRequired: state.manageOption.isReloadRequired,
        selectedOptionType: state.manageOption.selectedOptionType
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        handleOptionChange: (option) => dispatch({
            type: ManageOptionActionType.ADD_OPTION_ONCHANGE,
            payload: { option }
        }),

        validateOption: (option) => dispatch({
            type: ManageOptionActionType.ADD_OPTION_VALIDATE,
            payload: { option }
        }),

        saveOption: (addOptionPayload) => dispatch(addOption(addOptionPayload))
    }
}

export default connect(mapStateToProps, mapDispatchToProps, )(AddUpdateOptionComponent);