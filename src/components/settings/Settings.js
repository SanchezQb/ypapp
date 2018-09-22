import React, { Component } from 'react'
import { Button, Icon, Text, Left, Body, Right, Header, Title, StyleProvider, Container, Content, ListItem, Switch } from 'native-base'
import { BackHandler, ToastAndroid, AsyncStorage} from 'react-native'
import { Actions } from 'react-native-router-flux'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'
import { observer } from 'mobx-react/native'
import OneSignal from 'react-native-onesignal'

@observer
export default class Settings extends Component {
    state = {
        value: true
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
        AsyncStorage.getItem('notificationSub')
        .then((value) => {
            if(!value) this.setState({value: true})
            const subscribeValue = JSON.parse(value)
            this.setState({value: subscribeValue})
        })
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    handleSwtich = (value) => {
        this.setState({value})
        AsyncStorage.setItem('notificationSub', JSON.stringify(value))
        .then(() => {
            OneSignal.setSubscription(value)
            ToastAndroid.show('Setting Saved', ToastAndroid.SHORT)

        })
    }

    onBackPress () {
        Actions.pop()
        return true
    }
    render() {
        console.log(this.state)
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
                            <Title>Settings</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <Content>
                        <ListItem icon>
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
                                    value={this.state.value} />
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
                        </ListItem>
                    </Content>
                </Container>
            </StyleProvider>
        )
    }
}
