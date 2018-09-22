import React, { Component } from 'react'
import { StyleProvider, Header, Left, Body, Right, Button, Icon, Title, ListItem, Thumbnail, Text } from 'native-base';
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'
import { Actions } from 'react-native-router-flux'
import { BackHandler, FlatList, View, ActivityIndicator, StyleSheet, TouchableOpacity, Picker } from 'react-native'
import accountStore from '../../stores/Account'
import { StateData } from '../../modules/StateData'
import axios from 'axios'
import moment from 'moment'
import Config from '../../config'


export default class Events extends Component {
    constructor() {
        super()
        this.state = {
            events: [],
            items: [],
            isLoading: true,
            error: false,
            filterBy: 'All',
            state: '',
        }
        this.baseState = this.state
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
    fetchEvents = async () => {
       await axios({
            url: `${Config.postUrl}/events`, 
            method: 'GET', 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${accountStore.user.token}`
            },
        }).then(res => {
            console.log(res.data.data)
            this.setState({
                isLoading: false,
                events: res.data.data,
            })
        }).then(() => {
            this.setState({items: this.state.events, isLoading: false})
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
        this.fetchEvents()
    }
    filterList = (text) => {
        if(text == "All") {
            return this.setState({items: this.state.events})
        }
        else if(text == 'Federal') {
            let updatedList = this.state.events
            updatedList = updatedList.filter(v => {
                return v.details.level.toLowerCase().search(
                    text.toLowerCase()) !== -1;
            })
        }
        let updatedList = this.state.events
        updatedList = updatedList.filter(v => {
            return v.details.state.toLowerCase().search(
                text.toLowerCase()) !== -1;
        })
        this.setState({
            items: updatedList
        })
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
                <Text style={{color: '#444'}}>Could not load Events :(</Text>
                <Text></Text>
                <Text></Text>
                <Button style={{backgroundColor: '#82BE30', alignSelf: 'center'}}onPress={() => {this.reset()}}>
                    <Text>Retry</Text>
                </Button>
              </View>
              
            )
        }
        else if (this.state.events.length == 0) {
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: '#444'}}>There are no Events to display</Text>
                    <Text></Text>
                    <Text></Text>
                    <Button style={{backgroundColor: '#82BE30', alignSelf: 'center', marginTop: 5}}onPress={() => {this.reset()}}>
                        <Text>refresh</Text>
                    </Button>
              </View>
            )
        }
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
                            
                        </Right>
                    </Header>
                    <View style={styles.pickerView}>
                        <Picker
                            selectedValue={this.state.filterBy}
                            onValueChange={(value) => {
                                this.setState({
                                    filterBy: value,
                                    state: 'Select State',
                                })
                                this.filterList(value)
                            }}
                            style={styles.picker}
                            mode='dialog'>
                            <Picker.Item label="All" value="All" />
                            <Picker.Item label="Federal" value="Federal" />
                            <Picker.Item label="State" value = "State" />
                        </Picker>
                        {this.state.filterBy == 'State'? 
                            <Picker
                                style={styles.picker}
                                selectedValue={this.state.state}
                                onValueChange={(state) => {
                                    this.setState({state}, () => {
                                        this.filterList(state)
                                    })
                                }}
                                mode='dialog'>
                            {
                                    StateData.map((item, index) => {
                                        let state = item['state']['name'];
                                        return <Picker.Item key={index} value={state} label={state} />;
                                    })
                                }
                            </Picker> :
                            null
                        }
                    </View>
                    <View style={{paddingBottom: 100}}>
                    { this.state.items.length == 0 ? 
                        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 15}}>
                            <Text style={{fontSize: 18}}>No events to display</Text>
                        </View>
                        :
                        <FlatList
                            legacyImplementation
                            initialNumToRender={10}
                            data={this.state.items}
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
                                           
                                        </Right>
                                    </ListItem>
                                </View>
                            }
                            keyExtractor={item => item._id}
                        />
                    }
                    </View>
                </React.Fragment>
            </StyleProvider>
            
        )
    }
}

const styles = StyleSheet.create({
    touchable: {
        backgroundColor: '#82BE30',
        padding: 2,
        width: 60,
        borderRadius: 4
    },
    listitem: {
        marginLeft: 0,
        borderBottomWidth: 0
    },
    picker: {
        color: '#82BE30', 
        width: '30%', 
        marginLeft: 25
    },
})