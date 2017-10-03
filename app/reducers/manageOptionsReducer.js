import { OptionGridActionType } from '../actionTypes/OptionGridActionType'
import { ManageOptionActionType } from '../actionTypes/ManageOptionActionType'

const initialaddOptionPopup = {
    show: false,
    option: '',
    error: '',
    hasError: false
};

const initialState = {
    options: [],
    selectedOptionType: 'Happy',
    isAddButtonVisible: false,
    isReloadRequired: false,
    isNoRecordFoundVisible: false,
    addOptionPopup: initialaddOptionPopup
};

export default function manageOptionsReducer(state = initialState, action) {
    switch (action.type) {
        // Manage option page actions
        case OptionGridActionType.TAB_CHANGE:
            state = { ...state, selectedOptionType: action.payload.selectedOptionType };
            break;
        case OptionGridActionType.SHOW_ADD_OPTION_BUTTON:
            state = { ...state, isAddButtonVisible: true };
            break;
        case OptionGridActionType.HIDE_ADD_OPTION_BUTTON:
            state = { ...state, isAddButtonVisible: false };
            break;
        case OptionGridActionType.SHOW_ADD_OPTION_MODAL:
            state = {
                ...state,
                addOptionPopup: {
                    ...state.addOptionPopup, show: true
                }
            };
            break;
        case OptionGridActionType.HIDE_ADD_OPTION_MODAL:

            state = {
                ...state,
                addOptionPopup: {
                    ...state.addOptionPopup, ...initialaddOptionPopup,
                }
            };
            break;

        // Option grid actions -----------------------------------------
        case OptionGridActionType.GET_OPTIONS_SUCCESS:
            state = { ...state, options: action.payload.options, isReloadRequired: false };
            break;



        // Add option popup actions  -------------------------------------------------------------
        case OptionGridActionType.ADD_OPTION_ONCHANGE:
            state = {
                ...state,
                addOptionPopup: {
                    ...state.addOptionPopup, option: action.payload.option
                }
            };
            break;

        case OptionGridActionType.ADD_OPTION_SUCCESS:
            state = {
                ...state,
                isReloadRequired: true,
                addOptionPopup: {
                    ...state.addOptionPopup, ...initialaddOptionPopup
                }
            };
            break;

        case OptionGridActionType.INVALID_ADD_OPTION:
            state = {
                ...state,
                addOptionPopup: {
                    ...state.addOptionPopup, error: "Please enter option.", hasError: true
                }
            };
        case OptionGridActionType.ADD_OPTION_FAIL:
            state = {
                ...state,
                addOptionPopup: {
                    ...state.addOptionPopup, error: "Some error occured while adding option. Please try after sometime.", hasError: true
                }
            };
            break;
        default:
            //state = { ...state };
            break;
    }
    return state;
}