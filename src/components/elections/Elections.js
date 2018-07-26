import React, { Component } from 'react'
import { Button, Icon, Text, Left, Body, Right, Header, Title, StyleProvider, Container, List, ListItem } from 'native-base'
import { View, StyleSheet, BackHandler, ScrollView, ActivityIndicator } from 'react-native'
import { Actions } from 'react-native-router-flux'
import accountStore from '../../stores/Account'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'
import axios from 'axios'

export default class Elections extends Component {

    state = {
        elections: [],
        isLoading: true
    }

    componentDidMount() {
        this.fetchAllCandidates()
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }
    
    onBackPress () {
        Actions.pop()
        return true
    }
    fetchAllCandidates = async () =>  {
        await axios({
            url: `https://ypn-node-service.herokuapp.com/api/v1/questions`, 
            method: 'GET', 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${accountStore.user.token}`
            },
        }).then(res => {
            this.setState({elections: res.data.data, isLoading: false})
           console.log(this.state)
        })
        .catch(error => {
            ToastAndroid.show(error.response.data.error, ToastAndroid.SHORT)
        })
    }
    render() {
        if (this.state.isLoading) {
            return (
              <View style={{flex: 1, justifyContent: 'center'}}>
                <ActivityIndicator size="large" color="#82BE30"/>
              </View>
            );
          }
        const elections = this.state.elections.map(election => {
            return (
                <View key = {election._id} style={{paddingTop: 20}}>
                    <ListItem style={{ marginLeft: 0 }} onPress={() => Actions.selectCandidate({data: election})}>
                        <Body>
                            <Text style={{fontSize: 18, fontWeight: 'bold', color: '#444'}}>{election.title}</Text>
                            <Text note>Click to see all {election.title}</Text>
                        </Body>
                        <Right>
                        </Right>
                    </ListItem>
                </View>
            )
        })
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
                            <Title>Elections</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <View style={styles.container}>
                       <Text style={styles.electionHeading}>Primary Elections</Text>
                    </View>
                    <ScrollView>
                        <List style={{width: '90%', alignSelf: 'center'}}>
                            {elections}
                        </List>
                    </ScrollView>
                </Container>
            </StyleProvider>
        )
    }
}
const styles = StyleSheet.create({
    electionHeading: {
        fontSize: 20,
        textAlign: 'center',
        color: '#777',
        marginVertical: 20,
        fontWeight: 'bold'
    }
   
})