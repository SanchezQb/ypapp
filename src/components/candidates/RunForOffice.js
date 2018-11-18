import React, { Component } from 'react'
import { Button, Icon, Text, Left, Body, Right, Header, Title, StyleProvider, Container } from 'native-base'
import { View, StyleSheet, BackHandler, ScrollView, Linking } from 'react-native'
import { Actions } from 'react-native-router-flux'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'

export default class RunForOffice extends Component {

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

    sendMail = () => {
        Linking.openURL('mailto:info@youthpartyng.com').catch(err => console.error('An error occurred', err));
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
                            <Title>Run for Office</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <ScrollView>
                    <View style={styles.container}>
                        <View style={styles.content}>
                            <Text style={styles.text2}>Send an email to <Text onPress={() => this.sendMail()}style={{color: '#82BE30'}}>info@youthparty.ng</Text> to submit your run for office request</Text>
                        </View>
                    </View>
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
    },
    icon: {
        fontSize: 60,
        color: '#82BE30',
        alignSelf: 'center'
    },
    button: {
        backgroundColor: '#82BE30',
        alignSelf: 'center'
    },
    buttonContainer: {
        width: '60%',
        alignSelf: 'center'
    },
    text: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginVertical: 40
    },
    text2: {
        textAlign: 'center',
        fontSize: 18,
        alignSelf: 'center',
        color: '#333'
    }
})