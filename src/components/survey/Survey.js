import React, { Component } from 'react'
import { Button, Icon, Text, Left, Body, Right, Header, Title, StyleProvider, Container, List, ListItem } from 'native-base'
import { View, StyleSheet, BackHandler, ScrollView, ActivityIndicator } from 'react-native'
import { Actions } from 'react-native-router-flux'
import accountStore from '../../stores/Account'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'
import axios from 'axios'
import Config from '../../config'

export default class Survey extends Component {

    state = {
        surveys: [],
        isLoading: true
    }

    componentDidMount() {
        this.fetchAllQuestions()
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }
    
    onBackPress () {
        Actions.pop()
        return true
    }
    
    fetchAllQuestions = async () =>  {
        await axios({
            url: `${Config.postUrl}/questions?type=1`, 
            method: 'GET', 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${accountStore.user.token}`
            },
        }).then(res => {
            this.setState({surveys: res.data.data.filter(item => item.meta.type == "Opinion"), isLoading: false})
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
        const surveys = this.state.surveys.map(survey => {
            return (
                <View key = {survey._id} style={{paddingTop: 20}}>
                    <ListItem style={{ marginLeft: 0 }} onPress={() => Actions.selectChoice({data: survey})}>
                        <Body>
                            <Text style={{fontSize: 18, fontWeight: 'bold', color: '#444'}}>{survey.title}</Text>
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
                            <Title>Survey</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <View style={styles.container}>
                       <Text style={styles.electionHeading}>Surveys</Text>
                    </View>
                    <ScrollView>
                        <List style={{width: '90%', alignSelf: 'center'}}>
                            {surveys}
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