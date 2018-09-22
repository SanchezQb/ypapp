import React, { Component } from 'react'
import { 
    StyleProvider,    
    Button,
    Text, 
    Item, Input, Label, Header, Left, Right, Body, Icon, Title
} from 'native-base';
import { StyleSheet, Image, StatusBar, View, ScrollView, BackHandler, ToastAndroid } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import accountStore from '../../stores/Account';
import { observer } from 'mobx-react/native'
import Config from '../../config'
import axios from 'axios'
import { Actions } from 'react-native-router-flux'


@observer
export default class Forgot extends Component {
    state = {
        email: '',
        emailSent: false,
        data: {},
        disabled: false
    }
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
    handlePress = () => {
        if(!this.state.email.length) return ToastAndroid.show('Please enter an email address', ToastAndroid.SHORT)
        this.setState({disabled: true})
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
            <StyleProvider style={getTheme(material)}>
                <React.Fragment>
                    <Header noShadow>
                        <Left>
                            <Button transparent onPress={() => Actions.pop()}>
                                <Icon name="arrow-back" style={{fontSize: 20, color: '#fff'}}/>
                            </Button>
                        </Left>
                        <Body>
                            <Title>Reset Password</Title>
                        </Body>
                        <Right></Right>
                    </Header>
                    <ScrollView keyboardShouldPersistTaps="always">
                        <View style={styles.pictureCont}>
                            <Image source={require('../logo.png')} resizeMode="stretch" style={styles.logo}/>
                            <Text style={styles.text}>Reset Password</Text>
                        </View>
                        {this.state.emailSent ? 
                        <React.Fragment>
                            <Text style={styles.text2}>A Password reset link has been sent to your email</Text> 
                        </React.Fragment>
                        : 
                        <View>
                            <View style={styles.form}>
                                <Item stackedLabel style={styles.item}>
                                    <Label style={{color: '#444'}}>EMAIL</Label>
                                    <Input
                                        style={{paddingVertical: 0}}
                                        onChangeText={(text) => this.setState({ email: text})}
                                    />
                                </Item>
                            </View>
                            <View style={styles.buttonContainer}>
                                <Button disabled={this.state.disabled}onPress={() => this.handlePress()} block>
                                    <Text>Reset Password</Text>
                                </Button>
                            </View>
                        </View>
                        }
                    </ScrollView>
                </React.Fragment>
            </StyleProvider>
        )
    }
}
const styles = StyleSheet.create({
  
    form: {
        width: '85%',
        alignSelf: 'center',
        marginTop: 50
    },
    item: {
        marginBottom: 15,
        borderColor: '#aaa'
    },
    buttonContainer: {
        width: '85%',
        alignSelf: 'center',
        marginTop: 30
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
    
})