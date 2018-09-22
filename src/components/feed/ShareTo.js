import React, { Component } from 'react'
import { Button, Icon, Text, Left, Body, Right, Header, Title, StyleProvider, Container, ListItem, Thumbnail } from 'native-base'
import { View, StyleSheet, BackHandler, ScrollView,} from 'react-native'
import { Actions } from 'react-native-router-flux'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'
import accountStore from '../../stores/Account'
import messagingStore from '../../stores/Messaging'


export default class ShareTo extends Component {

    state = {
        chatLogs: messagingStore.logs,
        followers: accountStore.user.followers.filter(item => item !== null)
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

    userProfile = (avatar) => {
        if(avatar == null || avatar == '') {
            return (
                <Thumbnail resizeMode="center" source={require('../logo.png')}/>
            )
        }
        else {
            return (
                <Thumbnail source={{uri: avatar}}/>
            )
        }
    }
    renderName = (item) => {
        if(item.lastname == null) {
            return (
                <Text style={{color: '#444', fontWeight: 'bold'}}>
                    {`${item.firstname}`}
                </Text>
            )
        }
        else {
            return (
                <Text style={{color: '#444', fontWeight: 'bold'}}>
                    {`${item.firstname} ${item.lastname}`}
                </Text>
            )
        }
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
    userProfile = (data) => {
        if(data.type == 2) {
            return (
                // <Thumbnail source={require('../microphone.png')}/>
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
    userProfile2 = (avatar) => {
        if(avatar == null || avatar == '') {
            return (
                <Thumbnail source={require('../logo.png')}/>
            )
        }
        else {
            return (
                <Thumbnail source={{uri: avatar}}/>
            )
        }
    }

    handlePress = (data) => {
       if(data._id) {
           Actions.chat({data, reference: this.props.data})
       }
       else {
        messagingStore.startPersonalConversation([data], this.props.data)
       }
    }


    render() {
        const logs = this.state.chatLogs.reverse().map(data => {
            const title = data.topic ? data.topic : this.generateNameFromMembers(data.members.filter(item => item.id !== accountStore.user.id));
            return (
                <ListItem 
                    key={data._id}
                    avatar 
                    style={{paddingVertical: 15}} 
                    onPress={() => this.handlePress(data)}>
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

        const followers = this.state.followers.map(follower => {
            return (
                <View key={follower.id}>
                    <ListItem avatar style={{paddingVertical: 15, marginLeft: 15}} onPress={() =>  this.handlePress(follower)}>
                        <Left>
                            {this.userProfile2(follower.avatar)}
                        </Left>
                        <Body style={{borderBottomWidth: 0}}>
                            <Text>{`${follower.firstname} ${follower.lastname}`}</Text>
                            <Text style={{color: '#82BE30'}}>{`${follower.lga}, ${follower.state} State`}</Text>
                        </Body>
                        <Right style={{borderBottomWidth: 0, marginRight: 0}}>
                           
                        </Right>
                    </ListItem>
                </View>
            )
        })
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
                            <Title>Share with...</Title>
                        </Body>
                        <Right> 
                        </Right>
                    </Header>
                    <View style={styles.container}>
                        <ScrollView>
                            {logs}
                            {followers}
                        </ScrollView>
                    </View>
                </Container>
            </StyleProvider>
        )
    }
}
const styles = StyleSheet.create({
    touchable: {
        backgroundColor: '#82BE30',
        paddingHorizontal: 2,
        paddingVertical: 4,
        width: 60,
        alignItems: 'center',
        borderRadius: 2
    },
    container: {
    flex: 1
    }
})