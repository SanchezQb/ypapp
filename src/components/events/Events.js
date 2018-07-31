import React, { Component } from 'react'
import { StyleProvider, Header, Left, Body, Right, Button, Icon, Title } from 'native-base';
import EventList from './EventList'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'
import { Actions } from 'react-native-router-flux'
import { BackHandler, ToastAndroid } from 'react-native'
import accountStore from '../../stores/Account'
import axios from 'axios'


export default class Events extends Component {
    state = {
        isLoading: false,
        events: [],
        error: false,
        refreshing: false
    }
    componentDidMount() {
        this.fetchEvents()
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress () {
        Actions.pop()
        return true;
    }
    fetchEvents = () => {
        axios({
            url: `https://ypn-node-service.herokuapp.com/api/v1/events`, 
            method: 'GET', 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${accountStore.user.token}`
            },
        }).then(res => {
            console.log(res.data.data)
            this.setState({events: res.data.data, isLoading: false})
        })
        .catch(error => {
           console.log(error)
        })
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
                        <EventList />
                </React.Fragment>
            </StyleProvider>
            
        )
    }
}