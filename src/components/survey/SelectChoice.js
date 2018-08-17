import React, { Component } from 'react'
import { Button, Icon, Text, Left, Body, Right, Header, Title, StyleProvider, Container, ListItem } from 'native-base'
import { View, StyleSheet, BackHandler, ScrollView, Dimensions, Alert, ToastAndroid, ActivityIndicator } from 'react-native'
import { Actions } from 'react-native-router-flux'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'
import accountStore from '../../stores/Account'
import axios from 'axios'
import Swiper from 'react-native-swiper'
import { DisplayRadios } from './Mixins'

const { height } = Dimensions.get('window')


export default class SelectChoice extends Component {
    constructor() {
        super()
        this.state = {
            disabled: false,
            target: null,
            responses: {},
        }
    }

    componentDidMount() {
        this.generateReasons()
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress () {
        Actions.pop()
        return true
    }
    questions = () => Object.values(this.props.data.questions).map((question, index) => this.renderCard(question, index, Object.keys(this.props.data.options[`${index}`])));

    // generateReasons = () => Object.keys(this.props.data.questions).forEach((key) => {
    //     const reasons = []
    //     const ref = {};
    //     ref[`${key}`] = '';
    //     reasons = [...ref]
    //    console.log(reasons)
    // })
    generateReasons = () => {
        let ref = {};
        let reasons = []
        Object.keys(this.props.data.questions).forEach(q => {
          ref[`${q}`] = ''
        })
        reasons.push(ref)
        console.log(reasons)
        this.setState({ reasons });
        // the state should look like this;
        // { id: 65755859993, reasons: [ { 0: '}], responses: [{ 0: '' }]}
    
      }

    renderCard = (q, i, o) => {
        return (
            <View key={i}>
                <Text style={{fontSize: 18, color: '#444',textAlign: 'center', fontWeight: 'bold', marginVertical: '5%'}}>{q}</Text>
                <DisplayRadios values={o} pushToState={value => this.pushUpValue(i)(value) } style={{ padding: 15, marginVertical: 20 }}/>
            </View>
        )
    }

    handleSelect = target => {
        let ref = {}
        this.setState({ target })
        ref['0'] = target
        const response = [ref]
        console.log(response)
        this.setState({ responses: response })
    }
    pushUpValue = index => value => {
        this.state.responses[`${index}`] = value;
        const responsesX = Object.keys(this.state.responses).map((key) => {
            const ref = {};
            ref[`${key}`] = this.state.responses[`${key}`];
            return ref;
          }); 
         this.setState({responsesX})
    }
    render() {
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
                            <Title>Survey</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <View style={styles.container}>
                       <Text style={styles.electionHeading}>{this.props.data.title}</Text>
                    </View>
                    {this.questions()}
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
    },
    buttonContainer: {
        alignSelf: 'center',
        width: '85%',
        position: 'absolute',
        bottom: 15
    },
})