import React, { Component } from 'react'
import { Button, Icon, Text, Left, Body, Right, Header, Title, StyleProvider, Container } from 'native-base'
import { View, StyleSheet, BackHandler, ScrollView, TextInput } from 'react-native'
import { Actions } from 'react-native-router-flux'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'

export default class VoteDone extends Component {

    state = {
        eligible: false,
        vin: null
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
                    {/* copy from here */}
                    <ScrollView>
                        {!this.state.eligible ? 
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
                                    <Button block onPress={() => this.setState({eligible: !this.state.eligible})}>
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