import React, { Component } from 'react'
import { Text, ListItem, Thumbnail, Left, Right, Body } from 'native-base'
import { View, StyleSheet, Picker, FlatList, ActivityIndicator, ToastAndroid, BackHandler } from 'react-native'
import { Actions } from 'react-native-router-flux'
import axios from 'axios'
import accountStore from '../../stores/Account';


export default class Vacancies extends Component {

    constructor() {
        super()
        this.state = {
            careers: [],
            isLoading: true,
            error: false
        }
        this.baseState = this.state
    }

    componentDidMount() {
        this.fetchAllCareers()
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

    fetchAllCareers = async () => {
        await axios({
            url: 'https://ypn-base-01.herokuapp.com/careers', 
            method: 'GET', 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${accountStore.user.token}`
            },
        })
        .then(res => {
            console.log(res.data.data)
            this.setState({careers: res.data.data, isLoading: false})
        })
        .catch(err => {
            this.setState({error: true, isLoading: false})
            ToastAndroid.show(err.response.data.error, ToastAndroid.SHORT)
        })
    }

    reset = () => {
        this.setState(this.baseState)
        this.fetchAllCareers()
    }

    render() {
        if (this.state.isLoading) {
            return (
              <View style={{flex: 1, justifyContent: 'center'}}>
                <ActivityIndicator size="large" color="#82BE30"/>
              </View>
            );
          }
          else if (this.state.error) {
            return (
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#444'}}>Could not load Careers :(</Text>
                <Text></Text>
                <Text></Text>
                <Button style={{backgroundColor: '#82BE30', alignSelf: 'center'}}onPress={() => {this.reset()}}>
                    <Text>Retry</Text>
                </Button>
              </View>
              
            )
        }
        else if (this.state.careers.length == 0) {
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: '#444'}}>There are no Careers to display</Text>
                    <Text></Text>
                    <Text></Text>
                    <Button style={{backgroundColor: '#82BE30', alignSelf: 'center', marginTop: 5}}onPress={() => {this.reset()}}>
                        <Text>refresh</Text>
                    </Button>
              </View>
            )
        }
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
                <View style={{paddingBottom: 100}}>
                    <FlatList
                        legacyImplementation
                        initialNumToRender={10}
                        data={this.state.careers}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item}) =>
                        <View style={styles.listContainer}>
                            <ListItem avatar style={{paddingVertical: 15, marginLeft: 10}} onPress={() => Actions.vacancy({item})}>
                                <Left>
                                    {this.userProfile(item.origin.avatar)}
                                </Left>
                                <Body style={{borderBottomWidth: 0}}>
                                    <Text>{item.origin}</Text>
                                    <Text style={{color: '#82BE30'}}>{item.role}</Text>
                                </Body>
                                <Right style={{borderBottomWidth: 0}}>
                                    <Text note>{item.meta.location}</Text>
                                </Right>
                            </ListItem>
                        </View>
                        }
                        keyExtractor={item => item.id.toString()}
                    />
                </View>
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