import React, { Component } from 'react'
import { Button, Icon, Text, Left, Body, Right, Header, Title, StyleProvider, Container, Item, Label, Input } from 'native-base'
import { StyleSheet, BackHandler, ToastAndroid, View} from 'react-native'
import { Actions } from 'react-native-router-flux'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'

export default class Newsletter extends Component {

    state = {
        name: '',
        email: '',
        disabled: false,
        subscribed: false
    }


    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    checkList = () => {
        if (this.state.email == '' || this.state.name == '') {
            return ToastAndroid.show('Both fields are required', ToastAndroid.SHORT)
        }
        this.setState({disabled: true})
        let authenticationString = btoa('youthparty:b0581a8215d7c08b6d44b8fd77efbe32-us17')
        authenticationString = "Basic " + authenticationString;
        fetch('https://us17.api.mailchimp.com/3.0/lists/cffa00240d/members', {
            mode: 'no-cors',
            method: 'POST',
            headers: {
              'authorization': authenticationString,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email_address: this.state.email, 
              status: "subscribed",
              merge_fields: {
                FNAME: this.state.name
              }
            })
          }).then(res => {
              this.setState({disabled: false})
              if(res.status == 400) {
                  ToastAndroid.show('You are already Subscribed', ToastAndroid.SHORT)
              }
              else if(res.status == 200) {
                  this.setState({subscribed: true})
              }
          }).catch(err =>  {
              this.setState({disabled: false})
              console.log(err)
            })
        }


    onBackPress () {
        Actions.pop()
        return true
    }
    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <Header noShadow>
                        <Left>
                            <Button onPress={() => Actions.pop()} transparent>
                                <Icon name="arrow-back" style={{ color: '#fff'}}/>
                            </Button>
                        </Left>
                        <Body>
                            <Title>Newsletter</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    {this.state.subscribed ? 
                    <Text>Thank you for subscribing</Text>
                    :
                    <View style={styles.form}>
                        <Item stackedLabel style={styles.item}>
                            <Label style={{color: '#444'}}>EMAIL ADDRESS</Label>
                            <Input
                                style={{ paddingVertical: 0}}  
                                onChangeText={(email) => this.setState({email})}
                                keyboardType="email-address" />
                        </Item>
                        <Item stackedLabel style={styles.item}>
                            <Label style={{color: '#444'}}>NAME</Label>
                            <Input
                                style={{ paddingVertical: 0}}  
                                onChangeText={(name) => this.setState({name})}
                            />
                            </Item>
                        <View style={styles.buttonContainer}>
                            <Button disabled={this.state.disabled} block onPress={() => this.checkList()}>
                                <Text>Subscribe</Text>
                            </Button>
                        </View>
                    </View>
                    }
                        
                    </View>
                </Container>
            </StyleProvider>
        )
    }
}

const styles = StyleSheet.create({
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
})
