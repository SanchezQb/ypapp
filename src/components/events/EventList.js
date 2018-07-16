import React, { Component } from 'react'
import { 
    Left, 
    Body, 
    Right, 
    List, ListItem, Thumbnail, Text
} from 'native-base';
import { StyleSheet, TouchableOpacity, View, ScrollView, Picker } from 'react-native'
import { Actions } from 'react-native-router-flux'


export default class EventList extends Component {
    
    render() {
        return (
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
                            <ListItem avatar style={{paddingVertical: 20, marginLeft: 15}} onPress={() => Actions.event()}>
                                <Left>
                                    <Thumbnail source={require('../profile.png')} />
                                </Left>
                                <Body style={{borderBottomWidth: 0}}>
                                    <Text>Capacity Building Workshop</Text>
                                    <Text note>30th of June, 2018</Text>
                                </Body>
                                <Right style={{borderBottomWidth: 0, marginRight: 0}}>
                                    <TouchableOpacity style={styles.touchable}>
                                        <Text style={{color: '#fff', textAlign: 'center'}}>View</Text>
                                    </TouchableOpacity>
                                    <View style={{width: 60}}>
                                        <Text note style={{textAlign: 'center', marginTop: 7}} note>3:00pm</Text>
                                    </View>
                                </Right>
                            </ListItem>
                        </View>
                        <View style={styles.listitem}>
                            <ListItem avatar style={{paddingVertical: 20, marginLeft: 15}} onPress={() => console.log("Pressed")}>
                                <Left>
                                    <Thumbnail source={require('../profile.png')} />
                                </Left>
                                <Body style={{borderBottomWidth: 0}}>
                                    <Text>Capacity Building Workshop</Text>
                                    <Text note>30th of June, 2018</Text>
                                </Body>
                                <Right style={{borderBottomWidth: 0, marginRight: 0}}>
                                    <TouchableOpacity style={styles.touchable}>
                                        <Text style={{color: '#fff', textAlign: 'center'}}>View</Text>
                                    </TouchableOpacity>
                                    <View style={{width: 60}}>
                                        <Text note style={{textAlign: 'center', marginTop: 7}} note>3:00pm</Text>
                                    </View>
                                </Right>
                            </ListItem>
                        </View>
                        <View style={styles.listitem}>
                            <ListItem avatar style={{paddingVertical: 20, marginLeft: 15}} onPress={() => console.log("Pressed")}>
                                <Left>
                                    <Thumbnail source={require('../profile.png')} />
                                </Left>
                                <Body style={{borderBottomWidth: 0}}>
                                    <Text>Capacity Building Workshop</Text>
                                    <Text note>30th of June, 2018</Text>
                                </Body>
                                <Right style={{borderBottomWidth: 0, marginRight: 0}}>
                                    <TouchableOpacity style={styles.touchable}>
                                        <Text style={{color: '#fff', textAlign: 'center'}}>View</Text>
                                    </TouchableOpacity>
                                    <View style={{width: 60}}>
                                        <Text note style={{textAlign: 'center', marginTop: 7}} note>3:00pm</Text>
                                    </View>
                                </Right>
                            </ListItem>
                        </View>
                    </List>
                </ScrollView>
            </View>   
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