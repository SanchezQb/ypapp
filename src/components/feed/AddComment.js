import React, { Component } from 'react'
import { View, Image, TextInput, ToastAndroid, Dimensions } from 'react-native'
import { Button, Text } from 'native-base'
import postStore from '../../stores/Post'
import accountStore from '../../stores/Account'
import { observer } from 'mobx-react/native'
import Modal from 'react-native-modalbox'
import axios from 'axios'
import Config from '../../config'

const { height } = Dimensions.get('window')


@observer
export default class AddComment extends Component {
    state = {
        content: '',
        disabled: false
    }
    reply = () => {
        if(!this.state.content || !this.state.content.length) {
            ToastAndroid.show('Cannot send an empty comment', ToastAndroid.SHORT)
        }
        const data = {
            type: 1,
            content: this.state.content,
            referenceObject: postStore.postToComment,
            referenceID: postStore.postToComment._id
        }
        this.setState({disabled: true})
        postStore.closeCommentModal()
         axios({
            url: `${Config.postUrl}/posts/`, 
            method: 'POST',
            data, 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${accountStore.user.token}`
            },
        }).then(res => {
            ToastAndroid.show('Comment added', ToastAndroid.SHORT)
            this.props.refresh()
            this.setState({disabled: false})
            postStore.closeCommentModal()
        }).catch(err => {
            console.log(err)
            this.setState({disabled: false})
            ToastAndroid.show('Unable to post comment', ToastAndroid.SHORT)
        })
    }

    renderAvatar = (post) => {
        if(post.origin.id == accountStore.user.id) {
            return (
                <Image source={{uri: accountStore.user.avatar}}style={{width: 50, height: 50, borderRadius: 25}} />
            )
        }
        else if(post.origin.avatar == null || post.origin.avatar == '') {
            return (
                <Image source={require('../logo.png')} resizeMode="center" style={{width: 50, height: 50, borderRadius: 25}} />
            )
        }
        else {
            return (
                <Image source={{uri: post.origin.avatar}}style={{width: 50, height: 50, borderRadius: 25}} />
            )
        }
    }
    render() {
        if(postStore.postToComment == null) {
            return null
        }
        return (
            <Modal
                isOpen={postStore.commentModalIsOpen} 
                onClosed={() => postStore.closeCommentModal()} 
                style={{width: '100%', justifyContent: 'center',flex: 1,height: height, backgroundColor: 'transparent', alignItems: 'center'}}
                position={"center"}
                backButtonClose 
                entry="top"
                animationDuration={200}>
                <View style={{width: '90%', height: '90%'}}>
                    <View style={{backgroundColor: '#fff', paddingVertical: 20, paddingHorizontal: 15, marginTop: '10%', borderRadius: 4}}>
                    {postStore.postToComment.origin.id == accountStore.user.id ? 
                        <Text style={{color: '#444', fontWeight: 'bold'}}>
                            {`Replying to ${accountStore.user.firstname} ${accountStore.user.lastname}`}
                        </Text>
                            : 
                        <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 16}}>
                            {`Replying to ${postStore.postToComment.origin.firstname} ${postStore.postToComment.origin.lastname}`}
                        </Text>
                        }
                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
                            {this.renderAvatar(postStore.postToComment)}
                           <Text style={{marginHorizontal: 10, fontWeight: 'bold'}}>{postStore.postToComment.origin.username}</Text>
                        </View>
                        <TextInput 
                            underlineColorAndroid="rgba(0,0,0,0)"
                            textAlignVertical="top"
                            multiline
                            style={{borderColor: '#ccc',borderWidth: 1, borderRadius: 4, marginVertical: 10}}
                            placeholderTextColor="#a6a6a6" 
                            onChangeText={(content) => this.setState({content})}
                            placeholder="Type your comment"
                        />
                        <View style={{marginTop: '3%', backgroundColor: '#222', borderRadius: 4, alignSelf: 'flex-end'}}>
                            <Button disabled={this.state.disabled} onPress={() => this.reply()} style={{backgroundColor: '#82BE30', borderRadius: 4}}>
                                <Text>Post</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}