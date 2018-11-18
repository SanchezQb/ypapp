import React, { Component } from 'react'
import { StyleProvider, Container, Header, Left, Right, Body, Title, Button, Icon,} from 'native-base';
import { View, Text, BackHandler, ActivityIndicator, TouchableOpacity, StyleSheet, AsyncStorage, ToastAndroid, Dimensions } from 'react-native'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { Actions } from 'react-native-router-flux'
import messagingStore from '../../stores/Messaging';
import accountStore from '../../stores/Account';
window.navigator.userAgent = 'react-native'
const io = require('react-native-socket.io-client/socket.io');
const uuidv3 = require('uuid/v3');
import axios from 'axios'
import Config from '../../config'



export default class Chat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      content: ''
    }
    this.socket = io(`https://yon-notification.herokuapp.com/conversation`, { query: { convoID: this.props.data._id } });
    this.registerEvents();
  }
 
  registerEvents = () => {
    this.socket.on('incoming-message', (data) => {
      // messagingStore.incomingMessage(data)
      this._storeMessages(data);
    });
  }
 
  componentWillUnmount () {
      messagingStore.fetchAllConversations()
      this.persistChat()
      BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress () {
      Actions.pop()
      return true;
  }

  persistChat = () => {
    AsyncStorage.setItem(this.props.data._id, JSON.stringify(this.state.messages))
  }

   async componentWillMount() {
    try {
      let chat = await AsyncStorage.getItem(this.props.data._id)
      let parsed = JSON.parse(chat)
      if(chat !== null) {
         this.setState({messages: parsed})
      }
      else {
         this.setState({messages: []})
      }   
    }
    catch(error) {
      ToastAndroid.show('Error fetching messages', ToastAndroid.SHORT)
    }   
   }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    this.updateConversation(this.props.data._id)
  }
  updateConversation = async (id) => {
    axios({
        url: `${Config.postUrl}/convos/${id}`, 
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${accountStore.user.token}`
        },
    })
    .then(response => {
      const res = [];
      response.data.data.messages.map((message, index) => {
      const obj = {
          _id: uuidv3(`${index}`, uuidv3.DNS),
          text: message.content,
          createdAt: message.createdAt,
          reference: message.referenceObject,
          user: {
            _id: message.origin.id,
            name: message.origin.firstname,
          }
        };
      res.unshift(obj)
      })
      this.setState({messages: res})
      if(this.props.reference) {
        this.handleReference(this.props.reference)
      }
      let regObj = {}
      regObj[`${response.data.data.messages._id}`] = response.data.data.messages.reverse()
      messagingStore.updateReg(regObj)
    })
    .catch(err => {
        ToastAndroid.show('Something went wrong, could not fetch messages', ToastAndroid.SHORT)
    })
}

 handleReference = (reference) => {
   let obj = {
    content: `shared a post by ${reference.origin.firstname}`,
    origin: accountStore.user,
    type: 2,
    destination: this.props.data._id,
    createdAt: Date.now(),
    referenceObject: reference,
    referenceID: reference._id

  }
  messagingStore.sendMessage({...obj, token: accountStore.user.token}, this.socket)
  this.storeRefMessage(obj)
 }

  //formatToSendMessage
  formatMessage = (messages) => {
    let obj = null
      messages.map((message)=> {
         obj = {
          content: message.text,
          origin: accountStore.user,
          type: 2,
          destination: this.props.data._id,
          createdAt: Date.now()
        } 
      })
      return obj
  }
  storeRefMessage = (message = []) => {
    if(Array.isArray(message)){
      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, message),
        };
      });
    }
    else {
      let res = []
      let obj = {
        _id: Math.floor(Math.random() * 20),
        text: `${message.content}`,
        reference: message.referenceObject,
        createdAt: message.createdAt,
        user: {
          _id: message.origin.id,
          name: message.origin.firstname
        }
      }
      res.unshift(obj)
      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, res),
        };
      });
    }
  }

  onSend(messages = []) {
    let data = this.formatMessage(messages)
    messagingStore.sendMessage({...data, token: accountStore.user.token}, this.socket)
    messagingStore.fetchAllConversations()
    this._storeMessages(messages);
  }

  _storeMessages = (messages) => {
    if(Array.isArray(messages)){
      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, messages),
        };
      });
    } 
    else {
      let data = this.formatoSaveMessage(messages)
      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, data),
        };
      });
    }
  }
  formatoSaveMessage(message){
    let res = []
    let obj = {
      _id: Math.floor(Math.random() * 20),
      text: message.content,
      createdAt: message.createdAt,
      reference: message.referenceObject,
      user: {
        _id: message.origin.id,
        name: message.origin.firstname
      }
    }
    res.unshift(obj)
    return res
  }
  generateNameFromMembers = (members) => {
    let string = members.reduce((a, b) => `${a} ${b.firstname} ${b.lastname} `, '');
    string = string.trim().slice(0, (string.length - 2));
    if (string.length > 18) {
      string = string.slice(0, string.length - 8);
      string = `${string}...`;
    }
    return string;
}
  renderLoading() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#82BE30"/>
      </View>
    )
  }

  renderText = (messages) => {
    console.log(messages)
  }

  renderChatFooter(props) {
    if(props.currentMessage.reference) {
      return (
        <TouchableOpacity onPress={() => Actions.post({item: props.currentMessage.reference})} style={{backgroundColor: '#edf5e0', minHeight: 40, borderWidth: 2,  borderColor: '#ccc'}}>
          <Text style={{margin: 5}}>{props.currentMessage.reference.content}</Text>
        </TouchableOpacity>
      )
    }
    else {
      return null
    }
  }
  renderBubble(props) {
    if (props.isSameUser(props.currentMessage, props.previousMessage)
     && props.isSameDay(props.currentMessage, props.previousMessage)) {
      return (
        <View style={{marginVertical: 4}}> 
          <Bubble
            {...props} 
            wrapperStyle={{
                left: {
                  backgroundColor: '#edf5e0',
                  borderRadius: 5
                  
                },
                right: {
                  backgroundColor: '#82BE30',
                  borderRadius: 5
                }
              }}
          />
        </View>
    );
    }
    else if(this.props.data.focus && ( props.currentMessage.user._id === this.props.data.focus.user.id)) {
      return (
        <View style={{marginVertical: 4}}> 
          <Text 
            style={{ 
              color: '#F0BA00',
              fontWeight: 'bold', 
              alignSelf:'flex-start',
              marginBottom: 5
              }}>
              {props.currentMessage.user.name}
          </Text>  
          <Bubble
            {...props} 
            wrapperStyle={{
                left: {
                  backgroundColor: 'rgba(240,186,0,0.5)',
                  borderRadius: 5
                  
                },
                right: {
                  backgroundColor: '#82BE30',
                  borderRadius: 5
                }
              }}
          />
        </View>
      )
    }
    return ( 
      <View style={{marginVertical: 4}}>
        {props.currentMessage.user._id === props.user._id ? 
        <Text></Text>
         : 
        <Text 
        style={{ 
          color: '#82BE30',
          fontWeight: 'bold', 
          alignSelf:'flex-start',
          marginBottom: 5
          }}>{props.currentMessage.user.name}
        </Text> 
        } 
        <Bubble
          {...props} 
          wrapperStyle={{
              left: {
                backgroundColor: '#edf5e0',
                borderRadius: 5
                
              },
              right: {
                backgroundColor: '#82BE30',
                borderRadius: 5
              }
            }}
        />
      </View>
      )
    }

    onLoad() {
      return (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color="#82BE30"/>
        </View>
      )
    }
 
  render() {
    const title = this.props.data.topic ? this.props.data.topic : this.generateNameFromMembers(this.props.data.members.filter(item => item.id !== accountStore.user.id));
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
                    <Title>{title}</Title>
                </Body>
                <Right> 
                </Right>
            </Header>
            <View style={{flex: 1}}>
              <View style={{backgroundColor: '#444'}}>
                { this.props.data.type == 3 ? <Text style={styles.topicTitle}><Text style={{color: '#F0BA00'}}>Focus:</Text> {this.props.data.focus.user.name}</Text> : null }
              </View>
              <GiftedChat
                  renderAvatar={null}
                  onSend={messages => this.onSend(messages)}
                  messages={this.state.messages}
                  user={{
                    _id: accountStore.user.id,
                    name: accountStore.user.firstname
                  }}
                  textInputProps={{
                    style: {backgroundColor: '#fff', width: '90%'}
                  }}
                  isAnimated
                  renderLoading={this.onLoad.bind(this)}
                  renderBubble={this.renderBubble.bind(this)}
                  renderCustomView={this.renderChatFooter.bind(this)}
              />
            </View>
          </Container>
        </StyleProvider>
    )
  }
}
const styles = StyleSheet.create({
  topicTitle: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: (( Dimensions.get('window').height) * 0.02),
    padding: '6%'
  },
})