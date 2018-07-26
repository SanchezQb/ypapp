import React, { Component } from 'react'
import { WebView } from 'react-native'

export default class File extends Component {
    render() {
        let source = 'bundle-assets://android/app/src/main/assets/pdf/userGuide.pdf'
        return (
            <WebView
                source={{uri: source}}
            />
        )
    }
}