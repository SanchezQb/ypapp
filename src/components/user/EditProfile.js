import React, { Component } from 'react'
import { Button, Icon, Text, Left, Body, Right, Header, Title, StyleProvider, Container, Thumbnail, Item, Label, Input } from 'native-base'
import { View, StyleSheet, BackHandler, TouchableOpacity, ToastAndroid, ScrollView, TextInput } from 'react-native'
import { Actions } from 'react-native-router-flux'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'
import accountStore from '../../stores/Account'
import { observer } from 'mobx-react/native'
import ImagePicker from 'react-native-image-crop-picker';


@observer
export default class EditProfile extends Component {

    state = { 
        currentAvatar: accountStore.user.avatar,
        disabled: false,
        firstname: accountStore.user.firstname,
        lastname: accountStore.user.lastname
    }
    
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress () {
        Actions.pop()
        return true
    }

    userProfile = () => {
        if(this.state.currentAvatar == null || this.state.currentAvatar == '') {
            return (
                <Thumbnail style={styles.dp} source={require('../logo.png')}/>
            )
        }
        else {
            return (
                <Thumbnail style={styles.dp} source={{uri: this.state.currentAvatar}}/>
            )
        }
    }
    selectImage = () => {
        ImagePicker.openPicker({
            cropperCircleOverlay: true,
            width: 300,
            height: 300,
            cropping: true
          }).then(image => {
            this.setState({avatar: image.path, currentAvatar: image.path})
          });
    }

    updateProfile = () => {
        // this.setState({disabled: true})
        // if(this.state.avatar) {
        //     RNCloudinary.UploadImage(this.state.avatar)
        //     .then(res => {
        //         console.log(res)
        //         const request = {
        //             user: {
        //                 ...this.state,
        //                 avatar: res,
        //             }
        //         }
        //         axios({
        //             url: 'https://ypn-base-01.herokuapp.com/user', 
        //             method: 'PUT', 
        //             data: request,
        //             headers: {
        //                 "Content-Type": "application/json",
        //                 "Authorization": `${accountStore.user.token}`
        //             },
        //         }).then(res => {
        //             this.setState({disabled: false})
        //             console.log(res)
        //         })
        //         .catch(err => console.log(err))

        //     })
        //     .catch(err => ToastAndroid.show('There was a problem uploading your photo, Please try again or try a different photo', ToastAndroid.SHORT))
        // }
        ToastAndroid.show('Updating Profile', ToastAndroid.SHORT)
        Actions.pop()
        accountStore.editProfile(this.state)
    }
   
    render() {
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
                            <Title>Edit Profile</Title>
                        </Body>
                        <Right>
                            <Button onPress={() => this.updateProfile()}transparent>
                                <Icon name="md-checkmark" style={{ color: '#F0BA00'}}/>
                            </Button>
                        </Right>
                    </Header>
                    <View style={styles.span}>
                    </View>
                    <TouchableOpacity style={styles.dpcont} onPress={() => this.selectImage()}>
                        {this.userProfile()}
                    </TouchableOpacity>
                    <ScrollView keyboardShouldPersistTaps="always">
                        <View style={styles.form}>
                            <Item stackedLabel style={styles.item}>
                                <Label style={{color: '#444'}}>FIRSTNAME</Label>
                                <Input
                                    value={this.state.firstname}
                                    style={{ paddingVertical: 0}}  
                                    onChangeText={(firstname) => this.setState({firstname})}
                                 />
                            </Item>
                            <Item stackedLabel style={styles.item}>
                                <Label style={{color: '#444'}}>LASTNAME</Label>
                                <Input
                                    value={this.state.lastname}
                                    style={{ paddingVertical: 0}}  
                                    onChangeText={(lastname) => this.setState({lastname})}
                                 />
                            </Item>
                            <View style={styles.item}>
                                <Label style={{color: '#444'}}>BIO</Label>
                                <TextInput
                                    maxLength={140}
                                    underlineColorAndroid="rgba(0,0,0,0)"
                                    textAlignVertical="top"
                                    multiline
                                    style={{borderColor: '#ccc', borderBottomWidth: 1, paddingVertical: 5}}
                                    onChangeText={(bio) => this.setState({bio})}
                                 />
                            </View>
                        </View>
                    </ScrollView>
                </Container>
            </StyleProvider>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    dpcont: {
        justifyContent: 'center',
        backgroundColor: '#f2f2f2',
        height: 90,
        borderRadius: 45,
        width: 90,
        alignSelf: 'center',
        position: 'absolute',
        top: 80,
        zIndex: 200,
        alignItems: 'center'
    },
    dp: {
        height: 80,
        borderRadius: 40,
        width: 80,
        alignSelf: 'center'
    },
    span: {
        height: 90,
        backgroundColor: '#82BE30',    
    },
    form: {
        width: '85%',
        alignSelf: 'center',
        marginTop: 70
    },
    item: {
        marginBottom: 15,
        zIndex: -100
    },
})