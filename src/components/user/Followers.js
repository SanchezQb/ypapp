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
import { StyleSheet, TouchableOpacity, View, FlatList, BackHandler } from 'react-native'
import { Actions } from 'react-native-router-flux'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'

export default class Followers extends Component {

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
                <Thumbnail source={require('../logo.png')} resizeMode="center"/>
            )
        }
        else {
            return (
                <Thumbnail source={{uri: avatar}}/>
            )
        }
    }
    render() {
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
                            <Title>Followers</Title>
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
                    <FlatList
                        data={this.props.data.filter(item => item !== null)}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item}) =>
                        <View style={styles.listitem}>
                            <ListItem avatar style={{paddingVertical: 15, marginLeft: 15}} onPress={() =>  Actions.otherprofile({data: item.id})}>
                                <Left>
                                    {this.userProfile(item.avatar)}
                                </Left>
                                <Body style={{borderBottomWidth: 0}}>
                                    <Text>{`${item.firstname} ${item.lastname}`}</Text>
                                    <Text style={{color: '#82BE30'}}>{`${item.lga}, ${item.state} State`}</Text>
                                </Body>
                                <Right style={{borderBottomWidth: 0, marginRight: 0}}>
                                    <TouchableOpacity style={styles.touchable} onPress={() =>  Actions.otherprofile({data: item.id})}>
                                        <Text style={{color: '#fff', textAlign: 'center'}}>View</Text>
                                    </TouchableOpacity>
                                    <View style={{width: 60, marginTop: 10}}>
                                    </View>
                                </Right>
                            </ListItem>
                        </View>
                        }
                        keyExtractor={(item, index) => index}
                        />
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