import React, { Component } from 'react'
import { Button, Icon, Text, Left, Body, Right, Header, Title, StyleProvider, Container, Content, ListItem, Switch } from 'native-base'
import { StyleSheet, BackHandler, ToastAndroid, FlatList, Image, TouchableOpacity, View, AsyncStorage} from 'react-native'
import { Actions } from 'react-native-router-flux'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'
import { observer } from 'mobx-react/native'
import notificationStore from '../../stores/Notifications'
import moment from 'moment'

@observer
export default class Notifications extends Component {
    

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
        notificationStore.clearNotficationCount()
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
        if(notificationStore.notifications && notificationStore.notifications.length) {
            notificationStore.updateLastSeenCount(notificationStore.notifications[0].count)
            AsyncStorage.setItem('lastNotificationCount', notificationStore.notifications[0].count.toString())
        }
    }

    onBackPress () {
        Actions.pop()
        return true
    }

    renderNotifications = () => {
        return (
            <View style={{flex: 1}}>
            <FlatList
                legacyImplementation
                initialNumToRender={10}
                data={notificationStore.notifications.slice()}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) =>
                <TouchableOpacity 
                    onPress={() => this.handlePress(item)}
                    style={{
                        backgroundColor: item.count > notificationStore.lastSeenCount ? '#edf5e0': '#fff',
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        paddingVertical: 15, 
                        borderColor: '#f2f3f4', 
                        borderBottomWidth: 1}}>
                    <View style={{alignSelf: 'flex-start', width: 50, height: 50, marginHorizontal: 20}}>
                    {item.origin ? 
                        <Image source={{uri: item.origin.avatar}} resizeMode="center" style={{alignSelf: 'flex-start', width: 50, height: 50, borderRadius: 25}}/> 
                    :
                        <Image source={require('../logo.png')} resizeMode="center" style={{alignSelf: 'flex-start', width: 50, height: 50, borderRadius: 25}}/>
                    } 
                    </View>
                    <View>
                        <Text>{item.message}</Text>
                        <Text style={{fontSize: 14, color: '#444'}}>{moment(new Date(item.time.notification.time)).fromNow()}</Text>
                    </View>
                    <View>
                    </View>
                </TouchableOpacity>
                }
                keyExtractor={(item, index) => index}
            />
            </View>
        )
    }

    handlePress = (data) => {
        if(!data) return 
        if(!data.target) {
           return Actions.otherProfile({data: data.origin.id})
        }
        Actions.singlePost({item: data.target.id})
    }
    render() {
        console.log(notificationStore.notifications.slice())
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
                            <Title>Notifications</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                        {notificationStore.notifications && notificationStore.notifications.length ? this.renderNotifications()
                        :
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Text>You have no new notifications</Text>
                        </View>
                        }
                </Container>
            </StyleProvider>
        )
    }
}
