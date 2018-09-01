import React, { Component } from 'react'
import axios from 'axios'
import accountStore from '../../stores/Account';
import postStore from '../../stores/Post'
import { observer } from 'mobx-react/native'
import Modal from 'react-native-modalbox'
import AddComment from './AddComment'
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
import { StyleSheet, TouchableOpacity, BackHandler, ActivityIndicator, RefreshControl, Dimensions, FlatList, Image, ToastAndroid } from 'react-native'
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import { Actions } from 'react-native-router-flux'
import moment from 'moment'
import MediaHandler from './MediaHandler'
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

    getPosts = async () => {
        await axios({
          url: `https://ypn-node.herokuapp.com/api/v1/posts/`, 
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
          console.log(error.response.data)
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

    renderSome = () => {
        if (this.state.error) {
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
        else {
            return (
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
                        <PostList item={item} refresh={this.getPosts}/>
                        }
                        keyExtractor={item => item._id}
                        />
                    </View>
                    <Modal
                        isOpen={postStore.isOpen} 
                        onClosed={() => postStore.close()} 
                        style={{width: '100%', flex: 1, justifyContent: 'center',height: '100%', backgroundColor: 'transparent', alignItems: 'center'}}
                        position={"center"} 
                        entry="top"
                        animationDuration={200}>
                        <Image
                            style={{width: 400, height: 400, alignSelf: 'center'}}
                            source={{uri: postStore.imageToOpen}}
                        />
                    </Modal>
                    <AddComment refresh={this.getPosts} />
                </React.Fragment>
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
                            <Button onPress={() => Actions.notifications()}badge transparent>
                                <Icon name="ios-notifications-outline" style={{color: '#fff'}}/>
                                <Badge style={{width: 12, height: 12, backgroundColor: '#F0BA00'}}><Text></Text></Badge>
                            </Button>
                        </Right>
                    </Header>
                    <React.Fragment>
                    {this.renderSome()}
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
            url: `https://ypn-node.herokuapp.com/api/v1/posts/like/${id}?type=${key}`, 
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
    render() {
        const item = this.props.item
        return (
            <View style={{borderBottomWidth: 1, borderColor: '#ddd'}}>
                <ListItem avatar onPress={() => Actions.post({item: item})}>
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
                            {item.origin.role == 5 ? 
                                <View style={{borderWidth: 1,marginLeft: '2%', borderColor: '#82BE30', padding: '0.5%'}}>
                                    <Text note style={{color: '#82BE30'}}>Verified</Text>
                                </View> 
                            : null}
                            <Right style={{marginRight: 18}}>
                                <Text style={{fontSize: 14, color: '#555'}}>{moment(new Date(item.createdAt)).fromNow()}</Text>
                            </Right>
                        </View>
                        <Text style={{color: '#777'}}>{item.content}
                        </Text>
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