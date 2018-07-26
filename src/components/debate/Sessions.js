import React, { Component } from 'react'
import { 
    StyleProvider, 
    Header, 
    Left, 
    Body, 
    Right, 
    Icon, 
    Button,
    Title,
    Badge, Text, View,List, ListItem
} from 'native-base';
import { StyleSheet, ScrollView, TouchableOpacity, Picker, BackHandler, FlatList, RefreshControl, ActivityIndicator } from 'react-native'
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import { Actions } from 'react-native-router-flux'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import messagingStore from '../../stores/Messaging';
import accountStore from '../../stores/Account'
import axios from 'axios'

export default class Posts extends Component {
    constructor() {
        super()
        this.state = {
            isLoading: true,
            refreshing: false,
            error: false,
            debates: []
        }
        this.baseState = this.state
    }
    componentDidMount() {
        this.getDebates()
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress () {
        Actions.pop()
        return true;
    }
    getDebates = async () => {
        await axios({
          url: `https://ypn-node-service.herokuapp.com/api/v1/convos/type/2`, 
          method: 'GET', 
          headers: {
              "Content-Type": "application/json",
              "Authorization": `${accountStore.user.token}`
          },
      })
      .then(res => {
          this.setState({
              debates: res.data.data.reverse(),
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
        this.getPosts()
      }

    _onRefresh() {
        this.setState({refreshing: true})
        this.getPosts().then(() => {
            this.setState({
                refreshing: false
            })
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
                <Text style={{color: '#444'}}>Debates :(</Text>
                <Text></Text>
                <Text></Text>
                <Button style={{backgroundColor: '#82BE30', alignSelf: 'center'}}onPress={() => {this.reset()}}>
                    <Text>Retry</Text>
                </Button>
              </View>
              
            )
        }
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
                            <Title>Debates</Title>
                        </Body>
                        <Right>
                            <Button transparent>
                                <Icon name="ios-search" style={{color: '#fff'}}/>
                            </Button>
                            <Button badge transparent>
                                <Icon name="ios-notifications-outline" style={{color: '#fff'}}/>
                                <Badge style={{width: 12, height: 12}}><Text></Text></Badge>
                            </Button>
                        </Right>
                    </Header>
                    <View style={{paddingBottom: 100}}>
                    <FlatList
                        data={this.state.debates}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                              refreshing={this.state.refreshing}
                              onRefresh={this._onRefresh.bind(this)}
                              tintColor="#82BE30"
                              />
                            }
                        renderItem={({item}) =>
                            <View style={{borderBottomWidth: 1, borderColor: '#ddd'}}>
                                <ListItem avatar onPress={() => messagingStore.joinConversation(item)}>
                                    <Left>
                                    </Left>
                                    <Body style={{borderBottomWidth: 0}}>
                                        <View style={{flexDirection: 'row', marginBottom: 5}}>
                                            <Text style={{color: '#444', fontWeight: 'bold'}}>{item.topic}</Text>
                                            <Right style={{borderBottomWidth: 0, marginRight: 10}}>
                                                <TouchableOpacity style={styles.touchable} onPress={() => messagingStore.joinConversation(item)}>
                                                    <Text style={{color: '#fff', textAlign: 'center'}}>Join</Text>
                                                </TouchableOpacity>
                                            </Right>
                                        </View>
                                        <Text style={{color: '#777', marginTop: 10}}>It is a long established 
                                        fact that a reader will be distracted 
                                        by the readable content of a page when  
                                        </Text>
                                        <View style={styles.icons}>
                                            <ListItem style={styles.listitem}>
                                                <MaterialIcon name="circle" style={{color: '#82BE30', fontSize: 14}} />
                                                <Text style={{color: '#a6a6a6', fontSize: 14, marginLeft: 5}}>Ongoing</Text>
                                            </ListItem>
                                            <ListItem style={styles.listitem}>
                                                <MaterialIcon name="message-text-outline" style={{color: '#a6a6a6', fontSize: 14}} />
                                                <Text style={{color: '#a6a6a6', fontSize: 14, marginLeft: 5}}>150 Messages</Text>
                                            </ListItem>
                                            <ListItem style={styles.listitem}>
                                                <MaterialIcon name="account" style={{color: '#a6a6a6', fontSize: 14}} />
                                                <Text style={{color: '#a6a6a6', fontSize: 14, marginLeft: 5}}>{`${item.members.length} Participants`}</Text>
                                            </ListItem>
                                    </View>
                                    </Body>
                                </ListItem>
                            </View>
                        }
                        keyExtractor={item => item._id}
                        />
                    </View>
                </View>
            </StyleProvider>
        )
    }
}

const styles= StyleSheet.create({
    end: {
        height: 150,
        backgroundColor: '#e1e1e1',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    listitem: {
        marginLeft: 0,
        borderBottomWidth: 0
    },
    touchable: {
        backgroundColor: '#82BE30',
        padding: 2,
        width: 60,
        borderRadius: 4
    },
    picker: {
        color: '#82BE30', 
        width: '30%', 
        marginLeft: 25
    },
})