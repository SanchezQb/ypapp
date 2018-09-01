import React, { Component } from 'react'
import { Button, Icon, Text, Left, Body, Right, Header, Title, StyleProvider, Container, ListItem, Thumbnail } from 'native-base'
import { View, StyleSheet, BackHandler, FlatList, ActivityIndicator } from 'react-native'
import { Actions } from 'react-native-router-flux'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'
import accountStore from '../../stores/Account'
import axios from 'axios'

export default class AllUsers extends Component {
    constructor() {
        super()
        this.state = {
            isLoading: true,
            error: false,
            users: [],
            follow: 'Follow'
        }
        this.baseState = this.state
    }
    componentDidMount() {
        this.fetchFollowsforUser()
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress () {
        Actions.pop()
        return true
    }
    fetchFollowsforUser = async () => {
       await axios({
            url: `https://ypn-base-01.herokuapp.com/users`, 
            method: 'GET', 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${accountStore.user.token}`
            },
        }).then(res => {
            console.log(res)
           this.setState({
               isLoading: false,
               users: res.data.data.filter(item => item.id !== accountStore.user.id)
           })
        })
        .catch(err => {
            this.setState({
                isLoading: false,
                error: true
            })
        })
    }
    reset = () => {
        this.setState(this.baseState)
        this.fetchFollowsforUser()
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

    render() {
        if (this.state.isLoading) {
            return (
              <View style={{flex: 1, justifyContent: 'center'}}>
                <ActivityIndicator size="large" color="#82BE30"/>
              </View>
            );
          }
          else if (this.state.error) {
            return (
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#444'}}>Could not load Users :(</Text>
                <Text></Text>
                <Text></Text>
                <Button style={{backgroundColor: '#82BE30', alignSelf: 'center'}}onPress={() => {this.reset()}}>
                    <Text>Retry</Text>
                </Button>
              </View>
              
            )
        }
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
                            <Title>Follow Users</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <View style={styles.container}>
                    <FlatList
                        data={this.state.users}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item}) =>
                        <ListItem 
                            avatar 
                            style={{paddingVertical: 15}}
                            onPress={() => Actions.otherprofile({data: item.id})}>
                            <Left>
                                {this.userProfile(item.avatar)}
                            </Left>
                            <Body>
                                {this.renderName(item)}
                                <Text style={{color: '#82Be30'}}>User</Text>
                            </Body>
                            <Right style={{marginRight: 10}}>
                                {/* <TouchableOpacity style={styles.touchable} onPress={() => this.follow(item)}>
                                    <Text style={{color: '#fff', textAlign: 'center'}}>{this.state['follow']}</Text>
                                </TouchableOpacity> */}
                            </Right>
                        </ListItem>
                        }
                        keyExtractor={item => `${item.id}`}
                        />
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