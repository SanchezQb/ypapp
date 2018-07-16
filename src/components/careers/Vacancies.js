import React, { Component } from 'react'
import { List, Text, ListItem, Thumbnail, Left, Right, Body } from 'native-base'
import { View, ScrollView, StyleSheet, Picker } from 'react-native'
import { Actions } from 'react-native-router-flux'


export default class Vacancies extends Component {
    render() {
        return (
            <View>
                <View style={styles.pickerContainer}>
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
                        <View style={styles.listContainer}>
                            <ListItem avatar style={{paddingVertical: 15, marginLeft: 10}} onPress={() => Actions.vacancy()}>
                                <Left>
                                    <Thumbnail source={require('../profile.png')} />
                                </Left>
                                <Body style={{borderBottomWidth: 0}}>
                                    <Text>Youth Party</Text>
                                    <Text style={{color: '#82BE30'}}>Personal Assistant</Text>
                                </Body>
                                <Right style={{borderBottomWidth: 0}}>
                                    <Text note>Maitama, Abuja</Text>
                                </Right>
                            </ListItem>
                        </View>
                        <View style={styles.listContainer}>
                            <ListItem avatar style={{paddingVertical: 15, marginLeft: 10}} onPress={() => Actions.vacancy()}>
                                <Left>
                                    <Thumbnail source={require('../profile.png')} />
                                </Left>
                                <Body style={{borderBottomWidth: 0}}>
                                    <Text>Youth Party</Text>
                                    <Text style={{color: '#82BE30'}}>Personal Assistant</Text>
                                </Body>
                                <Right style={{borderBottomWidth: 0}}>
                                    <Text note>Maitama, Abuja</Text>
                                </Right>
                            </ListItem>
                        </View>
                        <View style={styles.listContainer}>
                            <ListItem avatar style={{paddingVertical: 15, marginLeft: 10}} onPress={() => Actions.vacancy()}>
                                <Left>
                                    <Thumbnail source={require('../profile.png')} />
                                </Left>
                                <Body style={{borderBottomWidth: 0}}>
                                    <Text>Youth Party</Text>
                                    <Text style={{color: '#82BE30'}}>Personal Assistant</Text>
                                </Body>
                                <Right style={{borderBottomWidth: 0}}>
                                    <Text note>Maitama, Abuja</Text>
                                </Right>
                            </ListItem>
                        </View>
                    </List>
                </ScrollView>
            </View>   
        )
    }
}
const styles= StyleSheet.create({
    picker: {
        color: '#82BE30', 
        width: '30%', 
        marginLeft: 25
    },
    listContainer: {
        borderBottomWidth: 1,
        borderColor: '#ddd',
        width: '95%',
        alignSelf: 'center'
    }

})