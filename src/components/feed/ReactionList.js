import React, { Component } from 'react'
import { Button, Icon, Text, Left, Body, Right, Header, Title, StyleProvider, Container, ListItem, Thumbnail } from 'native-base'
import { View, StyleSheet, BackHandler, FlatList } from 'react-native'
import { Actions } from 'react-native-router-flux'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'


export default class ReactionList extends Component {


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


    render() {
        const item = this.props.data
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
                            <Title>Liked by</Title>
                        </Body>
                        <Right> 
                        </Right>
                    </Header>
                    <View style={styles.container}>
                    <FlatList
                        data={item}
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