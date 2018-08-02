import React, { Component } from 'react'
import { Text, View, Image, TextInput, TouchableOpacity } from 'react-native'
import postStore from '../../stores/Post'
import { observer } from 'mobx-react/native'
import Modal from 'react-native-modalbox'


@observer
export default class AddComment extends Component {

    render() {
        if(postStore.postToComment == null) {
            return null
        }
        return (
            <Modal
                isOpen={postStore.commentModalIsOpen} 
                onClosed={() => postStore.closeCommentModal()} 
                style={{width: '100%', flex: 1, justifyContent: 'center',height: '100%', backgroundColor: 'transparent', alignItems: 'center'}}
                position={"center"} 
                entry="top"
                animationDuration={200}>
                <View style={{backgroundColor: '#fff', width: '90%', height: '50%', padding: 10, borderRadius: 4}}>
                    <View style={{}}>
                        <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 16}}>
                        {`Replying to ${postStore.postToComment.origin.firstname}`}
                        </Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                           <Image source={{uri:postStore.postToComment.origin.avatar}}style={{width: 50, height: 50, borderRadius: 25}} />
                           <Text style={{marginHorizontal: 10, fontWeight: 'bold'}}>{postStore.postToComment.origin.firstname}</Text>
                        </View>
                        <TextInput 
                            underlineColorAndroid="rgba(0,0,0,0)"
                            textAlignVertical="top"
                            multiline
                            style={{borderColor: '#ccc',borderWidth: 1, height: '60%', marginVertical: 10}}
                            placeholderTextColor="#a6a6a6" 
                            onChangeText={(content) => this.setState({content})}
                            placeholder="Type your comment"
                        />
                        <TouchableOpacity style={{backgroundColor: '#82BE30', width: '20%', paddingVertical: 10,paddingHorizontal: 5, alignSelf: 'flex-end', borderRadius: 4}}>
                            <Text style={{color: '#fff', textAlign: 'center'}}>Post</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }
}