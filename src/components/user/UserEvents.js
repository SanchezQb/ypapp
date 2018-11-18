import React, { Component } from 'react'
import axios from 'axios'
import {  Text, Thumbnail, Button, ListItem, Left, Right, Body } from 'native-base'
import { View,  StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import moment from 'moment'
import { Actions } from 'react-native-router-flux' 
import accountStore from '../../stores/Account'
import Config from '../../config'


export default class UserEvents extends Component {
    constructor() {
        super()
        this.state = {
            isLoading: true,
            error: false,
            events: [],
        }
        this.baseState = this.state
    }

    componentDidMount() {
        this.getEvents()
    }
    getEvents = async () => {
        await axios({
          url: `${Config.postUrl}/events/user/${accountStore.user.id}`, 
          method: 'GET', 
          headers: {
              "Content-Type": "application/json",
              "Authorization": `${accountStore.user.token}`
          },
      })
      .then(res => {
          this.setState({
              events: res.data.data,
              isLoading: false
          })
      })
      .catch(error => {
          this.setState({
              isLoading: false,
              error: true
          })
      })
    }
    reset = () => {
        this.setState(this.baseState)
        this.getEvents()
    }
   
    userProfile = (avatar) => {
        if(avatar == null || avatar == '') {
            return (
                <Thumbnail source={require('../logo.png')} resizeMode="center"/>
            )
        }
        else {
            return (
                <Thumbnail source={{uri: avatar}}/>
            )
        }
    }
    render() {
        if (this.state.isLoading) {
            return (
              <View style={{flex: 1, justifyContent: 'center'}}>
                <ActivityIndicator size="large" color="#82BE30"/>
              </View>
            );
          }
          else if (this.state.error) {
            return (
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#444'}}>Could not load Events:(</Text>
                <Text></Text>
                <Text></Text>
                <Button style={{backgroundColor: '#82BE30', alignSelf: 'center'}}onPress={() => {this.reset()}}>
                    <Text>Retry</Text>
                </Button>
              </View>
              
            )
        }
        return (
            <View style={{paddingBottom: 100}}>
            { this.state.events.length == 0 ? 
                <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 15}}>
                    <Text style={{fontSize: 18}}>No events to display</Text>
                </View>
                :
                <FlatList
                    legacyImplementation
                    initialNumToRender={10}
                    data={this.state.events}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item}) =>
                        <View style={styles.listitem}>
                            <ListItem avatar style={{paddingVertical: 20, marginLeft: 15}} onPress={() => Actions.event({item, fetch: this.fetchEvents})}>
                                <Left>
                                {this.userProfile(item.details.displayPicture)}
                                </Left>
                                <Body style={{borderBottomWidth: 0}}>
                                    <Text>{item.name}</Text>
                                    <Text note>{moment(new Date(item.startDate)).format('LLLL')}</Text>
                                </Body>
                                <Right style={{borderBottomWidth: 0, marginRight: 0}}>
                                    <TouchableOpacity style={styles.touchable} onPress={() => Actions.event({item, fetch: this.fetchEvents})}>
                                        <Text style={{color: '#fff', textAlign: 'center'}}>View</Text>
                                    </TouchableOpacity>
                                </Right>
                            </ListItem>
                        </View>
                    }
                    keyExtractor={item => item._id}
                />
            }
            </View>
        )
    }
}
const styles= StyleSheet.create({
    icons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    listitem: {
        marginLeft: 0,
        borderBottomWidth: 0
    },
    link:{
        flexDirection: 'row',
        backgroundColor: '#e1e1e1',
        padding: 5,
        marginTop: 10,
        marginRight: 30,
        borderRadius: 4
    }
})