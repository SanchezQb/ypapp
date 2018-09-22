import React, { Component } from 'react'
import { 
    StyleProvider, 
    Header, 
    Left, 
    Body, 
    Right, 
    Icon, 
    Button,
    Title,
    Thumbnail, Text, View, ListItem
} from 'native-base';
import { StyleSheet, BackHandler, ScrollView, ToastAndroid} from 'react-native'
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import { Actions } from 'react-native-router-flux'
import messagingStore from '../../stores/Messaging';
import accountStore from '../../stores/Account'

export default class NewChat extends Component {
    constructor() {
        super()
        this.state = {
            followers: accountStore.user.followers.filter(item => item !== null),
            members: [],
            selected: false
        }
        this.baseState = this.state
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
                <Thumbnail source={require('../logo.png')}/>
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
    handleSelect = (data) => {
        console.log(data)
    }
      renderItems = () => {
        const items = this.state.followers.map((item, i) => <SingleUser key={i} data={item} obj={{ ...this.props }} />);
        return (
             <ScrollView>
                    { items }
            </ScrollView>
        );
      }

    render() {
        console.log(this.state.followers)
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
                            <Title>New Chat</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <View style={{paddingBottom: 100}}>
                    {this.state.followers.length ? this.renderItems(): null}
                    </View>
                </View>
            </StyleProvider>
        )
    }
}
const SingleUser = ({data}) => (
    <ListItem 
        avatar 
        style={{paddingVertical: 15}}
        onPress={() => messagingStore.startPersonalConversation([data])}>
        <Left>
            {/* {this.userProfile(data.avatar)} */}
            {data.avatar ? 
                <Thumbnail source={{uri: data.avatar}}/>
                :
                <Thumbnail source={require('../logo.png')}/>
            }
        </Left>
        <Body>
            <Text style={{color: '#444', fontWeight: 'bold'}}>
                    {`${data.firstname} ${data.lastname}`}
                </Text>
        </Body>
    </ListItem>
)

const styles = StyleSheet.create({
    end: {
        height: 150,
        backgroundColor: '#e1e1e1',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    listitem: {
        marginLeft: 0,
        borderBottomWidth: 0
    },
    touchable: {
        backgroundColor: '#82BE30',
        padding: 2,
        width: 60,
        borderRadius: 4
    },
    picker: {
        color: '#82BE30', 
        width: '30%', 
        marginLeft: 25
    },
})