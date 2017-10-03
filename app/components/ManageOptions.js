"use strict";

import React from 'react';
import { connect } from 'react-redux'
import axios from 'axios';
import AddUpdateOption from './AddUpdateOption'
import OptionRows from './OptionRows';
import { OptionGridActionType } from '../actionTypes/OptionGridActionType'
import { ManageOptionActionType } from '../actionTypes/ManageOptionActionType'
import { loadOptions } from '../actionCreators/OptionGridActionCreator'

const AddOptionButton = function (props) {
    return (
        <div className="pull-right">
            <button type="button" data-toggle="modal" data-target="#AddUpdateOptionPopup" className="btn btn-success" {...props}>Add New</button>
        </div>
    );
}

const NotificationMessage = function (props) {
    return (
        <div className="alert alert-success alert-margin-top" role="alert">
            {props.message}
        </div>
    );
}

const NoRecordFound = function (props) {
    return (
        <div className="alert alert-info" role="alert">
            No record found.
        </div>
    );
}

const OptionGrid = function (props) {
    return (
        <div>
            <table className="table table-hover">
                <thead>
                    <tr >
                        <th className="col-xs-6">Option</th>
                        <th className="col-xs-6">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {props.data !== undefined && props.data.length > 0 ? props.renderRows(props.data) : null}
                </tbody>
            </table>
        </div>
    );
}

class ManageOptionComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 'happy', options: [],
            isAddOptionPopupVisible: false,
            manageOptionAction: null,
            isAddButtonVisible: false,
            isNoRecordFoundVisible: false,
            isNotificationMessageVisible: false,
            notificationMessage: ''
        };
        this.renderRows = this.renderRows.bind(this);
    }

    componentDidMount() {
        this.props.loadGridOptions(this.props.selectedOptionType);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isReloadRequired)
            this.props.loadGridOptions(this.props.selectedOptionType);
    }

    renderRows(data) {
        let optionsList = []
        data.forEach((currentOption) => {
            optionsList.push(<OptionRows key={currentOption._id} {...currentOption} onAfterDelete={this.loadOptions} onAfterUpdate={this.loadOptions} />);
        });

        return optionsList;
    }

    render() {
        return (
            <div>
                <div className="page-header h2">
                    Manage Options
                </div>
                {
                    this.props.isAddButtonVisible ?
                        <AddOptionButton onClick={() => this.props.showAddOptionPopup(this.props.selectedOptionType)} /> :
                        null
                }
                <div >
                    <div>
                        <div className="btn-group">
                            <button type="button" className={`btn btn-primary ${this.state.type.toLocaleLowerCase() === "happy" ? "active" : ''}`}
                                onClick={this.props.tabChange}>Happy</button>
                            <button type="button" className={`btn btn-primary ${this.state.type.toLocaleLowerCase() === "sad" ? "active" : ''}`}
                                onClick={this.props.tabChange}>Sad</button>
                        </div>
                    </div>

                    {this.state.isNotificationMessageVisible ? <NotificationMessage message={this.state.notificationMessage} /> : null}

                    <OptionGrid data={this.props.options} renderRows={this.renderRows} />

                    {this.state.isNoRecordFoundVisible ? <NoRecordFound /> : null}

                    <AddUpdateOption />
                </div>
            </div >
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        options: state.manageOption.options,
        selectedOptionType: state.manageOption.selectedOptionType,
        isAddButtonVisible: state.manageOption.isAddButtonVisible,
        isAddOptionPopupVisible: state.manageOption.addOptionPopup.show,
        isReloadRequired: state.manageOption.isReloadRequired,
        isNoRecordFoundVisible: state.manageOption.isNoRecordFoundVisible
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        loadGridOptions: (selectedOptionType) => dispatch(loadOptions(selectedOptionType)),

        tabChange: (event) => {
            dispatch({
                type: OptionGridActionType.TAB_CHANGE,
                payload: { selectedOptionType: event.target.innerHTML }
            });
            dispatch(loadOptions(event.target.innerHTML));
        },

        showAddOptionPopup: (selectedOptionType) => {
            dispatch({
                type: ManageOptionActionType.SHOW_ADD_OPTION_MODAL,
                payload: { selectedOptionType }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageOptionComponent);
