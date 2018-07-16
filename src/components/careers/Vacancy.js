import React, { Component } from 'react'
import { 
    StyleProvider, 
    Header, 
    Left, 
    Body, 
    Right, 
    Button, 
    Icon, Title, List, ListItem, Thumbnail, Item, Input, Text } from 'native-base';
import { StyleSheet, View } from 'react-native'
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import { Actions } from 'react-native-router-flux'


export default class Vacancy extends Component {

    render() {
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
                            <Title>Careers</Title>
                            {/* <Subtitle>Header</Subtitle> */}
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <View style={styles.view}>
                        <List style={{width: '100%'}}>
                            <ListItem style={{borderBottomWidth: 0, marginLeft: 0, marginRight: 0}}>
                                <Thumbnail large source={require('../profile.png')}  />
                                <Body>
                                    <Text style={{fontSize: 21}}>Youth Party</Text>
                                    <Text style={{fontSize: 18, color: '#82BE30'}}>Personal Assistant</Text>
                                </Body>
                                <Right>
                                    <Text note style={{fontSize: 16}}>Maitama</Text>
                                </Right>
                            </ListItem>
                        </List>
                    </View>
                    <View style={{width: '93%', alignSelf: 'center'}}>
                        <Text>Upload Resume</Text>
                        <Item>
                            <Input 
                                editable={false} 
                                selectTextOnFocus={false}
                                placeholderTextColor="#a6a6a6" 
                                placeholder='No file selected'/>
                            <Button transparent style={{backgroundColor: '#82BE30'}}>
                                <Text style={{color: '#fff'}}>Browse</Text>
                            </Button>
                        </Item>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button style={styles.button} block>
                            <Text>Apply</Text>
                        </Button>
                    </View>
                </View>
            </StyleProvider>
        )
    }
}
const styles = StyleSheet.create({
    view: {
        flex: 0, 
        paddingVertical: 15,
        borderBottomWidth: 1,
        width: '93%',
        alignSelf: 'center',
        borderColor: '#ddd' 
    },
    buttonContainer: {
        width: '93%',
        alignSelf: 'center',
        marginTop: 30
    },
    button: {
        backgroundColor: '#82BE30',
    },
})
