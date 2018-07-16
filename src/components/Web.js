import React, { Component } from 'react'
import { WebView, BackHandler } from 'react-native'
import { Actions } from 'react-native-router-flux'

export default class Web extends Component {

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress () {
        Actions.pop()
        return true;
    }
    
    render() {
        return (
            <WebView
                source={{uri: this.props.data}}
                style={{flex: 1}}
            />
        )
    }
}