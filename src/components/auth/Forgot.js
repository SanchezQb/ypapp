import React, { Component } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { Button, Text ,Item, Input } from 'native-base'

export default class Forgot extends Component {

    state = {
        email: ''
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.pictureCont}>
                    <Image source={require('../logo.png')} resizeMode="stretch" style={styles.logo}/>
                    <Text style={styles.text}>Forgot your password?</Text>
                </View>
                <Text style={styles.text2}>Enter your registered email address 
                to receive password reset instructions</Text> 
                <Item style={styles.item}>
                    <Input
                        onChangeText={(email) => this.setState({email})} 
                        placeholderTextColor="#ccc"
                        placeholder="Email Address" />
                </Item>
                <View style={styles.buttonContainer}>
                    <Button block>
                        <Text>Reset Passsword</Text>
                    </Button>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        width: '80%',
        alignSelf: 'center'
    },
    pictureCont: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100
    },
    logo: {
        width: 114,
        height: 92,  
    },
    text: {
        marginVertical: 30,
        fontSize: 24,
        color: '#82BE30',
        textAlign: 'center'
    },
    text2: {
        marginVertical: 30,
        textAlign: 'center',
        color: '#777',
        fontSize: 18

    },
    buttonContainer: {
        width: '100%',
        alignSelf: 'center',
        marginTop: 30
    },
    item: {
        marginTop: 20
    }
    
})