import React, { Component } from 'react'
import { 
    StyleProvider, 
    Header, 
    Left, 
    Body, 
    Right, 
    Button, 
    Icon, 
    Title, 
    CardItem,
    Thumbnail, Textarea, Text, View
} from 'native-base';
import { StyleSheet, ScrollView, ToastAndroid, BackHandler, TextInput } from 'react-native'
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import { Actions } from 'react-native-router-flux'
import ImagePicker from 'react-native-image-crop-picker';
import accountStore from '../../stores/Account';
import axios from 'axios'
import * as RNCloudinary from 'react-native-cloudinary-x'

export default class NewPost extends Component {
    state = {
        content: '',
        type: 1,
        disabled: false,
    }



    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress () {
        BackHandler.exitApp()
    }

    selectImage = () => {
        ImagePicker.openPicker({
            mediaType: "photo",
            multiple: true
          }).then(images => {
           if(images.length > 4) {
               ToastAndroid.show('Maximum of 4 images', ToastAndroid.SHORT)
           }
           else {
              this.setState({images})
           }
          });
    }

    handlePost = () => {
        if(this.state.content.length == 0 && !this.state.images) {
            return ToastAndroid.show('Cannot send an empty post', ToastAndroid.SHORT)
        }
        const request = {
            ...this.state
        }
        this.setState({disabled: true})
        axios({
            url: 'https://ypn-node.herokuapp.com/api/v1/posts', 
            method: 'POST', 
            data: request,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${accountStore.user.token}`
                
            },
        })
        .then((res) => {
            console.log(res)
            this.setState({disabled: false})
            Actions.drawer()
            ToastAndroid.show('Post Successfully Created', ToastAndroid.SHORT)
        })
        .catch(err => {
            this.setState({disabled: false})
            ToastAndroid.show(err.response.data.error, ToastAndroid.SHORT)
        })
    }

    post = () => {
        if(!this.state.images || !this.state.images.length) {
            return this.handlePost()
        }
        else if(this.state.content.length > 500) {
            return ToastAndroid.show('Maximum number of characters exceeded', ToastAndroid.SHORT)
        }
        this.setState({disabled: true})
        ToastAndroid.show('Uploading...', ToastAndroid.SHORT)
        Promise.all([this.SendToCloudinary(this.state.images, 'multiple')])
        .then((media) => {
            ToastAndroid.show('Upload Successful, creating post', ToastAndroid.SHORT)
            console.log(media)
            this.setState({ media })
            this.handlePost()
        })
        .catch((err) => {
            this.setState({disabled: false})
            dispatchNotification(navigator)('Error uploading photos. Please try again.')
            console.log(err)
        })
    }
    SendToCloudinary = async (data, key) => {
        const images = [];
        RNCloudinary.init('741854955822223','0Y6bxC5eCBKjXZLuyOJpm6tcJTM','ddjyel5tz')
        if (!key) return RNCloudinary.UploadImage(data.path);  
        for (let i = 0; i < data.length; i++) {
          const url = await RNCloudinary.UploadImage(data[i].path);
          images.push(url);
        }
        return images;
      };

    setLink = (link) => {
        let arr = []
        let a = arr.slice();
        a[0] = link;
        this.setState({links: a});
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
        return (
            <StyleProvider style={getTheme(material)}>
                    <View style={{backgroundColor: `#fff`, flex: 1}}>
                        <Header>
                            <Left>
                                <Button onPress={() => Actions.drawerOpen()}transparent>
                                    <Icon name="md-menu" style={{color: '#fff'}}/>
                                </Button>
                            </Left>
                            <Body>
                                <Title>New Post</Title>
                            </Body>
                            <Right></Right>
                        </Header>
                        <ScrollView keyboardShouldPersistTaps="always">
                        <View style={styles.textareaView}>
                            <CardItem>
                                <Left>
                                    {this.userProfile(accountStore.user.avatar)}
                                    <Body>
                                        <Text>{`${accountStore.user.firstname} ${accountStore.user.lastname}`}</Text>
                                    </Body>
                                </Left>
                            </CardItem>
                            <View>
                                <TextInput
                                    underlineColorAndroid="rgba(0,0,0,0)"
                                    textAlignVertical="top"
                                    multiline
                                    style={{borderColor: '#ccc',borderWidth: 1, height: 200,}}
                                    placeholderTextColor="#a6a6a6" 
                                    onChangeText={(content) => this.setState({content})}
                                    placeholder="Share a post. What do you have to contribute?" />
                            </View>
                            <Button onPress={() => this.selectImage()} block transparent style={{backgroundColor: '#DCECC1'}} iconRight>
                                <Text style={{color: '#82BE30'}}>Add Media</Text>
                                <Icon style={{color: '#82BE30'}} name='ios-camera-outline' />
                            </Button>
                            <Text style={{alignSelf: 'flex-end', color: this.state.content.length > 500 ? 'red': '#444'}}>
                                {this.state.content.length} / 500
                            </Text>
                            <View style={{marginTop: 30, marginBottom: 20}}>
                                <TextInput
                                    underlineColorAndroid="rgba(0,0,0,0)"
                                    style={{borderColor: '#ccc',borderWidth: 1,}}
                                    placeholderTextColor="#a6a6a6"  
                                    placeholder="Share Link"
                                    onChangeText={(link) => this.setLink(link)}
                                />
                            </View>
                            <Button disabled={this.state.disabled} onPress={() => this.post()} block>
                                <Text>Post</Text>
                            </Button>
                        </View>   
                        </ScrollView>    
                    </View>
            </StyleProvider>
        )
    }
}
const styles = StyleSheet.create({
    textareaView: {
        width: '92%',
        alignSelf: 'center',
        backgroundColor: `#fff`
    }
})