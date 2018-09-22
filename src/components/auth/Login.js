import React, { Component } from 'react'
import { 
    StyleProvider,    
    Button,
    Text, 
    Item, Input, Label,
} from 'native-base';
import { StyleSheet, ImageBackground, StatusBar, View, ScrollView, BackHandler, ActivityIndicator } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import accountStore from '../../stores/Account';
import { observer } from 'mobx-react/native'
import { Actions } from 'react-native-router-flux'
import Dialog from "react-native-dialog";


@observer
export default class Login extends Component {
    state = {
        email: '',
        password: '',
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

    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <React.Fragment>
                    <StatusBar
                        backgroundColor="#689826"
                    />
                    <ScrollView keyboardShouldPersistTaps="always">
                    <ImageBackground 
                        style={{
                            width: null,
                            height: 200,
                        }}
                        source={require('../pic1.png')}
                        >
                        <LinearGradient
                            start={{x: 0, y: 0}} end={{x: 0, y: 1}} 
                            colors={['rgba(0,0,0,0)','rgba(0,0,0,0.2)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
                            style={styles.linearGradient}>
                            <Text style={styles.welcome}>Welcome To Youth Party</Text>
                            <Text style={styles.welcome2}>Seeking to serve and unite Nigerians</Text>
                        </LinearGradient>
                    </ImageBackground>
                    <View style={styles.form}>
                        <Item stackedLabel style={styles.item}>
                            <Label style={{color: '#444'}}>EMAIL</Label>
                            <Input
                                style={{paddingVertical: 0}}
                                onChangeText={(text) => this.setState({ email: text})}
                            />
                        </Item>
                        <Item stackedLabel style={styles.item}>
                            <Label style={{color: '#444'}}>PASSWORD</Label>
                            <Input 
                                style={{paddingVertical: 0}}
                                onChangeText={(text) => this.setState({ password: text})}
                                secureTextEntry={true}/>
                        </Item>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button disabled={accountStore.disabled} onPress={() => accountStore.login(this.state)} block>
                            <Text>Login</Text>
                        </Button>
                    </View>
                    <View style={styles.CardItem}>
                        <Text onPress={() => Actions.register1()} style={{color: '#777', fontSize: 18}}>Signup</Text>
                        <Text onPress={() => Actions.forgot()} style={{color: '#777', fontSize: 18}}>Forgot Password?</Text>
                    </View>
                    <View style={styles.policy}>
                        <Text style={styles.policyText}>
                        By logging in, you agree to our <Text style={styles.policyLink}>Privacy Policy</Text> & 
                        <Text style={styles.policyLink}>Terms of Service</Text>
                        </Text>
                    </View>
                    <Dialog.Container visible={accountStore.visible}>
                        <Dialog.Title style={{textAlign: 'center'}}>Logging In</Dialog.Title>
                        <View style={{marginVertical: '5%'}}>
                            <ActivityIndicator />
                        </View>
                    </Dialog.Container>     
                    </ScrollView>
                </React.Fragment>
            </StyleProvider>
        )
    }
}
const styles = StyleSheet.create({
    welcome: {
        color: '#fff',
        fontSize: 27,
        textAlign: 'center',
        top: '60%',
        fontSize: 22
    },
    welcome2: {
        textAlign: 'center',
        color: '#eee',
        fontSize: 18,
        top: '61%',    
    },
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
    CardItem: {
        width: '85%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        marginVertical: 10
    },
    policy: {
        width: '75%',
        alignSelf: 'center',
        flex: 1,
        marginTop: 30
    },
    policyText: {
        textAlign: 'center',
        color: '#777'
    },
    policyLink: {
        color: '#82BE30'
    },
    modalContent: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    linearGradient: {
        flex: 1,
        borderWidth: 0,
        height: '100%',
        borderColor: 'rgba(0,0,0,0)',
        height: 200
    },
})