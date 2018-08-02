import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'
import postStore from '../../stores/Post'
import { observer } from 'mobx-react/native'
import Modal from 'react-native-modalbox'


@observer
export default class AddComment extends Component {

    render() {
        console.log(postStore.postToComment)
        return (
            <Modal
                isOpen={postStore.commentModalIsOpen} 
                onClosed={() => postStore.closeCommentModal()} 
                style={{width: '100%', position: 'absolute', zIndex: 100, flex: 1, justifyContent: 'center',height: '100%', backgroundColor: 'transparent', alignItems: 'center'}}
                position={"center"} 
                entry="top"
                animationDuration={200}>
                <View style={{backgroundColor: '#fff', width: '90%', height: '60%', padding: 10, borderRadius: 4}}>
                    <View style={{}}>
                        <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 16}}>
                        {postStore.postToComment == null ? '': `Replying to ${postStore.postToComment.origin.firstname}`}
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                           {postStore.postToComment == null ? null : <Image source={{uri:postStore.postToComment.origin.avatar}}style={{width: 50, height: 50, borderRadius: 25}} />}
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}