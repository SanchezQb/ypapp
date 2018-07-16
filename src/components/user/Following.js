import React, { Component } from 'react'
import { 
    StyleProvider, 
    Header, 
    Left, 
    Body, 
    Right, 
    Button, 
    Title, 
    List, ListItem, Thumbnail, Container, Icon, Text
} from 'native-base';
import { StyleSheet, TouchableOpacity, View, ScrollView, BackHandler } from 'react-native'
import { Actions } from 'react-native-router-flux'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'

export default class Following extends Component {

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
                <Thumbnail source={require('../avatar.jpg')}/>
            )
        }
        else {
            return (
                <Thumbnail source={{uri: avatar}}/>
            )
        }
    }
    
    render() {
        const following = this.props.data.map(following => {
            return (
                <View key={following.id} style={styles.listitem}>
                    <ListItem avatar style={{paddingVertical: 15, marginLeft: 15}} onPress={() => Actions.otherprofile({data: following.id})}>
                        <Left>
                            {this.userProfile(following.avatar)}
                        </Left>
                        <Body style={{borderBottomWidth: 0}}>
                            <Text>{`${following.firstname} ${following.lastname}`}</Text>
                            <Text style={{color: '#82BE30'}}>{`${following.lga}, ${following.state} State`}</Text>
                        </Body>
                        <Right style={{borderBottomWidth: 0, marginRight: 0}}>
                            <TouchableOpacity style={styles.touchable} onPress={() => Actions.otherprofile({data: following.id})}>
                                <Text style={{color: '#fff', textAlign: 'center'}}>View</Text>
                            </TouchableOpacity>
                            <View style={{width: 60, marginTop: 10}}>
                            </View>
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
                            <Button transparent onPress={() => Actions.pop()}>
                                <Icon name="arrow-back" style={{ color: '#fff'}}/>
                            </Button>
                        </Left>
                        <Body>
                            <Title>Following</Title>
                        </Body>
                        <Right>
                            <Button transparent>
                                <Icon
                                    name="md-search"
                                    style={{color: 'white' }}
                                />
                            </Button>
                        </Right>
                    </Header>
                    <View>
                    <ScrollView>
                        <List>
                           {following}
                        </List>
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
        padding: 2,
        width: 60,
        borderRadius: 4
    },
    picker: {
        color: '#82BE30', 
        width: '30%', 
        marginLeft: 25
    },
    listitem: {
        borderBottomWidth: 1,
        borderColor: '#ddd',
    }
})