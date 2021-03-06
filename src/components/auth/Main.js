import React, { Component } from 'react'
import { View, StyleSheet, Image, ScrollView, BackHandler, Linking} from 'react-native'
import { Button, Text } from 'native-base'
import { Actions } from 'react-native-router-flux'

export default class Main extends Component {
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress () {
        BackHandler.exitApp()
    }

    openTerms = () => {
        Linking.openURL('https://youthpartyng.com/wp-content/uploads/2015/10/YP-MOBILE-APP-TERMS-AND-CONDITIONS.pdf').catch(err => console.log(err))
    }

    openPrivacy = () => {
        Linking.openURL('https://youthpartyng.com/wp-content/uploads/2015/10/Privacy-Policy-for-Youth-Party2.pdf').catch(err => console.log(err))
    }
    openManual = () => {
        Linking.openURL('https://youthpartyng.com/wp-content/uploads/2015/10/YP-App-Manual.pdf').catch(err => console.log(err))
    }


    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.pictureCont}>
                        <Image source={require('../logo.png')} resizeMode="stretch" style={styles.logo}/>
                        <Text style={styles.text}>Welcome to Youth Party</Text>
                    </View>
                    <Text style={styles.text2}>Seeking to serve and unite Nigerians</Text> 
                    <View style={styles.buttonContainer}>
                        <Button style={{backgroundColor: '#F0BA00'}}onPress={() => Actions.login()} block>
                            <Text>Log In</Text>
                        </Button>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button style={{backgroundColor: '#82BE30'}} onPress={() => Actions.register1()} block>
                            <Text>Sign Up</Text>
                        </Button>
                    </View>
                    <View style={styles.policy}>
                        <Text style={styles.policyText}>
                        By logging in, you agree to our <Text onPress={() => this.openPrivacy()} style={styles.policyLink}>Privacy Policy</Text> & 
                        <Text  onPress={() => this.openTerms()} style={styles.policyLink}>Terms of Service</Text>
                        </Text>
                    </View>
                    <View style={styles.policy2}>
                        <Text style={styles.policyText}>
                        Click <Text onPress={() => this.openManual()} style={styles.policyLink}>this link</Text> to get app manual
                        </Text>
                    </View>
                </View>
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        width: '80%',
        alignSelf: 'center',
        flex: 1
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
        marginTop: 30,
        marginBottom: 10,
        fontSize: 24,
        color: '#82BE30',
        textAlign: 'center',
    },
    text2: {
        textAlign: 'center',
        color: '#0D212A',
        fontSize: 18,
        marginBottom: 70,

    },
    buttonContainer: {
        width: '100%',
        alignSelf: 'center',
        marginTop: 10
    },
    item: {
        marginTop: 20
    },
    policy: {
        width: '85%',
        alignSelf: 'center',
        marginTop: 40
    },
    policy2: {
        width: '85%',
        alignSelf: 'center',
        marginTop: 20
    },
    policyText: {
        textAlign: 'center',
        color: '#777',
        fontSize: 16
    },
    policyLink: {
        color: '#82BE30'
    },
    
})