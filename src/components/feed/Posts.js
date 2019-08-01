import React, { Component } from 'react'
import axios from 'axios'
import accountStore from '../../stores/Account';
import postStore from '../../stores/Post'
import { observer } from 'mobx-react/native'
import AddComment from './AddComment'
import notificationStore from '../../stores/Notifications'
import searchStore from '../../stores/Search'
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
import { StyleSheet, TouchableOpacity, BackHandler, AsyncStorage, ActivityIndicator, RefreshControl, Dimensions, FlatList, Alert, ToastAndroid } from 'react-native'
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import { Actions } from 'react-native-router-flux'
import moment from 'moment'
import MediaHandler from './MediaHandler'
import Config from '../../config'
const { width, height } = Dimensions.get('window')

@observer
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

    async componentWillMount() {
        try {
          let posts = await AsyncStorage.getItem('timeline')
          let parsed = JSON.parse(posts)
          if(posts !== null) {
             this.setState({isLoading: false, posts: parsed})
          }
          else {
             this.setState({posts: []})
          }   
        }
        catch(error) {
          ToastAndroid.show('Error fetching messages', ToastAndroid.SHORT)
        }
        BackHandler.addEventListener('hardwareBackPress', () => {
            this.onBackPress()
            return true
        });   
    }

    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', () => {});
    }

    onBackPress () {
        this.exitAlert()
    }

    exitAlert = () => {
        Alert.alert(
          'Exit App',
          'Are you sure you want exit?',
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'OK', onPress: () => BackHandler.exitApp()},
          ],
          { cancelable: false }
        )
    }

    componentDidMount() {
        // BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
        this.getPosts()
        notificationStore.fetchNotifications()
    }
    componentWillUnmount () {
       this.persistPosts()
    }

    persistPosts = () => {
        AsyncStorage.setItem('timeline', JSON.stringify(this.state.posts))
    }

    getPosts = async () => {
        await axios({
          url: `${Config.postUrl}/posts/`, 
          method: 'GET', 
          headers: {
              "Content-Type": "application/json",
              "Authorization": `${accountStore.user.token}`
          },
      })
      .then(res => {
          this.setState({
              posts: res.data.data,
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
              <View style={{height, justifyContent: 'center', alignItems: 'center'}}>
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
                <View style={{height, justifyContent: 'center', alignItems: 'center'}}>
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
                            <Button transparent onPress={() => {
                                Actions.search()
                                searchStore.acceptPosts(this.state.posts)
                                }}>
                                <Icon name="ios-search" style={{color: '#fff'}}/>
                            </Button>
                            <Button onPress={() => Actions.notifications()} badge transparent>
                                <Icon name="ios-notifications-outline" style={{color: '#fff'}}/>
                                {notificationStore.unseenCount && notificationStore.unseenCount > 0 ? 
                                    <Badge style={{width: 23, height: 23,backgroundColor: '#F0BA00'}}><Text>{notificationStore.unseenCount}</Text></Badge>
                                :null}
                            </Button>
                        </Right>
                    </Header>
                    <React.Fragment>
                    <View style={{paddingBottom: 100}}>
                        <FlatList
                            legacyImplementation
                            initialNumToRender={10}
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
                            <PostList item={item} refresh={this.getPosts} deleteFilter={(id) => this.filterOut(id)}/>
                            }
                            keyExtractor={item => item._id}
                            />
                        </View>   
                        <AddComment refresh={this.getPosts} />
                    </React.Fragment>
                </View>
            </StyleProvider>
        )
    }
}

export const PostList = class PostList extends React.Component {
    state = {
        likeColor: '#a6a6a6',
        likeData: this.props.item.likes.data,
        likeCount: this.props.item.likes.count,
    }

    componentDidMount() {
        this.generateLike()
    }
    userProfile = (origin) => {
        // if(avatar == null || avatar == '') {
        //     return (
        //         <Thumbnail source={require('../logo.png')} resizeMode="center"/>
        //     )
        // }
        // else {
        //     return (
        //         <Thumbnail source={{uri: avatar}}/>
        //     )
        // }
        if(origin.avatar == null || origin.avatar == '') {
            return (
                <Thumbnail source={require('../logo.png')} resizeMode="center"/>
            )
        }
        if(origin.id == accountStore.user.id) {
            return (
                <Thumbnail source={{uri: accountStore.user.avatar}}/>
            )
        }
        else {
            return (
                <Thumbnail source={{uri: origin.avatar}}/>
            )
        }
    }
    handleLike = () => {
        if(!this.state.likeData.map(item => item.id).includes(accountStore.user.id)) {
            this.setState({likeColor: '#F0BA00', likeCount: this.state.likeCount + 1, likeData: [...this.state.likeData, accountStore.user] })
            return this.likePost(this.props.item._id, 0)
        }
        this.setState({likeColor: '#a6a6a6', likeCount: this.state.likeCount - 1,likeData: this.state.likeData.filter(item => item.id !== accountStore.user.id)})
        this.likePost(this.props.item._id, 1)
    }
    generateLike = () => {
        if(this.state.likeData.map(item => item.id).includes(accountStore.user.id)) {
            return this.setState({likeColor: '#F0BA00'})
    }
    }
    likePost = (id, key) => {
        axios({
            url: `${Config.postUrl}/posts/like/${id}?type=${key}`, 
            method: 'PUT', 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${accountStore.user.token}`
            },
        }).then(res => {
            if(key === 0) {
                ToastAndroid.show('Liked', ToastAndroid.SHORT)
            }
            else {
                ToastAndroid.show('Unliked', ToastAndroid.SHORT)
            }
        })
        this.props.refresh()
    }
    openModal = () => {
        this.setState({modalIsOpen: true})
    }
    closeModal = () => {
        this.setState({modalIsOpen: false})
    } 
    deleteHandler = (post) => {
        Alert.alert(
          'Delete',
          'Are you sure you want to delete this post? This cannot be undone?',
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'YES', onPress: () => this.delete(post)},
          ],
          { cancelable: false }
        )
      }
    
      delete = (post) => {
        axios({
            url: `${Config.postUrl}/posts/${post._id}`, 
            method: 'DELETE', 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${accountStore.user.token}`
            },
        }).then((res) => {
            ToastAndroid.show("Post deleted successfully", ToastAndroid.SHORT)
            this.props.refresh()
        }).catch(err => {
            console.log(err.response)
            ToastAndroid.show("Could not delete post, please try again", ToastAndroid.SHORT)
        })
      }
    render() {
        const item = this.props.item
        return (
            <View style={{borderBottomWidth: 1, borderColor: '#ddd'}}>
                <ListItem avatar onPress={() => Actions.post({item: item, refresh: this.props.refresh})}>
                    <Left style={{height: '80%'}}>
                        <TouchableOpacity onPress={() => Actions.otherprofile({data: item.origin.id})}>
                            {this.userProfile(item.origin)}
                        </TouchableOpacity>
                    </Left>
                    <Body style={{borderBottomWidth: 0}}>
                        <View style={{flexDirection: 'row', marginBottom: 5}}>
                        {item.origin.id == accountStore.user.id ? 
                        <Text style={{color: '#444', fontWeight: 'bold'}}>
                            {`${accountStore.user.firstname} ${accountStore.user.lastname}`}
                        </Text>
                            : 
                        <Text style={{color: '#444', fontWeight: 'bold'}}>
                            {`${item.origin.firstname} ${item.origin.lastname}`}
                        </Text> 
                        }
                    
                            {item.origin.role == 5 ? 
                                <Text note style={{color: '#82BE30', marginHorizontal: '3%'}}>Verified</Text>
                            : null}
                            <Right style={{marginRight: 5}}>
                                <Text style={{color: '#555', fontSize: 14}}>{moment(new Date(item.createdAt)).fromNow()}</Text>
                            </Right>
                        </View>
                        <Text style={{color: '#777'}}>{item.content}</Text>
                        {/* {this.renderLinks(item.links)} */}
                        <MediaHandler data={item} />
                        <View style={styles.icons}>
                            <ListItem onPress={() => this.handleLike()}style={styles.listitem}>
                                <Icon name="md-thumbs-up" style={{color: this.state.likeColor, fontSize: height * 0.028}} />
                                <Text style={{color: this.state.likeColor, fontSize: height * 0.02, marginLeft: 5}}>
                                { `${this.state.likeCount} ${this.state.likeCount === 1 ? 'Like' : 'Likes'}`}
                                </Text>
                            </ListItem>
                            <ListItem onPress={() => postStore.openCommentModal(item)} style={styles.listitem}>
                                <Icon name="md-text" style={{color: '#a6a6a6', fontSize: height * 0.028}} />
                                <Text style={{color: '#a6a6a6', fontSize: height * 0.02, marginLeft: 5}}>
                                    { `${item.commentCount} ${item.commentCount === 1 ? 'Comment' : 'Comments'}`}
                                </Text>
                            </ListItem>
                            <ListItem style={styles.listitem} onPress={() => Actions.shareTo({data: item})}>
                                <Icon name="md-share-alt" style={{color: '#a6a6a6', fontSize: height * 0.028}} />
                                <Text style={{color: '#a6a6a6', fontSize: height * 0.02, marginLeft: 5}}>Share</Text>
                            </ListItem>
                            {item.origin.id === accountStore.user.id || accountStore.user.role === 5 ?
                             <ListItem style={styles.listitem} onPress={() => this.deleteHandler(item)}>
                                <Icon name="ios-trash-outline" style={{color: '#a6a6a6', fontSize: height * 0.028}} />
                                <Text style={{color: '#a6a6a6', fontSize: height * 0.02, marginLeft: 5}}>Delete</Text>
                            </ListItem>
                            :
                            null
                            }
                        </View>
                    </Body>
                </ListItem>
            </View>
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