import React, { Component } from 'react'
import { ActivityIndicator, View, StyleSheet, StatusBar, BackHandler } from 'react-native'

export default class Loader extends Component {

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress () {
       BackHandler.exitApp()
    }
    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor="#82BE30"
                    barStyle="light-content"
                />
                 <ActivityIndicator size="large" color="#82BE30"/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    }
})