import React, { Component } from 'react'
import { 
    StyleProvider, 
    Header, 
    Left, 
    Body, 
    Right, 
    Button, 
    Icon, Title, Thumbnail, Text } from 'native-base';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native'
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import { Actions } from 'react-native-router-flux'


export default class Event extends Component {

    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <View>
                    <Header>
                        <Left>
                            <Button transparent onPress={() => Actions.pop()}>
                                <Icon name="arrow-back" style={{color: '#fff'}}/>
                            </Button>
                        </Left>
                        <Body>
                            <Title>Event</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <ScrollView>
                        <View style={styles.view}>
                            <View>
                                <Thumbnail large source={require('../profile.png')} style={{alignSelf: 'center'}} />
                                <Text style={{color: '#555', fontSize: 18, textAlign: 'center', marginTop: 10}}>Capacity Building Workshop</Text>
                                <Text style={{color: '#82BE30', fontSize: 18, textAlign: 'center'}}>20th June, 2018</Text>
                                <Text style={{color: '#555', fontSize: 18, textAlign: 'center'}}>3:00PM</Text>
                            </View>
                        </View>
                        <View style={{width: '93%', alignSelf: 'center', marginTop: 30}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', color: '#555', marginVertical: 10}}>Location</Text>
                            <Text style={{fontSize: 16, color: '#222'}}>
                                Allen Avenue, Ikeja, Lagos State
                            </Text>
                        </View>
                        <View style={{width: '93%', alignSelf: 'center', marginTop: 30}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', color: '#555', marginVertical: 10}}>Event Details</Text>
                            <Text style={{fontSize: 16, color: '#222'}}>
                            Philosopher | Human Rights Activist.
                            I believe in an urgent restoration of active and participatory democracy, social justice
                            and good leadership
                            Philosopher | Human Rights Activist.
                            I believe in an urgent restoration of active and participatory democracy, social justice
                            and good leadership
                            </Text>
                        </View>
                        <View style={styles.attend}>
                            <Text style={{color: '#444', textAlign: 'center'}}>Attend Event?</Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={{backgroundColor: '#82BE30', width: 80, paddingVertical: 10, borderRadius: 4}}>
                                <Text style={{textAlign: 'center', color: '#fff'}}>YES</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{backgroundColor: 'red', width: 80, paddingVertical: 10, borderRadius: 4}}>
                                <Text style={{textAlign: 'center', color: '#fff'}}>NO</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{backgroundColor: '#F0BA00', width: 80, paddingVertical: 10, borderRadius: 4}}>
                                <Text style={{textAlign: 'center', color: '#fff'}}>MAYBE</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </StyleProvider>
        )
    }
}
const styles = StyleSheet.create({
    view: {
       marginTop: 30,
       borderColor: '#ccc',
       borderBottomWidth: 1,
       paddingBottom: 20,
       width: '93%',
       alignSelf: 'center'
    },
    buttonContainer: {
        marginTop: 30,
        flexDirection: 'row',
        width: '93%',
        alignSelf: 'center',
        justifyContent: 'space-around'
    },
    attend: {
        marginTop: 30,
        width: '93%',
        alignSelf: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: '#777',
        borderTopWidth: 1
    }
})
