import axios from 'axios';
import { addOption } from '../actionCreators/ManageOptionActionCreator'
import { ManageOptionActionType } from '../actionTypes/ManageOptionActionType'

const initialState = {
    show: false,
    isReloadRequired: false
};

export default function addOptionReducer(state = initialState, action) {
    switch (action.type) {

        case ManageOptionActionType.ADD_OPTION:
            //return addOption();
            // state = Object.assign({},
            //     state,
            //     {
            //         option: action.option,
            //         type: action.selectedOptionType,
            //         isActive: true
            //     });
            break;

        case ManageOptionActionType.SHOW_ADD_OPTION_MODAL:
            state = Object.assign({}, state, { isAddOptionPopupVisible: true, type: action.payload.selectedOptionType });
            break;
        case ManageOptionActionType.HIDE_ADD_OPTION_MODAL:
            state = Object.assign({}, state, { isAddOptionPopupVisible: false, isReloadRequired: false });
            break;
        case ManageOptionActionType.ADD_OPTION_SUCCESS:
            state = Object.assign({}, state, { isAddOptionPopupVisible: false, isReloadRequired: true });
            break;

        default:
            //state = { ...state };
            break;
    }
    return state;
}

