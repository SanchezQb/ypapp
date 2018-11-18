import React, { Component } from 'react'
import { 
    StyleProvider, 
    Header, 
    Left, 
    Body, 
    Right, 
    Button, 
    Icon, Title, Thumbnail, Text, Container } from 'native-base';
import { StyleSheet, View, ScrollView } from 'react-native'
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import { Actions } from 'react-native-router-flux'

export default class AspirantProfile extends Component {
    

    render() {
        const item = this.props.data
        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <Header>
                        <Left>
                            <Button transparent onPress={() => Actions.pop()}>
                                <Icon name="arrow-back" style={{color: '#fff'}}/>
                            </Button>
                        </Left>
                        <Body>
                            <Title>{`${item.name.split(" ")[0]} ${item.name.split(" ")[1]}`}</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <ScrollView>
                        <View style={styles.view}>
                            <View>
                                {item.avatar ? 
                                    <Thumbnail large source={{uri: item.avatar}} resizeMode="center" style={{alignSelf: 'center'}} />
                                :
                                    <Thumbnail large source={require('../logo.png')} resizeMode="center" style={{alignSelf: 'center'}} />
                                }
                                <Text style={{color: '#777', fontSize: 18, textAlign: 'center', marginTop: 10}}>{item.position}</Text>
                                {item.constituencyIndex ? <Text style={{textAlign: 'center'}}>Constituency {item.constituencyIndex}</Text> : null}
                                <Text style={{color: '#82BE30', fontSize: 18, textAlign: 'center'}}>{item.location.join(", ")}</Text>
                            </View>
                        </View>
                        <View style={{width: '93%', alignSelf: 'center', marginTop: 30}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', color: '#555', marginVertical: 10}}>{item.name.split(" ")[0]} {item.name.split(" ")[1]}'s Bio:</Text>
                            <Text style={{fontSize: 16, color: '#555'}}>
                           {item.bio}
                            </Text>
                        </View>
                    </ScrollView>
                </Container>
            </StyleProvider>
        )
    }
}
const styles = StyleSheet.create({
    view: {
       marginTop: 30,
       borderColor: '#ccc',
       borderBottomWidth: 1,
       paddingBottom: 20,
       width: '93%',
       alignSelf: 'center'
    },
    buttonContainer: {
        width: '93%',
        alignSelf: 'center',
        marginTop: 70
    },
    button: {
        backgroundColor: '#82BE30',
    },
})

