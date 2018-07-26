import React, { Component } from 'react'
import axios from 'axios'
import {  Text, ListItem, Thumbnail, Left, Right, Body, Icon, Button } from 'native-base'
import { View,  StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native'
import MediaHandler from '../feed/MediaHandler'
import accountStore from '../../stores/Account'
import moment from 'moment'
import { Actions } from 'react-native-router-flux'

const { width, height } = Dimensions.get('window')

export default class Userposts extends Component {
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
          url: `https://ypn-node-service.herokuapp.com/api/v1/posts/all/${accountStore.user.id}`, 
          method: 'GET', 
          headers: {
              "Content-Type": "application/json",
              "Authorization": `${accountStore.user.token}`
          },
      })
      .then(res => {
          this.setState({
            posts: res.data.data.filter(post => {
                return post.destination == null
          }),
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
    // playContent = (str) => {
    //     YouTubeStandaloneAndroid.playVideo({
    //         apiKey:"AIzaSyCZNRFr_mF53iI6wLcznjXHjA4KWrQ4eXM",
    //         videoId: str.substr(str.length - 11),
    //         autoplay: false,
    //         startTime: 0,
    //       })
    //         .then(() => console.log('Standalone Player Exited'))
    //         .catch(errorMessage => console.error(errorMessage))
    // }
    // renderLinks = (links) => {
    //     const str = `${links[0]}`
    //     if(str.match(/youtu/) && str.match(/be/)) {
    //         return (
    //             <TouchableOpacity style={styles.link} onPress={() => this.playContent(str)}>
    //                 <View style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center'}}>
    //                     <Icon name="logo-youtube" style={{color: '#ea1b2a'}} />
    //                     <Text style={{color: '#0066CC', marginHorizontal: 5}}>{str}</Text>
    //                 </View>
    //             </TouchableOpacity>
    //         )
    //     }
    //     else if (links.length == 0) {
    //         return (
    //              null
    //         )
    //     }
    //     else {
    //         const str = `${links[0]}`
    //         if(str == "") {
    //             return null
    //         }
    //         else {
    //             return (
    //                 <TouchableOpacity style={styles.link} onPress={() => Actions.web({data: str})}>
    //                     <View>
    //                         <Text style={{color: '#0066CC'}}>{str}</Text>
    //                     </View>
    //                 </TouchableOpacity>
    //             )
    //         }
    //     }
    // }
    userProfile = (avatar) => {
        if(avatar == null || avatar == '') {
            return (
                <Thumbnail source={require('../avatar.jpg')}/>
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
                        <ListItem avatar onPress={() => console.log("Pressed")}>
                            <Left style={{height: '80%'}}>
                                {this.userProfile(accountStore.user.avatar)}
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
                                        <Icon name="md-thumbs-up" style={{color: '#a6a6a6', fontSize: height * 0.022}} />
                                        <Text style={{color: '#a6a6a6', fontSize: height * 0.022, marginLeft: 5}}>{item.likes.count} Likes</Text>
                                    </ListItem>
                                    <ListItem style={styles.listitem}>
                                        <Icon name="md-text" style={{color: '#a6a6a6', fontSize: height * 0.022}} />
                                        <Text style={{color: '#a6a6a6', fontSize: height * 0.022, marginLeft: 5}}>4 Comments</Text>
                                    </ListItem>
                                    <ListItem style={styles.listitem}>
                                        <Icon name="md-share-alt" style={{color: '#a6a6a6', fontSize: height * 0.022}} />
                                        <Text style={{color: '#a6a6a6', fontSize: height * 0.022, marginLeft: 5}}>4 Shares</Text>
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