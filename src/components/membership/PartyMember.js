import React, { Component } from 'react'
import { Button, Icon, Text } from 'native-base'
import { View, StyleSheet, BackHandler } from 'react-native'
import { Actions } from 'react-native-router-flux'

export default class PartyMember extends Component {
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress () {
       Actions.pop()
       return true
    }
    render() {
        return (
            <View style={styles.container}>
                {/* <View>
                    <Button transparent></Button
                    <Icon name="ios-check" style={styles.icon} />
                    <Text>Subscription successful</Text>
                </View>
                    <Button style={styles.button}>Proceed to Home Page</Button> */}
                <View style={styles.content}>
                    <Icon name="ios-checkmark-circle" style={styles.icon}/>
                    <Text style={styles.text}>Subscription successful</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <Button onPress={() => Actions.home()} style={styles.button}>
                        <Text>Proceed to Home Page</Text>
                    </Button>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    content: {
       marginVertical: 120,
       width: '60%',
       alignSelf: 'center'
    },
    icon: {
        fontSize: 60,
        color: '#82BE30',
        alignSelf: 'center'
    },
    button: {
        backgroundColor: '#82BE30',
        alignSelf: 'center'
    },
    buttonContainer: {
        width: '60%',
        alignSelf: 'center'
    },
    text: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginVertical: 40
    }
})