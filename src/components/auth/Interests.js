import React, { Component } from 'react'
import { StyleProvider, Body, Header, Button, ListItem, Title, Left, Right, Icon, Text, View, CheckBox } from 'native-base';
import { StyleSheet, StatusBar } from 'react-native'
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import { Actions } from 'react-native-router-flux'


export default class Interests extends Component {

    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <React.Fragment>
                    <StatusBar
                        backgroundColor="#82BE30"
                    />
                    <Header noShadow>
                        <Left>
                            <Button transparent onPress={() => Actions.drawerOpen()}>
                                <Icon name="arrow-back" style={{color: '#fff'}}/>
                            </Button>
                        </Left>
                        <Body>
                            <Title></Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={() => Actions.drawerOpen()}>
                               <Text>Skip</Text>
                            </Button>
                        </Right>
                    </Header>
                    <View style={styles.span}>
                        <View style={{width: '80%', alignSelf: 'center'}}>
                            <Text 
                                style={{textAlign: 'center', color: '#fff', fontSize: 21, fontWeight: 'bold'}}>
                                Interests
                            </Text>
                            <Text 
                                style={{textAlign: 'center', color: '#fff', fontSize: 18}}>
                                Scroll and select at least 3 categories to customize your feed
                            </Text>
                        </View>
                    </View>
                    <View style={styles.checkContainer}>
                        <ListItem style={{marginLeft: 0}}>
                            <CheckBox checked={false} color="#82BE30"/>
                            <Body>
                                <Text style={{color: '#777'}}>Health</Text>
                            </Body>
                        </ListItem>
                        <ListItem style={{marginLeft: 0}}>
                            <CheckBox checked={false} color="#82BE30"/>
                            <Body>
                                <Text style={{color: '#777'}}>Religion</Text>
                            </Body>
                        </ListItem>
                        <ListItem style={{marginLeft: 0}}>
                            <CheckBox checked={false} color="#82BE30"/>
                            <Body>
                                <Text style={{color: '#777'}}>Agriculture</Text>
                            </Body>
                        </ListItem>
                        <ListItem style={{marginLeft: 0}}>
                            <CheckBox checked={false} color="#82BE30"/>
                            <Body>
                                <Text style={{color: '#777'}}>Tourism</Text>
                            </Body>
                        </ListItem>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button block>
                            <Text>finish</Text>
                        </Button>
                    </View>
                </React.Fragment>
            </StyleProvider>
        )
    }
}
const styles = StyleSheet.create({
    span: {
        height: 90,
        backgroundColor: '#82BE30',    
    },
    checkContainer: {
        width: '85%',
        alignSelf: 'center'
    },
    buttonContainer: {
        width: '85%',
        alignSelf: 'center',
        marginTop: 30
    },
})



