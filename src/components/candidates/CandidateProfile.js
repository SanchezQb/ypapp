import React, { Component } from 'react'
import { 
    StyleProvider, 
    Header, 
    Left, 
    Body, 
    Right, 
    Button, 
    Icon, Title, Thumbnail, Text } from 'native-base';
import { StyleSheet, View, ScrollView } from 'react-native'
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import { Actions } from 'react-native-router-flux'

export default class CandidateProfile extends Component {

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
                            <Title>Femi Bukola</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <ScrollView>
                        <View style={styles.view}>
                            <View>
                                <Thumbnail large source={require('../profile.png')} style={{alignSelf: 'center'}} />
                                <Text style={{color: '#777', fontSize: 18, textAlign: 'center', marginTop: 10}}>House of Rep</Text>
                                <Text style={{color: '#82BE30', fontSize: 18, textAlign: 'center'}}>Ilorin East, Kwara State</Text>
                                <Text style={{color: '#C8C8C8', fontSize: 18, textAlign: 'center'}}>Age: 42</Text>
                            </View>
                        </View>
                        <View style={{width: '93%', alignSelf: 'center', marginTop: 30}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', color: '#555', marginVertical: 10}}>Femi Bukola's Bio:</Text>
                            <Text style={{fontSize: 16, color: '#555'}}>
                            Philosopher | Human Rights Activist.
                            I believe in an urgent restoration of active and participatory democracy, social justice
                            and good leadership
                            Philosopher | Human Rights Activist.
                            I believe in an urgent restoration of active and participatory democracy, social justice
                            and good leadership
                            </Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button style={styles.button} block>
                                <Text>follow</Text>
                            </Button>
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
        width: '93%',
        alignSelf: 'center',
        marginTop: 70
    },
    button: {
        backgroundColor: '#82BE30',
    },
})

