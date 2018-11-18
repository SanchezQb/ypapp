import React from 'react'
import { View, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, BackHandler, FlatList } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Button, Thumbnail, Icon, Text, Left, Body, Right, Header, Title, StyleProvider, ListItem, Container } from 'native-base'
import getTheme from '../../../native-base-theme/components';
import accountStore from '../../stores/Account'
import MediaHandler from './MediaHandler'
import moment from 'moment'
import material from '../../../native-base-theme/variables/material'
import axios from 'axios'
import Config from '../../config'

export default class Post extends React.Component {
    state = {
        data: {},
        likeColor: '#a6a6a6',
        isLoading: true
    }

    componentDidMount() {
        // this.generateLike()
        this.fetchPost()
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
    fetchPost = () => {
        axios({
            url: `${Config.postUrl}/posts/${this.props.item}`, 
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${accountStore.user.token}`
            },
        }).then(res => {
            this.setState({
                data: res.data.data,
                isLoading: false
            })
        }).catch(() => {
            this.setState({isLoading: false})
            ToastAndroid.show('There was an error loading comments', ToastAndroid.SHORT)
        })
    }
    // handleLike = () => {
    //     if(!this.state.likeData.map(item => item.id).includes(accountStore.user.id)) {
    //         this.setState({likeColor: '#F0BA00', likeCount: this.state.likeCount + 1, likeData: [...this.state.likeData, accountStore.user] })
    //         return this.likePost(this.props.item._id, 0)
    //     }
    //     this.setState({likeColor: '#a6a6a6', likeCount: this.state.likeCount - 1,likeData: this.state.likeData.filter(item => item.id !== accountStore.user.id)})
    //     this.likePost(this.props.item._id, 1)
    // }
    // generateLike = () => {
    //     if(this.state.likeData.map(item => item.id).includes(accountStore.user.id)) {
    //         return this.setState({likeColor: '#F0BA00'})
    //     }
    // }
    // likePost = (id, key) => {
    //     axios({
    //         url: `https://ypn-node.herokuapp.com/api/v1/posts/like/${id}?type=${key}`, 
    //         method: 'PUT', 
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": `${accountStore.user.token}`
    //         },
    //     }).then(res => {
    //         if(key === 0) {
    //             ToastAndroid.show('Liked', ToastAndroid.SHORT)
    //         }
    //         else {
    //             ToastAndroid.show('Unliked', ToastAndroid.SHORT)
    //         }
    //     })
    // }
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
                <Container>
                    <Header noShadow>
                        <Left>
                            <Button onPress={() => Actions.pop()} transparent>
                                <Icon name="arrow-back" style={{ color: '#fff'}}/>
                            </Button>
                        </Left>
                        <Body>
                            <Title>{`Post by ${this.state.data.data.origin.username}`}</Title>
                        </Body>
                        <Right>
                            {/* <Button onPress={() => postStore.openCommentModal(this.state.data.data)} transparent>
                                <Icon name="arrow-back" style={{ color: '#fff'}}/>
                            </Button>  */}
                        </Right>
                    </Header>
                    <ScrollView>
                        <View style={{borderBottomWidth: 1, borderColor: '#ddd', paddingVertical: 10}}>
                            <ListItem avatar>
                                <Left style={{height: '80%'}}>
                                    <TouchableOpacity onPress={() => Actions.otherprofile({data: this.state.data.data.origin.id})}>
                                        {this.userProfile(this.state.data.data.origin)}
                                    </TouchableOpacity>
                                </Left>
                                <Body style={{borderBottomWidth: 0}}>
                                    <View style={{flexDirection: 'row', marginBottom: 5}}>
                                        <Text style={{color: '#444', fontWeight: 'bold'}}>
                                            {`${this.state.data.data.origin.firstname} ${this.state.data.data.origin.lastname}`}
                                        </Text>
                                        {this.state.data.data.origin.role === 5 ? 
                                            <Text note style={{color: '#82BE30'}}>Verified</Text>
                                        : null}
                                        <Right style={{marginRight: 18}}>
                                            <Text style={{fontSize: 14, color: '#555'}}>{moment(new Date(this.state.data.data.createdAt)).fromNow()}</Text>
                                        </Right>
                                    </View>
                                    <Text style={{color: '#777', fontSize: 18}}>{this.state.data.data.content}
                                    </Text>
                                    <MediaHandler data={this.state.data.data} />
                                    <View style={styles.icons}>
                                    <TouchableOpacity onPress={() => Actions.reactionList({data: this.state.data.data.likes.data})}>
                                        <Text style={{fontWeight: 'bold'}}>{ `${this.state.data.data.likes.count} ${this.state.data.data.likes.count === 1 ? 'Like' : 'Likes'}`}</Text>
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
                            data={this.state.data.comments}
                            showsVerticalScrollIndicator={false}
                            renderItem={({item}) =>
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
                    {/* <AddCommentSingle refresh={this.fetchComments} /> */}
                </Container>
            </StyleProvider>
        )
    }
}

const styles = StyleSheet.create({
    icons: {
       marginVertical: 25
    },
    listitem: {
        marginLeft: 0,
        borderBottomWidth: 0
    },
})
