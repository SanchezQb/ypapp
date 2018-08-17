import React, { Component } from 'react'
import { 
    StyleProvider, 
    Header, 
    Left, 
    Body, 
    Right, 
    Button, 
    Icon, Title, Thumbnail, Text } from 'native-base';
import { StyleSheet, View, ScrollView,  ToastAndroid, Alert } from 'react-native'
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import { Actions } from 'react-native-router-flux'
import accountStore from '../../stores/Account'
import moment from 'moment'
import axios from 'axios'


export default class Event extends Component {

    state = {
        text: 'attend event',
        disabled: false,
        members: this.props.item.members
    }

    componentDidMount() {
        this.generateAttend()
    }

    userProfile = (avatar) => {
        if(avatar == null || avatar == '') {
            return (
                <Thumbnail large style={{alignSelf: 'center'}} source={require('../logo.png')} resizeMode="center"/>
            )
        }
        else {
            return (
                <Thumbnail large style={{alignSelf: 'center'}} source={{uri: avatar}}/>
            )
        }
    }

    generateAttend() {
        if(this.state.members.map(item => item.id).includes(accountStore.user.id)) {
            return this.setState({text: 'Attending Event'})
        }
    }   

    handleAttend = () => {
        if(!this.state.members.map(item => item.id).includes(accountStore.user.id)) {
            return this.attend(this.props.item._id)
        }
        this.leave(this.props.item._id)
    }

    attend = async () => {
        this.setState({disabled: true})
        await axios.request({
           method: 'put',
           url: `https://ypn-node.herokuapp.com/api/v1/events/join/${this.props.item._id}`,
           headers: {
             Authorization: `${accountStore.user.token}`
           }
         })
        .then((res) => {
            this.setState({disabled: false, text: 'attending event', members: [...this.state.members, accountStore.user]})
            ToastAndroid.show('You are attending this event', ToastAndroid.SHORT)
            this.props.fetch()
           })
           .catch((err) => {
             if (err.response && err.response.status) {
               return Actions.pop();
             }
             return Actions.pop();
           });
    };

    leave = () => {
        Alert.alert(
            'Leave Event',
            'Are you sure you want to Leave this event?',
            [
              {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'Yes', onPress: () => this.leaveHandler()},
            ],
            { cancelable: false }
          )
    }
    leaveHandler = async (id) => {
        this.setState({disabled: true})
        await axios.request({
            method: 'put',
            url: `https://ypn-node.herokuapp.com/api/v1/events/leave/${this.props.item._id}`,
            headers: {
              Authorization: `${accountStore.user.token}`
            }
        })
        .then(() => {
            this.setState({disabled: false, text: 'attend event', members: this.state.members.filter(item => item.id !== accountStore.user.id)})
            ToastAndroid.show('Successfully left event', ToastAndroid.SHORT)
            this.props.fetch()
        })
        .catch(() => {

        });
    }

    render() {
        const item = this.props.item
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
                               {this.userProfile(item.details.displayPicture)}
                                <Text style={{color: '#555', fontSize: 18, textAlign: 'center', marginTop: 10}}>
                                    {item.name}
                                </Text>
                                <Text style={{color: '#82BE30', fontSize: 18, textAlign: 'center'}}>
                                    {moment(new Date(item.startDate)).format('dddd, MMMM Do YYYY')}
                                </Text>
                                <Text style={{color: '#555', fontSize: 18, textAlign: 'center'}}> {moment(new Date(item.startDate)).format('h:mm A')}</Text>
                            </View>
                        </View>
                        <View style={{width: '93%', alignSelf: 'center', marginTop: 30}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', color: '#555', marginVertical: 10}}>Location</Text>
                            <Text style={{fontSize: 16, color: '#222'}}>
                                {`${item.details.location}, ${item.details.state}`}
                            </Text>
                        </View>
                        <View style={{width: '93%', alignSelf: 'center', marginTop: 30}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', color: '#555', marginVertical: 10}}>Event Details</Text>
                            <Text style={{fontSize: 16, color: '#222'}}>
                                {item.details.description}
                            </Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button block disabled={this.state.disabled} onPress={() => this.handleAttend()}>
                                <Text style={{textAlign: 'center', color: '#fff'}}>{this.state.text}</Text>
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
        marginTop: 30,
        width: '93%',
        alignSelf: 'center',
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
