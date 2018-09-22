import React, { Component } from 'react'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import { Thumbnail, ListItem, Left, Right, Body } from 'native-base'
import MediaHandler from '../feed/MediaHandler'
import { observer } from 'mobx-react/native'
import searchStore from '../../stores/Search'
import accountStore from '../../stores/Account'
import moment from 'moment'
import { Actions } from 'react-native-router-flux'

@observer
export default class PostSearch extends Component {

    userProfile = (origin) => {
        // if(avatar == null || avatar == '') {
        //     return (
        //         <Thumbnail source={require('../logo.png')} resizeMode="center"/>
        //     )
        // }
        // else {
        //     return (
        //         <Thumbnail source={{uri: avatar}}/>
        //     )
        // }
        if(origin.id == accountStore.user.id) {
            return (
                <Thumbnail source={{uri: accountStore.user.avatar}}/>
            )
        }
        else if(origin.avatar == null || origin.avatar == '') {
            return (
                <Thumbnail source={require('../logo.png')} resizeMode="center"/>
            )
        }
        else {
            return (
                <Thumbnail source={{uri: origin. avatar}}/>
            )
        }
    }
    render() {
        return (
            <View style={{flex: 1}}>
               { searchStore.items.length > 0 ? 
                    <FlatList
                        legacyImplementation
                        initialNumToRender={10}
                        data={searchStore.items.slice()}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item}) =>
                        <View style={{borderBottomWidth: 1, borderColor: '#ddd'}}>
                        <ListItem avatar onPress={() => Actions.post({item: item})}>
                            <Left style={{height: '80%'}}>
                                <TouchableOpacity onPress={() => Actions.otherprofile({data: item.origin.id})}>
                                    {this.userProfile(item.origin)}
                                </TouchableOpacity>
                            </Left>
                            <Body style={{borderBottomWidth: 0}}>
                                <View style={{flexDirection: 'row', marginBottom: 5}}>
                                {item.origin.id == accountStore.user.id ? 
                                <Text style={{color: '#444', fontWeight: 'bold'}}>
                                    {`${accountStore.user.firstname} ${accountStore.user.lastname}`}
                                </Text>
                                    : 
                                <Text style={{color: '#444', fontWeight: 'bold'}}>
                                    {`${item.origin.firstname} ${item.origin.lastname}`}
                                </Text> 
                                }
                                    {item.origin.role == 5 ? 
                                        <Text note style={{color: '#82BE30', marginHorizontal: '3%'}}>Verified</Text>
                                    : null}
                                    <Right style={{marginRight: 5}}>
                                        <Text style={{color: '#555', fontSize: 14}}>{moment(new Date(item.createdAt)).fromNow()}</Text>
                                    </Right>
                                </View>
                                <Text style={{color: '#777'}}>{item.content}</Text>
                                {/* {this.renderLinks(item.links)} */}
                                <MediaHandler data={item} />
                            </Body>
                        </ListItem>
                    </View>
                        }
                        keyExtractor={item => item._id}
                        />
               : 
               <Text style={{textAlign: 'center', marginVertical: '5%'}}>No items</Text>
               }
            </View>
        )
    }
}


