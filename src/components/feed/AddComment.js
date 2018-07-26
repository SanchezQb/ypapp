import React, { Component } from 'react'
import { View, TextInput, ScrollView } from 'react-native'
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
                            <Button outline>
                                <Text style={{color: '#fff'}}>Post</Text>
                            </Button>
                        </Right>
                    </Header>
                    {/* to here */}
                    <ScrollView keyboardShouldPersistTaps="always">
                        <View style={{width: '95%', alignSelf: 'center',}}>
                            <View style={{marginVertical: 20, flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style={{fontSize: 22}}>Add Comment</Text>
                                <Text style={{fontSize: 16, color: this.state.content.length > 500 ? 'red': '#444'}}>
                                    {this.state.content.length} / 500
                                </Text>
                            </View>
                            <View>
                                <TextInput
                                    multiline
                                    onChangeText={(content) => this.setState({content})}
                                    placeholder="Enter text here"
                                    textAlignVertical="top"
                                    style={{width: '100%', height: '100%', fontSize: 20}}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </Container>
            </StyleProvider>
        )
    }
}
