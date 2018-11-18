import React, { Component } from 'react'
import { 
    StyleProvider, 
    Header, 
    Left, 
    Body, 
    Right, 
    Button, 
    Icon, Title, List, ListItem, Text} from 'native-base';
import { StyleSheet, View, BackHandler } from 'react-native'
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import { Actions } from 'react-native-router-flux'


export default class Candidates extends Component {

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
                            <Title>Candidates</Title>
                            {/* <Subtitle>Header</Subtitle> */}
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <View style={styles.view}>
                        <List>
                            <View style={{paddingTop: 20}}>
                                <ListItem style={{ marginLeft: 0, }} onPress={() => Actions.aspirants()}>
                                    <Body>
                                    <Text style={{fontSize: 18, fontWeight: 'bold', color: '#444'}}>Aspirants</Text>
                                    </Body>
                                    <Right>
                                       
                                    </Right>
                                </ListItem>
                            </View>
                            <View style={{paddingTop: 20}}>
                                <ListItem style={{ marginLeft: 0}} onPress={() => Actions.sponsored()}>
                                    <Body>
                                    <Text style={{fontSize: 18, fontWeight: 'bold', color: '#444'}}>Sponsored Candidates</Text>
                                    </Body>
                                    <Right>
                                       
                                    </Right>
                                </ListItem>
                            </View>
                            <View style={{paddingTop: 20}}>
                                <ListItem style={{ marginLeft: 0}} onPress={() => Actions.runforoffice()}>
                                    <Body>
                                    <Text style={{fontSize: 18, fontWeight: 'bold', color: '#444'}}>Run For Office</Text>
                                    </Body>
                                    <Right>
                                        
                                    </Right>
                                </ListItem>
                            </View>
                        </List>
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
    touchable: {
        backgroundColor: '#82BE30',
        padding: 2,
        width: 60,
        borderRadius: 4
    },
})
