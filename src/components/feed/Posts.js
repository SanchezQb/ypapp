import React, { Component } from 'react'
import axios from 'axios'
import accountStore from '../../stores/Account';
import { 
    StyleProvider, 
    Header, 
    Left, 
    Body, 
    Right, 
    Button, 
    Icon, 
    Title,
    Badge, Text, View,  ListItem, Thumbnail
} from 'native-base';
import { StyleSheet, TouchableOpacity, Linking, BackHandler, ActivityIndicator, FlatList, RefreshControl, Dimensions } from 'react-native'
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import { Actions } from 'react-native-router-flux'
import moment from 'moment'
import LinkPreview from 'react-native-link-preview';
import { YouTubeStandaloneAndroid } from 'react-native-youtube';
const { width, height } = Dimensions.get('window')


export default class Posts extends Component {
    constructor() {
        super()
        this.state = {
            isLoading: true,
            refreshing: false,
            error: false,
            posts: [],
        }
        this.baseState = this.state
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
        this.getPosts()
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress () {
        BackHandler.exitApp()
    }

    playContent = (str) => {
        YouTubeStandaloneAndroid.playVideo({
            apiKey:"AIzaSyCZNRFr_mF53iI6wLcznjXHjA4KWrQ4eXM",
            videoId: str.substr(str.length - 11),
            autoplay: false,
            startTime: 0,
          })
            .then(() => console.log('Standalone Player Exited'))
            .catch(errorMessage => console.error(errorMessage))
    }

    getPosts = async () => {
        await axios({
          url: `https://ypn-node-service.herokuapp.com/api/v1/posts/`, 
          method: 'GET', 
          headers: {
              "Content-Type": "application/json",
              "Authorization": `${accountStore.user.token}`
          },
      })
      .then(res => {
          this.setState({
              posts: res.data.data.reverse(),
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
    openURL = (str) => {
        Linking.openURL(str).catch(err => console.error('An error occurred', err));
    }

    renderLinks = (links) => {
        const str = `${links[0]}`
        return LinkPreview.getPreview(str)
        .then(data => this.renderData(data))
    }

    renderData = (data) => {
        console.log(data)
        return (
            <Text>{data.description}</Text>
        )
    }
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
    //                 <TouchableOpacity style={styles.link} onPress={() => this.openURL(str)}>
    //                     <View>
    //                         <Text style={{color: '#0066CC'}}>{str}</Text>
    //                     </View>
    //                 </TouchableOpacity>
    //             )
    //         }
    //     }
    // }
    fetchFollowsforUser = () => {
        Actions.allusers()
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
                <Text style={{color: '#444'}}>Could not load Posts :(</Text>
                <Text></Text>
                <Text></Text>
                <Button style={{backgroundColor: '#82BE30', alignSelf: 'center'}}onPress={() => {this.reset()}}>
                    <Text>Retry</Text>
                </Button>
              </View>
              
            )
        }
        else if (this.state.posts.length == 0) {
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: '#444'}}>There are no posts to display</Text>
                    <Text></Text>
                    <Text></Text>
                    <Button style={{backgroundColor: '#82BE30', alignSelf: 'center'}}onPress={() => {this.fetchFollowsforUser()}}>
                        <Text>Follow users</Text>
                    </Button>
                    <Button style={{backgroundColor: '#82BE30', alignSelf: 'center', marginTop: 5}}onPress={() => {this.reset()}}>
                        <Text>refresh</Text>
                    </Button>
              </View>
            )
        }
        return (
            <StyleProvider style={getTheme(material)}>
                <View>
                    <Header>
                        <Left>
                            <Button transparent onPress={() => Actions.drawerOpen()}>
                                <Icon name="md-menu" style={{color: '#fff'}}/>
                            </Button>
                        </Left>
                        <Body>
                            <Title>Home</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={() => Actions.allusers()}>
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
                        data={this.state.posts}
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
                            <ListItem avatar onPress={() => console.log("Pressed")}>
                                <Left style={{height: '80%'}}>
                                    <TouchableOpacity onPress={() => Actions.otherprofile({data: item.origin.id})}>
                                        {this.userProfile(item.origin.avatar)}
                                    </TouchableOpacity>
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
                                    {this.renderLinks(item.links)}
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
                </View>
            </StyleProvider>
        )
    }
}

const styles= StyleSheet.create({
    icons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 30,
        padding: 5
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