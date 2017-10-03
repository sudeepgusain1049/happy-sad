import { combineReducers } from 'redux';

// Import all reducers
//import addOptionReducer from './addOptionReducer';
import manageOptionsReducer from './manageOptionsReducer';

const reducers = combineReducers({
    manageOption: manageOptionsReducer,
    //addOption: addOptionReducer
});

export default reducers;
