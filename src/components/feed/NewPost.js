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
            multiple: true
          }).then(images => {
           if(images.length > 4) {
               ToastAndroid.show('Maximum of 4 images', ToastAndroid.SHORT)
           }
           else {
               console.log(images)
           }
          });
    }

    post = () => {
        const request = {
            ...this.state
        }
        this.setState({disabled: true})
        axios({
            url: 'https://ypn-node-service.herokuapp.com/api/v1/posts', 
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

    setLink = (link) => {
        let arr = []
        let a = arr.slice();
        a[0] = link;
        this.setState({links: a});
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
    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <ScrollView keyboardShouldPersistTaps="always">
                    <View style={{backgroundColor: `#fff`}}>
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
                                    maxLength = {160}  
                                    style={{borderColor: '#ccc',borderWidth: 1, height: 200,}}
                                    placeholderTextColor="#a6a6a6" 
                                    onChangeText={(content) => this.setState({content})}
                                    placeholder="Share a post. What do you have to contribute?" />
                            </View>
                            <Button onPress={() => this.selectImage()} block transparent style={{backgroundColor: '#DCECC1'}} iconRight>
                                <Text style={{color: '#82BE30'}}>Add Media</Text>
                                <Icon style={{color: '#82BE30'}} name='ios-camera-outline' />
                            </Button>
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
                    </View>
                </ScrollView>
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