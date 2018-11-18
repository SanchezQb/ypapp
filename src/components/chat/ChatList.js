import React, { Component } from 'react'
import { 
    StyleProvider, 
    Header, 
    Left, 
    Body, 
    Right, 
    Button,
    Title, 
    ListItem, Thumbnail, Container, Icon, Text
} from 'native-base';
import { StyleSheet, UIManager, findNodeHandle, View, ScrollView, Alert, ActivityIndicator } from 'react-native'
import { Actions } from 'react-native-router-flux'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'
import { observer } from 'mobx-react/native'
import messagingStore from '../../stores/Messaging'
import accountStore from '../../stores/Account';

@observer
export default class ChatList extends Component {

    componentDidMount() {
        messagingStore.fetchAllConversations()
    }

    onMenuPressed = (labels) => {
        const { onPress } = this.props;
        UIManager.showPopupMenu (
            findNodeHandle(this.menu),
            ["New Chat"],
            () => {},
            (result, index) => {
            if (index == 0) {
              Actions.newChat()
            }
          },
        );
    };
    generateNameFromMembers = (members) => {
        let string = members.reduce((a, b) => `${a} ${b.firstname} ${b.lastname} `, '');
        string = string.trim().slice(0, (string.length - 2));
        if (string.length > 18) {
          string = string.slice(0, string.length - 8);
          string = `${string}...`;
        }
        return string;
    }
    
    leaveConversation = (id) => {
        Alert.alert(
          'Leave Conversation',
          'Are you sure you want to leave this conversation?',
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'OK', onPress: () => messagingStore.leaveConversation(id)},
          ],
          { cancelable: false }
        )
      }
      userProfile = (data) => {
        if(data.type == 2) {
            return (
                <View style={{width: 60, height: 60, borderRadius: 30, backgroundColor: '#F2F3F4', justifyContent: 'center', alignItems: 'center'}}>
                    <Icon name="ios-microphone-outline" style={{fontSize: 32, color: '#82BE30', fontWeight: 'bold'}} />
                </View>
            )
        }
        else if(data.type == 3) {
            return (
                <View style={{width: 60, height: 60, borderRadius: 30, backgroundColor: '#F2F3F4', justifyContent: 'center', alignItems: 'center'}}>
                    <Icon name="md-megaphone" style={{fontSize: 32, color: '#82BE30'}} />
                </View>
            )
        }
        else if(data.members[0].avatar == null || data.members[0].avatar == '') {
            return (
                <Thumbnail source={require('../logo.png')} resizeMode="center"/>
            )
        }
        else {
            return (
                <Thumbnail source={{uri: data.members[0].avatar}}/>
            )
        }
    }
    reset = () => {
        messagingStore.fetchAllConversations()
    }

    render() {
        if (messagingStore.isLoading) {
            return (
              <View style={{flex: 1, justifyContent: 'center'}}>
                <ActivityIndicator size="large" color="#82BE30"/>
              </View>
            );
          }
          else if (messagingStore.error) {
            return (
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#444'}}>Could not load Chats :(</Text>
                <Text></Text>
                <Text></Text>
                <Button style={{backgroundColor: '#82BE30', alignSelf: 'center'}}onPress={() => {this.reset()}}>
                    <Text>Retry</Text>
                </Button>
              </View>
              
            )
        }
        // else if (messagingStore.logs.length == 0) {
        //     return (
        //         <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        //             <Text style={{color: '#444'}}>There are no chats to display</Text>
        //             <Text style={{color: '#444'}}>Click the button on the top right to start chat</Text>
        //             <Text></Text>
        //         </View>
        //     )
        // }
        const { labels } = this.props;
        const logs = messagingStore.logs.map(data => {
            const title = data.topic ? data.topic : this.generateNameFromMembers(data.members.filter(item => item.id !== accountStore.user.id));
            return (
                <ListItem 
                    key={data._id}
                    avatar 
                    style={{paddingVertical: 15}} 
                    onPress={() => Actions.chat({data: data})}>
                    <Left>
                        {this.userProfile(data)}
                    </Left>
                    <Body>
                        <Text style={{color: '#444', fontWeight: 'bold'}}>
                        {title}
                        </Text>
                        {/* <Text style={{color: '#777'}} >Doing what you like will always keep you happy . .</Text> */}
                    </Body>
                    <Right>
                        {/* <Text note>{moment(new Date(data.createdAt)).fromNow()}</Text> */}
                    </Right>
                </ListItem>
            )

        })
        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <Header noShadow>
                        <Left>
                            <Button onPress={() => Actions.drawerOpen()} transparent>
                                <Icon name="md-menu" style={{ color: '#fff'}}/>
                            </Button>
                        </Left>
                        <Body>
                            <Title>Chat</Title>
                        </Body>
                        <Right>
                            <Button transparent  onPress={() => this.onMenuPressed(labels)}>
                                <View style={{flexDirection: 'row'}}>
                                    <View>
                                        <View
                                            ref={c => this.menu = c}
                                            style={{
                                                backgroundColor: 'transparent',
                                                width: 1,
                                                height: StyleSheet.hairlineWidth,
                                            }}
                                        />
                                        <Icon
                                            name="md-add"
                                            style={{color: 'white', fontSize: 28 }}
                                        />
                                    </View>
                                </View>
                            </Button> 
                        </Right>
                    </Header>
                    { messagingStore.logs.length == 0 ? 
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: '#444'}}>There are no chats to display</Text>
                        <Text style={{color: '#444'}}>Click the button on the top right to start chat</Text>
                        <Text></Text>
                    </View>
                    :
                    <ScrollView>
                        {logs} 
                    </ScrollView> 
                    }
                </Container>
            </StyleProvider>
        )
    }
}