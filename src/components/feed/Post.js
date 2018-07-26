import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Button, Icon, Text, Left, Body, Right, Header, Title, StyleProvider, Container } from 'native-base'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'

export default class AddComment extends Component {
    state = {
        content: ''
    }
    render() {
        return (
            //your custom header from here
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <Header noShadow>
                        <Left>
                            <Button onPress={() => Actions.pop()} transparent>
                                <Icon name="arrow-back" style={{ color: '#fff'}}/>
                            </Button>
                        </Left>
                        <Body>
                            <Title></Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    {/* to here */}
                    <ScrollView keyboardShouldPersistTaps="always">
                        <View>
                        </View>
                    </ScrollView>
                </Container>
            </StyleProvider>
        )
    }
}
