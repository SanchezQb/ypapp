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
import { StyleSheet, TouchableOpacity, View, ScrollView, Picker } from 'react-native'
import { Actions } from 'react-native-router-flux'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'

export default class ElectedOfficials extends Component {
    
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
                            <Title>Elected Officials</Title>
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
                    <View>
                        <Picker
                            style={styles.picker}
                            mode='dropdown'>
                            <Picker.Item label="Federal" value="federal" />
                            <Picker.Item label="State" />
                            <Picker.Item label="Local" />
                        </Picker>
                    </View>
                    <ScrollView>
                        <List>
                            <View style={styles.listitem}>
                                <ListItem avatar style={{paddingVertical: 15, marginLeft: 15}} onPress={() => console.log("Pressed")}>
                                    <Left>
                                        <Thumbnail source={require('../logo.png')} />
                                    </Left>
                                    <Body style={{borderBottomWidth: 0}}>
                                        <Text>Hasstrup Ezekiel</Text>
                                        <Text style={{color: '#82BE30'}}>House of Rep.</Text>
                                    </Body>
                                    <Right style={{borderBottomWidth: 0, marginRight: 0}}>
                                        <TouchableOpacity style={styles.touchable}>
                                            <Text style={{color: '#fff', textAlign: 'center'}}>View</Text>
                                        </TouchableOpacity>
                                        <View style={{width: 60, marginTop: 10}}>
                                            <Text note>Ikwere, Rivers State</Text>
                                        </View>
                                    </Right>
                                </ListItem>
                            </View>
                            <View style={styles.listitem}>
                                <ListItem avatar style={{paddingVertical: 15, marginLeft: 15}} onPress={() => console.log("Pressed")}>
                                    <Left>
                                        <Thumbnail source={require('../logo.png')} />
                                    </Left>
                                    <Body style={{borderBottomWidth: 0}}>
                                        <Text>Hasstrup Ezekiel</Text>
                                        <Text style={{color: '#82BE30'}}>House of Rep.</Text>
                                    </Body>
                                    <Right style={{borderBottomWidth: 0, marginRight: 0}}>
                                        <TouchableOpacity style={styles.touchable}>
                                            <Text style={{color: '#fff', textAlign: 'center'}}>View</Text>
                                        </TouchableOpacity>
                                        <View style={{width: 60, marginTop: 10}}>
                                            <Text note>Ikwere, Rivers State</Text>
                                        </View>
                                    </Right>
                                </ListItem>
                            </View>
                            <View style={styles.listitem}>
                                <ListItem avatar style={{paddingVertical: 15, marginLeft: 15}} onPress={() => console.log("Pressed")}>
                                    <Left>
                                        <Thumbnail source={require('../logo.png')} />
                                    </Left>
                                    <Body style={{borderBottomWidth: 0}}>
                                        <Text>Hasstrup Ezekiel</Text>
                                        <Text style={{color: '#82BE30'}}>House of Rep.</Text>
                                    </Body>
                                    <Right style={{borderBottomWidth: 0, marginRight: 0}}>
                                        <TouchableOpacity style={styles.touchable}>
                                            <Text style={{color: '#fff', textAlign: 'center'}}>View</Text>
                                        </TouchableOpacity>
                                        <View style={{width: 60, marginTop: 10}}>
                                            <Text note>Ikwere, Rivers State</Text>
                                        </View>
                                    </Right>
                                </ListItem>
                            </View>
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