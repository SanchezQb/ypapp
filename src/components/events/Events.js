import React, { Component } from 'react'
import { StyleProvider, Header, Left, Body, Right, Button, Icon, Title } from 'native-base';
import ScrollableTabView from 'react-native-scrollable-tab-view'
import EventList from './EventList'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'
import { Actions } from 'react-native-router-flux'
import { BackHandler } from 'react-native'


export default class Events extends Component {
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress () {
        Actions.pop()
        return true;
    }
    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <React.Fragment>
                    <Header>
                        <Left>
                            <Button transparent onPress={() => Actions.pop()}>
                                <Icon name="arrow-back" style={{fontSize: 20, color: '#fff'}}/>
                            </Button>
                        </Left>
                        <Body>
                            <Title>Events</Title>
                        </Body>
                        <Right>
                            <Button transparent>
                                <Icon name="md-search" style={{fontSize: 20, color: '#fff'}}/>
                            </Button>
                        </Right>
                    </Header>
                    <ScrollableTabView 
                        tabBarUnderlineStyle={{backgroundColor: '#82BE30'}}
                        tabBarBackgroundColor="#f2f2f2"
                        tabBarInactiveTextColor="#777"
                        tabBarActiveTextColor="#82BE30"
                        activeTabStyle={{ backgroundColor: 'red' }}
                        tabBarTextStyle={{fontSize: 15}}
                        >
                        <EventList tabLabel="Events" />
                        <EventList tabLabel="Townhall" />
                    </ScrollableTabView>
                </React.Fragment>
            </StyleProvider>
            
        )
    }
}