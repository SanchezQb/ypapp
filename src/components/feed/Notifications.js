import React, { Component } from 'react'
import { Button, Icon, Text, Left, Body, Right, Header, Title, StyleProvider, Container, Content, ListItem, Switch } from 'native-base'
import { StyleSheet, BackHandler, ToastAndroid, Image, TouchableOpacity, View} from 'react-native'
import { Actions } from 'react-native-router-flux'
import getTheme from '../../../native-base-theme/components';
import accountStore from '../../stores/Account'
import material from '../../../native-base-theme/variables/material'
import { observer } from 'mobx-react/native'

@observer
export default class Notifications extends Component {

    state = {
        type: 1
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

    renderNotifications = () => {
        if(this.state.type == 0) {
            //this is a follow notification
            return (
                <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderColor: '#a6a6a6', borderBottomWidth: 1}}>
                    <View style={{alignSelf: 'flex-start', width: 50, height: 50, marginHorizontal: 20}}>
                        <Image source={require('../logo.png')} resizeMode="center" style={{alignSelf: 'flex-start', width: 50, height: 50, borderRadius: 25}}/> 
                    </View>
                    <View>
                        <Text>Baysix followed you</Text>
                    </View>
                    <View></View>
                </TouchableOpacity>
            )
        }
        else if(this.state.type == 1) {
            return (
                <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderColor: '#a6a6a6', borderBottomWidth: 1}}>
                    <View style={{alignSelf: 'flex-start', width: 50, height: 50, marginHorizontal: 20}}>
                        <Image source={require('../logo.png')} resizeMode="center" style={{alignSelf: 'flex-start', width: 50, height: 50, borderRadius: 25}}/> 
                    </View>
                    <View>
                        <Text>Baysix liked your post</Text>
                    </View>
                    <View></View>
                </TouchableOpacity>
            )
        }
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
                            <Title>Notifications</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <Content>
                        {/* <ListItem icon>
                            <Left>
                                <Button style={{ backgroundColor: "#82BE30" }}>
                                    <Icon active name="ios-notifications-outline" />
                                </Button>
                            </Left>
                            <Body>
                                <Text>Notifications</Text>
                                </Body>
                            <Right>
                                <Switch
                                    onTintColor="#F0BA00" 
                                    onValueChange={(value) => this.handleSwtich(value)}
                                    value={accountStore.notifications} />
                            </Right>
                        </ListItem>
                        <ListItem icon onPress={() => Actions.forgot()}>
                            <Left>
                                <Button style={{ backgroundColor: "#82BE30" }}>
                                    <Icon active name="md-lock" />
                                </Button>
                            </Left>
                            <Body>
                                <Text>Change Password</Text>
                            </Body>
                            <Right>
                                <Icon active name="arrow-forward" />
                            </Right>
                        </ListItem>
                        <ListItem icon onPress={() => Actions.newsletter()}>
                            <Left>
                                <Button style={{ backgroundColor: "#82BE30" }}>
                                    <Icon active name="md-mail" />
                                </Button>
                            </Left>
                            <Body>
                                <Text>Subscribe to our Newsletter</Text>
                            </Body>
                            <Right>
                                <Icon active name="arrow-forward" />
                            </Right>
                        </ListItem> */}
                        {this.renderNotifications()}
                    </Content>
                </Container>
            </StyleProvider>
        )
    }
}
