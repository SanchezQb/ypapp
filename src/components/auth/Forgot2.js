import React, { Component } from 'react'
import { View, StyleSheet, Image, ToastAndroid, ScrollView } from 'react-native'
import { Button, Text ,Item, Input } from 'native-base'
import Config from '../../config'
import axios from 'axios'

export default class Forgot extends Component {

    state = {
        email: '',
        emailSent: false,
        data: {},
        disabled: false
    }

    handlePress = () => {
        this.setState({disabled: true})
        if(!this.state.email.length) return ToastAndroid.show('Please enter an email address', ToastAndroid.SHORT)
        axios({
            url: `${Config.baseUrl}/fetch`,
            method: 'POST',
            data: {
                user: {
                    email: this.state.email
                }
            }
        }).then((res) => {
            console.log(res.data.data)
            this.sendResetPassword(res.data.data)
        }).catch(err => {
            console.log(err)
            this.setState({disabled: false})
            ToastAndroid.show('Sorry, this email address does not exist on the platform', ToastAndroid.SHORT)
        })

    }

    sendResetPassword = (data) => {
        axios({
            method: 'POST',
            url: `${Config.baseUrl}/send/reset/password/${data.id}`
        }).then(res => {
            this.setState({emailSent: true, data, disabled: false})
        }).catch(err => {
            this.setState({disabled: false})
            ToastAndroid.show('Sorry, that request could not be completed, please try again', ToastAndroid.LONG)
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.pictureCont}>
                    <Image source={require('../logo.png')} resizeMode="stretch" style={styles.logo}/>
                    <Text style={styles.text}>Reset Password</Text>
                </View>
                {this.state.emailSent ? 
                <React.Fragment>
                    <Text style={styles.text2}>A Password reset link has been sent to your email</Text> 
                </React.Fragment>
                : 
                <ScrollView keyboardShouldPersistTaps="always">
                    <Text style={styles.text2}>Enter your registered email address 
                    to receive password reset instructions</Text> 
                    <Item style={styles.item}>
                        <Input
                            onChangeText={(email) => this.setState({email})} 
                            placeholderTextColor="#ccc"
                            placeholder="Email Address" />
                    </Item>
                    <View style={styles.buttonContainer}>
                        <Button disabled={this.state.disabled} onPress={() => this.handlePress()}style={{backgroundColor: '#82BE30'}}block>
                            <Text>Reset Passsword</Text>
                        </Button>
                    </View>
                </ScrollView>
                }
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
        marginTop: '10%'
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