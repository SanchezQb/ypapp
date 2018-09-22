import React, { Component } from 'react'
import { Button, Icon, Text, Left, Body, Right, Header, Title, StyleProvider, Container } from 'native-base'
import { View, StyleSheet, BackHandler, ActivityIndicator } from 'react-native'
import { Actions } from 'react-native-router-flux'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import accountStore from '../../stores/Account'
import config from '../../config'
import axios from 'axios'

export default class Results extends Component {

    state = {
        isLoading: true,
        error: false,
        results:{},
        heatmap: []
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
        this.fetchResults()
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress () {
        Actions.pop()
        return true
    }
    renderTarget = (target) => {
        let pattern = target.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        return (
            <Text style={{fontSize: 16, textAlign: 'center'}}>{pattern} Votes</Text>
        )
    }
    fetchResults = async () => {
        await axios({
            url: `${config.postUrl}/questions/results/${this.props.data}`,
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${accountStore.user.token}`
            },
        })
        .then(res => {
            this.setState({results: res.data.data, isLoading: false})
        }).then(() => {
            const arr = []
            Object.keys(this.state.results[0].answers).forEach((key) => {
                const obj = {
                    name: key,
                    votes: this.state.results[0].answers[key]
                }
                arr.push(obj)
              });
            this.setState({heatmap: arr,})
        })
        .catch(err => {
            this.setState({isLoading: false, error: true})
            console.log(err.response)
            alert('An error occured while fetching results, please try again ')
        })
    }

    computeTotal= () => {
     const total = this.state.heatmap.reduce(function (a, b) {
        return {votes: a.votes + b.votes}; // returns object with property x
        })
        this.setState({total}) 
    }
    render() {
        if (this.state.isLoading) {
            return (
              <View style={{flex: 1, justifyContent: 'center'}}>
                <ActivityIndicator size="large" color="#82BE30"/>
              </View>
            );
          }
          else if(this.state.error) {
              return (
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text style={{textAlign: 'center'}}>There was a problem loading results, please try again</Text>
                  </View>
              )
          }
          console.log(this.state)
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
                            <Title>Results</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <View style={{}}>
                       <Text style={styles.electionHeading}>Results</Text>
                    </View>
                    <View style={styles.meter}>
                        {this.state.heatmap.map((item, i) => {
                            return (
                                <View key={i}>
                                    <View>
                                        <AnimatedCircularProgress
                                            size={140}
                                            width={10}
                                            fill={(item.votes / this.state.heatmap.reduce(function (a, b) {
                                                return a.votes + b.votes // returns object with property x
                                                })) * 100}
                                            tintColor="#82BE30"
                                            backgroundColor="#F0BA00">
                                        </AnimatedCircularProgress>
                                        <View style={{marginVertical: '5%'}}>
                                            <Text style={{fontSize: 18, textAlign: 'center'}}>{item.name}</Text>
                                            {this.renderTarget(item.votes)}
                                        </View>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                </Container>
            </StyleProvider>
        )
    }
}
const styles = StyleSheet.create({
    content: {
       marginVertical: 120,
       width: '60%',
       alignSelf: 'center'
    },
    icon: {
        fontSize: 60,
        color: '#82BE30',
        alignSelf: 'center'
    },
    button: {
        backgroundColor: '#82BE30',
        alignSelf: 'center'
    },
    buttonContainer: {
        width: '60%',
        alignSelf: 'center'
    },
    text: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginVertical: 40
    },
    text2: {
        textAlign: 'center',
        fontSize: 18,
        alignSelf: 'center',
        color: '#777'
    },
    meter: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',  
        justifyContent: 'space-around',
        marginVertical: '10%'
    },
    gaugeText: {
        fontSize: 25,
        color: '#82BE30'
    },
    electionHeading: {
        fontSize: 20,
        textAlign: 'center',
        color: '#777',
        marginVertical: 20,
        fontWeight: 'bold'
    },
})