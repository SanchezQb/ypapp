import React, { Component } from 'react'; 
import { 
    StyleSheet,  
    TouchableOpacity, 
    Image, 
    ScrollView, View, ToastAndroid, BackHandler
} from 'react-native'
import { 
    StyleProvider,   
    Body,  
    Header,
    Button, 
    Title, 
    Item, Input, Label, Left, Right, Icon, Text
} from 'native-base';
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import accountStore from '../../stores/Account'
import { observer } from 'mobx-react/native'
import { Actions } from 'react-native-router-flux'


@observer
export default class Register2 extends Component {
    state = {
        ...this.props.data
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

    userProfile = () => {
        if(!this.state.image) {
            return (
                <Image source={require('../logo.png')} resizeMode="center" style={styles.dp}/>
            )
        }
        else {
            return (
                <Image source={{uri: this.state.image}} style={styles.dp}/>
            )
        }
    }

    submit = () => {
        if(this.state.email == '' || this.state.username == '' || this.state.phone == '') {
            ToastAndroid.show('All fields required', ToastAndroid.SHORT)
        }
        else if(this.state.password !== this.state.password2) {
            ToastAndroid.show('Passwords do not match', ToastAndroid.SHORT)
        }
        else {
            accountStore.registerUser(this.state)
        }
        
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
                            <Title>Registration</Title>
                        </Body>
                        <Right></Right>
                    </Header>
                    <View style={styles.span}>
                    </View>
                    <TouchableOpacity style={styles.dpcont}>
                        {this.userProfile()}
                    </TouchableOpacity>
                    <ScrollView keyboardShouldPersistTaps="always">
                        <View style={styles.form}>
                            <Item stackedLabel style={styles.item}>
                                <Label style={{color: '#444'}}>EMAIL ADDRESS</Label>
                                <Input
                                    style={{ paddingVertical: 0}}  
                                    onChangeText={(email) => this.setState({email})}
                                    keyboardType="email-address" />
                            </Item>
                            <Item stackedLabel style={styles.item}>
                                <Label style={{color: '#444'}}>USERNAME</Label>
                                <Input
                                    style={{ paddingVertical: 0}}  
                                    onChangeText={(username) => this.setState({username})}
                                 />
                            </Item>
                            <Item stackedLabel style={styles.item}>
                                <Label style={{color: '#444'}}>PHONE NUMBER</Label>
                                <Input 
                                    style={{ paddingVertical: 0}} 
                                    onChangeText={(phone) => this.setState({phone: phone})}
                                    keyboardType="numeric"/>
                            </Item>
                            <Item stackedLabel style={styles.item}>
                                <Label style={{color: '#444'}}>PASSWORD</Label>
                                <Input 
                                    style={{ paddingVertical: 0}} 
                                    onChangeText={(password) => this.setState({password})}
                                    secureTextEntry={true}/>
                            </Item>
                            <Item stackedLabel style={styles.item}>
                                <Label style={{color: '#444'}}>CONFIRM PASSWORD</Label>
                                <Input 
                                    style={{ paddingVertical: 0}} 
                                    onChangeText={(password2) => this.setState({password2})}
                                    secureTextEntry={true}/>
                            </Item>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button disabled={accountStore.disabled} block onPress={() => this.submit()}>
                                <Text>Submit</Text>
                            </Button>
                        </View>
                        <View style={styles.login}>
                            <Text style={styles.loginText}>
                                Already a member? Click to <Text onPress={() => Actions.login()}style={styles.loginLink}>Log In</Text>
                            </Text>
                        </View>
                    </ScrollView>
                </React.Fragment>
            </StyleProvider>
        )
    }
}
const styles = StyleSheet.create({
    span: {
        height: 90,
        backgroundColor: '#82BE30',    
    },
    dpcont: {
        backgroundColor: '#f2f2f2',
        height: 90,
        borderRadius: 45,
        width: 90,
        alignSelf: 'center',
        position: 'absolute',
        top: 90,
        zIndex: 200,
        alignItems: 'center'
    },
    dp: {
        height: 80,
        borderRadius: 40,
        width: 80,
        zIndex: 200,
        alignSelf: 'center'
    },
    form: {
        width: '85%',
        alignSelf: 'center',
        marginTop: 70
    },
    item: {
        marginBottom: 15,
        zIndex: -100
    },
    buttonContainer: {
        width: '85%',
        alignSelf: 'center',
        marginTop: 30
    },
    button: {
        backgroundColor: '#82BE30',
    },
    login: {
        width: '75%',
        alignSelf: 'center',
        flex: 1
    },
    loginText: {
        marginTop: 10,
        textAlign: 'center',
        color: '#777',
        fontSize: 18
    },
    loginLink: {
        color: '#82BE30',
        fontSize: 18
    }
})