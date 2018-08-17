import React, { Component } from 'react'
import { Button, Icon, Text, Left, Body, Right, Header, Title, StyleProvider, Container } from 'native-base'
import { View, StyleSheet, BackHandler, ScrollView, TextInput, ToastAndroid } from 'react-native'
import { Actions } from 'react-native-router-flux'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'
import { observer } from 'mobx-react/native'
import { StateData } from '../../modules/StateData'
import accountStore from '../../stores/Account';
import axios from 'axios'

@observer
export default class Eligibility extends Component {

    state = {
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
    verifyVin = (data) => {
        if(!this.state.vin || !this.state.vin.length) return ToastAndroid.show('Please enter a valid VIN', ToastAndroid.SHORT)
        if(!accountStore.user.lastname) return ToastAndroid.show('You need a Last Name to verify your VIN', ToastAndroid.SHORT)
        const generateState = () => {
            const items = StateData.filter(item => item.state.name === accountStore.user.state)
            return items.length ? items[0].state.id : ''
        }
        this.setState({disabled: true})
        axios({
            url: `https://ypn-election-02.herokuapp.com/api/verify`, 
            method: 'POST', 
            data: {
                vin: data.vin,
                state_id: generateState(),
                search_mode: 'vin',
                last_name: accountStore.user.lastname
            },
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${accountStore.user.token}`
            },
        }).then(() => {
            this.setState({disabled: false})
            ToastAndroid.show('You have successfully verified your VIN', ToastAndroid.SHORT)
            accountStore.updateUserInfo({vin: data.vin})
        }).catch(err => {
            this.setState({disabled: false})
            ToastAndroid.show(`${err.response ? err.response.data.message : 'Something went wrong, pleasr try again'}`, ToastAndroid.LONG)
        })
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
                            <Title>Voters Eligibility</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <ScrollView keyboardShouldPersistTaps="always">
                        {!accountStore.user.vin ? 
                            <View style={{flex: 1, marginVertical: '30%', paddingHorizontal: 20}}>
                                <Text style={{textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>
                                    You need to verify your VIN (Voters Identification Number) to participate in party elections
                                </Text>
                                <TextInput 
                                    underlineColorAndroid="rgba(0,0,0,0)"
                                    textAlignVertical="top"
                                    style={{borderColor: '#ccc', borderWidth: 1, marginTop: '15%'}}
                                    placeholderTextColor="#a6a6a6" 
                                    onChangeText={(vin) => this.setState({vin})}
                                    placeholder="Enter your VIN here"
                                />
                                <View style={{marginTop: '5%'}}>
                                    <Button disabled={this.state.disabled} block onPress={() => this.verifyVin(this.state)}>
                                        <Text>Verify</Text>
                                    </Button>
                                </View>
                            </View>  
                            :
                            <View style={{flex: 1, marginTop: '30%', paddingHorizontal: 20}}>
                                <Text style={{textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>
                                    You are eligible to participate in party elections
                                </Text>
                                <View style={styles.content}>
                                    <Icon name="ios-checkmark-circle" style={{fontSize: 60, color: '#82BE30', alignSelf: 'center'}}/>
                                </View>
                                <View>
                                    <Button block onPress={() => Actions.pop()}>
                                        <Text>Go back</Text>
                                    </Button>
                                </View>
                            </View> 
                        }
                    </ScrollView>
                </Container>
            </StyleProvider>
        )
    }
}
const styles = StyleSheet.create({
    content: {
       marginVertical: 120,
       width: '60%',
       alignSelf: 'center'
    }
})