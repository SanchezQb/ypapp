import React, { Component } from 'react'
import { 
    StyleProvider, 
    Header, 
    Left, 
    Body, 
    Right, 
    Button, 
    Icon, Title, List, ListItem, Thumbnail, Item, Input, Text } from 'native-base';
import { StyleSheet, View, BackHandler, ScrollView, ToastAndroid, Linking, Alert } from 'react-native'
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import accountStore from '../../stores/Account'
import moment from 'moment'
import axios from 'axios'
import { Actions } from 'react-native-router-flux'
import Config from '../../config'


export default class Vacancy extends Component {

    state = {
        uri: '',
        fileName: '',
        chosen: false,
        disabled: false
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress () {
        Actions.pop()
        return true;
    }
    userProfile = (avatar) => {
        if(avatar == null || avatar == '') {
            return (
                <Thumbnail large source={require('../logo.png')} resizeMode="center"/>
            )
        }
        else {
            return (
                <Thumbnail large source={{uri: avatar}}/>
            )
        }
    }
    pickFIle = () => {
        DocumentPicker.show({
            filetype: [DocumentPickerUtil.pdf()],
          },(error,res) => {
            // Android
            if(error){
                console.log(error)
                this.setState({
                    choosen: false
                })
                return null
            }
            ToastAndroid.show(
                'File has been selected',
                ToastAndroid.SHORT,
                
              );
              this.setState({
                choosen: true,
                uri: res.uri,
                fileName: res.fileName
            })
          });
    }
    mail = () => {
        Linking.openURL('mailto:info@youthpartyng.com').catch(err => console.error('An error occurred', err));
    }
    confirm = (id) => {
        Alert.alert(
          'Apply for position',
          'Please confirm that you have emailed your resume before clicking apply',
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'Apply', onPress: () => this.apply(id)},
          ],
          { cancelable: false }
        )
      }

    apply(id) {
        this.setState({disabled: true})
        axios({
            url: `${Config.baseUrl}/careers/apply/${id}`, 
            method: 'POST', 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${accountStore.user.token}`
            },
        }).then(res => {
            this.setState({disabled: false})
            console.log(res)
           Actions.pop()
           ToastAndroid.show('Application Successful', ToastAndroid.SHORT)
        })
        .catch(err =>  {
            this.setState({disabled: false})
            ToastAndroid.show('An error occured, please try again later', ToastAndroid.SHORT)
        })
    }

    render() {
        console.log(this.props.item)
        const { item } = this.props
        console.log(this.state)
        return (
            <StyleProvider style={getTheme(material)}>
                <View>
                    <Header>
                        <Left>
                            <Button transparent onPress={() => Actions.pop()}>
                                <Icon name="arrow-back" style={{color: '#fff'}}/>
                            </Button>
                        </Left>
                        <Body>
                            <Title>Career</Title>
                            {/* <Subtitle>Header</Subtitle> */}
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <ScrollView>
                        <View style={{paddingBottom: 100}}>
                        <View style={styles.view}>
                            <List style={{width: '100%'}}>
                                <ListItem style={{borderBottomWidth: 0, marginLeft: 0, marginRight: 0}}>
                                    {this.userProfile(item.origin.avatar)}
                                    <Body>
                                        <Text style={{fontSize: 21}}>{item.origin}</Text>
                                        <Text style={{fontSize: 18, color: '#82BE30'}}>{item.role}</Text>
                                    </Body>
                                    <Right>
                                        <Text note style={{fontSize: 16}}>{item.meta.location}</Text>
                                    </Right>
                                </ListItem>
                                
                                <ListItem style={{borderBottomWidth: 0, marginLeft: 0, marginRight: 0}}>
                                    <Text note style={{fontSize: 16}}>{`Closes ${moment(new Date(item.meta.closing_date)).format('dddd, MMMM Do YYYY')}`}</Text>
                                </ListItem>
                            </List>
                            <View style={{marginVertical: '10%'}}>
                                <View style={{marginBottom: '5%'}}>
                                    <Text style={{fontSize: 18, color: '#444', marginBottom: '2%'}}>Responsibilities</Text>
                                    {item.meta.responsibilities.map((item, index) => {
                                        return <Text key={index}>{`- ${item}`}</Text>
                                    })}
                                </View>
                                <View style={{marginBottom: '5%'}}>
                                    <Text style={{fontSize: 18, color: '#444', marginBottom: '2%'}}>Requirements</Text>
                                    {item.meta.requirements.map((item, index) => {
                                        return <Text key={index}>{`- ${item}`}</Text>
                                    })}
                                </View>
                            </View>
                        </View>
                        <View style={{width: '93%', alignSelf: 'center'}}>
                            <Text style={{fontSize: 18, marginBottom: '2%'}}>Resume</Text>
                            <Text>Send your resume to <Text onPress={() => this.mail()}style={{color: '#82BE30'}}>info@youthpartyng.com</Text></Text>
                            <Text>Filename should be the same as name used to register on the application</Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button disabled={this.state.disabled} onPress={() => this.confirm(item.id)} block>
                                <Text>Apply</Text>
                            </Button>
                        </View>
                        </View>
                    </ScrollView>
                </View>
            </StyleProvider>
        )
    }
}
const styles = StyleSheet.create({
    view: {
        flex: 0, 
        paddingVertical: 15,
        borderBottomWidth: 1,
        width: '93%',
        alignSelf: 'center',
        borderColor: '#ddd' 
    },
    buttonContainer: {
        width: '93%',
        alignSelf: 'center',
        marginTop: 30
    },
})
