import { OptionGridActionType } from '../actionTypes/OptionGridActionType'
import axios from 'axios';

export function loadOptions(type) {
    return (dispatch, getState) => {

        dispatch({ type: OptionGridActionType.LOAD_OPTIONS });

        axios.get("http://localhost:3002/api/feedbackOptions",
            { params: { status: "all", type: type.toLowerCase(), size: 10 } })
            .then(res => {
                if (res.data.length == 0) {

                    dispatch({ type: OptionGridActionType.NO_RECORD_FOUND });

                    if (!getState().isAddButtonVisible) {
                        dispatch({
                            type: OptionGridActionType.SHOW_ADD_OPTION_BUTTON,
                            payload: { isAddButtonVisible: true }
                        });
                    }
                }
                else {

                    dispatch({
                        type: OptionGridActionType.GET_OPTIONS_SUCCESS,
                        payload: { options: res.data }
                    });                    

                    if (getState().isAddButtonVisible) {
                        if (res.data.length >= 10) {
                            dispatch({ type: OptionGridActionType.HIDE_ADD_OPTION_BUTTON });
                        }
                    } else {
                        if (res.data.length < 10) {
                            dispatch({ type: OptionGridActionType.SHOW_ADD_OPTION_BUTTON });
                        }
                    }
                }
            });
    };
}