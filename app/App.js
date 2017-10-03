import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router'
import Emoji from './components/Emoji'
import comparisonGraph from './components/Graph'
import CustomPieGraph from './components/customPieGraph'
import PreviousStackGraph from './components/PreviousStackGraph'
import ManageOptionComponent from './components/ManageOptions'

import { scsscss } from './scss/style.scss'
import store from './store';

class App extends Component {
    render() {
        return (
            <Provider store={store} >
                <Router history={hashHistory}>
                    <Route path='/' component={Emoji} />
                    <Route path='/Graph' component={comparisonGraph} />
                    <Route path='/PieGraph' component={CustomPieGraph} />
                    <Route path='/PreviousStackGraph' component={PreviousStackGraph} />
                    <Route path='/ManageOptions' component={ManageOptionComponent} />
                </Router>
            </Provider>
        )
    }
}

export default App
