import { OptionGridActionType } from '../actionTypes/OptionGridActionType'
import axios from 'axios';

export function addOption(addOptionPayload) {
    return (dispatch, getState) => {

        if (addOptionPayload.option === '') {
            dispatch({
                type: OptionGridActionType.INVALID_ADD_OPTION
            });
            return;
        }

        axios.post("http://localhost:3002/api/feedbackOptions", addOptionPayload)
            .then(res => {
                if (res.status === 200) {
                    dispatch({ type: OptionGridActionType.ADD_OPTION_SUCCESS });
                }
            }).catch(error => {
                dispatch({ type: OptionGridActionType.ADD_OPTION_FAIL });
            });
    };
}