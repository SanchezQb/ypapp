import React, { Component } from 'react'
import { Button, Icon, Text, Left, Body, Right, Header, Title, StyleProvider, Container } from 'native-base'
import { View, StyleSheet, BackHandler } from 'react-native'
import { Actions } from 'react-native-router-flux'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'

export default class Accepted extends Component {

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
                            <Title>Donations</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <View style={styles.container}>
                        <View style={styles.content}>
                            <Icon name="ios-checkmark-circle" style={styles.icon}/>
                            <Text style={styles.text}>Your donation has been accepted</Text>
                            <Text style={styles.text2}>Thank you for contributing</Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button onPress={() => Actions.home()} style={styles.button}>
                                <Text>Proceed to Home Page</Text>
                            </Button>
                        </View>
                    </View>
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
        color: '#777'
    }
})