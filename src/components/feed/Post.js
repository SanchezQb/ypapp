import React from 'react'
import { View, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, BackHandler, FlatList, Dimensions, ToastAndroid } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Button, Thumbnail, Icon, Text, Left, Body, Right, Header, Title, StyleProvider, ListItem, Container } from 'native-base'
import getTheme from '../../../native-base-theme/components';
import accountStore from '../../stores/Account'
import postStore from '../../stores/Post'
import MediaHandler from './MediaHandler'
import AddCommentSingle from './AddCommentSingle'
import moment from 'moment'
import material from '../../../native-base-theme/variables/material'
import axios from 'axios'
import Config from '../../config'

const { height } = Dimensions.get('window')

export default class Post extends React.Component {
    state = {
        likeColor: '#a6a6a6',
        likeData: this.props.item.likes.data,
        likeCount: this.props.item.likes.count,
        isLoading: true,
        comments: [],
    }

    componentDidMount() {
        this.generateLike()
        this.fetchComments()
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress () {
        Actions.pop()
        return true
    }

    userProfile = (origin) => {
        if(origin.id == accountStore.user.id) {
            return (
                <Thumbnail source={{uri: accountStore.user.avatar}}/>
            )
        }
        else if(origin.avatar == null || origin.avatar == '') {
            return (
                <Thumbnail source={require('../logo.png')} resizeMode="center"/>
            )
        }
        else {
            return (
                <Thumbnail source={{uri: origin. avatar}}/>
            )
        }
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
            this.props.refresh()
            ToastAndroid.show("Post deleted successfully", ToastAndroid.SHORT)
            Actions.pop()
        }).catch(err => {
            console.log(err.response)
            ToastAndroid.show("Could not delete post, please try again", ToastAndroid.SHORT)
        })
      }
    fetchComments = () => {
        axios({
            url: `${Config.postUrl}/posts/${this.props.item._id}`, 
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${accountStore.user.token}`
            },
        }).then(res => {
           this.setState({
               comments: res.data.data.comments.filter(item => item.type == 1), 
               isLoading: false
            })
        }).catch(() => {
            this.setState({isLoading: false})
            ToastAndroid.show('There was an error loading comments', ToastAndroid.SHORT)
        })
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
            console.log(res.data.data)
            if(key === 0) {
                ToastAndroid.show('Liked', ToastAndroid.SHORT)
            }
            else {
                ToastAndroid.show('Unliked', ToastAndroid.SHORT)
            }
        }).catch(err => console.log(err))
    }
    render() {
        const item = this.props.item
        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <Header noShadow>
                        <Left>
                            <Button onPress={() => Actions.pop()} transparent>
                                <Icon name="arrow-back" style={{ color: '#fff'}}/>
                            </Button>
                        </Left>
                        <Body>
                            <Title>{`Post by ${item.origin.username}`}</Title>
                        </Body>
                        <Right>
                            {/* <Button onPress={() => postStore.openCommentModal(item)} transparent>
                                <Icon name="arrow-back" style={{ color: '#fff'}}/>
                            </Button>  */}
                        </Right>
                    </Header>
                    <ScrollView>
                        <View style={{borderBottomWidth: 1, borderColor: '#ddd', paddingVertical: 10}}>
                            <ListItem avatar>
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
                                        {item.origin.role === 5 ? 
                                            <Text note style={{color: '#82BE30'}}>Verified</Text>
                                        : null}
                                        <Right style={{marginRight: 18}}>
                                            <Text style={{fontSize: 14, color: '#555'}}>{moment(new Date(item.createdAt)).fromNow()}</Text>
                                        </Right>
                                    </View>
                                    <Text style={{color: '#777', fontSize: 18}}>{item.content}
                                    </Text>
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
                                    <View style={styles.icons}>
                                    <TouchableOpacity onPress={() => Actions.reactionList({data: item.likes.data})}>
                                        <Text style={{fontWeight: 'bold'}}>{ `${this.state.likeCount} ${this.state.likeCount === 1 ? 'Like' : 'Likes'}`}</Text>
                                    </TouchableOpacity>
                                    </View>
                                </Body>
                            </ListItem>
                        </View>
                        {this.state.isLoading ? 
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <ActivityIndicator size="large" color="#82BE30"/>
                        </View> 
                        :
                        <View style={{paddingBottom: 100}}>
                         <FlatList
                            data={this.state.comments}
                            showsVerticalScrollIndicator={false}
                            renderItem={({item}) =>
                            <View style={{borderBottomWidth: 1, borderColor: '#ddd'}}>
                                <ListItem avatar onPress={() => Actions.post({item: item})}>
                                    <Left style={{height: '80%'}}>
                                        <TouchableOpacity onPress={() => Actions.otherprofile({data: item.origin.id})}>
                                            {this.userProfile(item.origin)}
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
                                    </Body>
                                </ListItem>
                            </View>
                            }
                            keyExtractor={item => `${item._id}`}
                        /> 
                        </View>
                        }  
                    </ScrollView>
                    <AddCommentSingle refresh={this.fetchComments} />
                </Container>
            </StyleProvider>
        )
    }
}

const styles = StyleSheet.create({
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
})
