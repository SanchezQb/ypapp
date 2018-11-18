import React, { Component } from 'react'
import axios from 'axios'
import {  Text, ListItem, Thumbnail, Left, Right, Body, Icon } from 'native-base'
import { View,  StyleSheet, FlatList, ActivityIndicator, Dimensions } from 'react-native'
import accountStore from '../../stores/Account'
import MediaHandler from '../feed/MediaHandler'
import moment from 'moment'
import { Actions } from 'react-native-router-flux'
import Config from '../../config'

const { height } = Dimensions.get('window')

export default class OtherPosts extends Component {
    constructor() {
        super()
        this.state = {
            isLoading: true,
            error: false,
            posts: [],
        }
        this.baseState = this.state
    }

    componentDidMount() {
        this.getPosts()
    }
    getPosts = async () => {
        await axios({
          url: `${Config.postUrl}/posts//all/${this.props.userId}`, 
          method: 'GET', 
          headers: {
              "Content-Type": "application/json",
              "Authorization": `${accountStore.user.token}`
          },
      })
      .then(res => {
          this.setState({
                isLoading: false,
                posts: res.data.data.filter(post => {
                return post.destination == null
          })
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
                <Text style={{color: '#444'}}>Could not load Posts:(</Text>
                <Text></Text>
                <Text></Text>
                <Button style={{backgroundColor: '#82BE30', alignSelf: 'center'}}onPress={() => {this.reset()}}>
                    <Text>Retry</Text>
                </Button>
              </View>
              
            )
        }
        return (
            <View>
                <FlatList
                    data={this.state.posts}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item}) =>
                    <View style={{borderBottomWidth: 1, borderColor: '#ddd'}}>
                        <ListItem avatar onPress={() => Actions.post({item})}>
                            <Left style={{height: '80%'}}>
                                {this.userProfile(item.origin.avatar)}
                            </Left>
                            <Body style={{borderBottomWidth: 0}}>
                                <View style={{flexDirection: 'row', marginBottom: 5}}>
                                    <Text style={{color: '#444', fontWeight: 'bold'}}>
                                        {`${item.origin.firstname} ${item.origin.lastname}`}
                                    </Text>
                                    <Right style={{marginRight: 18}}>
                                        <Text style={{fontSize: 14, color: '#555'}}>{moment(new Date(item.createdAt)).fromNow()}</Text>
                                    </Right>
                                </View>
                                <Text style={{color: '#777'}}>{item.content}
                                </Text>
                                    {/* {this.renderLinks(item.links)} */}
                                <MediaHandler data={item} />
                                <View style={styles.icons}>
                                    <ListItem style={styles.listitem}>
                                        <Icon name="md-thumbs-up" style={{color: '#a6a6a6', fontSize: height * 0.02}} />
                                        <Text style={{color: '#a6a6a6', fontSize: height * 0.02, marginLeft: 5}}>{item.likes.count} Likes</Text>
                                    </ListItem>
                                    <ListItem style={styles.listitem}>
                                        <Icon name="md-text" style={{color: '#a6a6a6', fontSize: height * 0.02}} />
                                        <Text style={{color: '#a6a6a6', fontSize: height * 0.02, marginLeft: 5}}>4 Comments</Text>
                                    </ListItem>
                                    <ListItem style={styles.listitem}>
                                        <Icon name="md-share-alt" style={{color: '#a6a6a6', fontSize: height * 0.02}} />
                                        <Text style={{color: '#a6a6a6', fontSize: height * 0.02, marginLeft: 5}}>4 Shares</Text>
                                    </ListItem>
                                </View>
                            </Body>
                        </ListItem>
                    </View>
                    }
                    keyExtractor={item => item._id}
                    />
            </View>
        )
    }
}
const styles= StyleSheet.create({
    end: {
        height: 75,
        backgroundColor: '#ddd',
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
    link:{
        flexDirection: 'row',
        backgroundColor: '#e1e1e1',
        padding: 5,
        marginTop: 10,
        marginRight: 30,
        borderRadius: 4
    }
})