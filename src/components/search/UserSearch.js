import React, { Component } from 'react'
import { View, Text, FlatList } from 'react-native'
import { ListItem, Left, Body, Thumbnail, Right } from 'native-base'
import searchStore from '../../stores/Search'
import { Actions } from 'react-native-router-flux'

import { observer } from 'mobx-react/native'

@observer
export default class UserSearch extends Component {

    userProfile = (avatar) => {
        if(avatar == null || avatar == '') {
            return (
                <Thumbnail source={require('../logo.png')} resizeMode="center"/>
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
        return (
            <View>
                { searchStore.users.length > 0 ? 
                    <FlatList
                    data={searchStore.users.slice()}
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
                        </Body>
                        <Right style={{marginRight: 10}}>
                        
                        </Right>
                    </ListItem>
                    }
                    keyExtractor={item => `${item.id}`}
                    />
               : 
               <Text style={{textAlign: 'center', marginVertical: '5%'}}>No items</Text>
               }
            </View>
        )
    }
}


