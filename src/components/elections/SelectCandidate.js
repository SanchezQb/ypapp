import React, { Component } from 'react'
import { Button, Icon, Text, Left, Body, Right, Header, Title, StyleProvider, Container, ListItem, Thumbnail } from 'native-base'
import { View, StyleSheet, BackHandler, ScrollView, Dimensions, Alert, ToastAndroid } from 'react-native'
import { Actions } from 'react-native-router-flux'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'
import accountStore from '../../stores/Account'
import axios from 'axios'

const { height } = Dimensions.get('window')

export default class SelectCandidate extends Component {

    state = {
        disabled: false,
        target: null,
        id: this.props.data._id
    }

    componentDidMount() {
        this.generateReasonsAndResponses();
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress () {
        Actions.pop()
        return true
    }
    selectCandidate = (target) => {
        if(this.state.target == null) {
            return ToastAndroid.show('Please select a candidate', ToastAndroid.SHORT)
        }

        Alert.alert(
            `Confirm Selection | Vote for ${target}`,
            `Are you sure you want to vote for ${target}?`,
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'CANCEL'},
              {text: 'YES', onPress: () => this.voteHandler(this.state)},
            ],
            { cancelable: false }
          )
    }
    generateReasonsAndResponses = () => {
        let ref = {};
        Object.keys(this.props.data.questions).forEach(q => {
          ref[`${q}`] = ''
        })
        const responses = [ref];
        this.setState({ responses, reasons: responses });
        // the state should look like this;
        // { id: 65755859993, reasons: [ { 0: '}], responses: [{ 0: '' }]}
    
      }
      handleSelect = target => {
        let ref = {}
        this.setState({ target })
        ref['0'] = target
        const response = [ref]
        this.setState({ responses: response })
      }
      voteHandler = (data) => {
        this.setState({disabled: true})
        axios({
            url: `https://ypn-node-service.herokuapp.com/api/v1/questions/respond`, 
            method: 'PUT', 
            data,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${accountStore.user.token}`
            },
        }).then(res => {
            this.setState({disabled: false})
            console.log(res)
            Actions.voteDone({data: this.state.target})
        })
        .catch(error => {
            this.setState({disabled: false})
            console.log(error.response.data)
            this.results()
            ToastAndroid.show(error.response.data.error, ToastAndroid.SHORT)
        })
    }
    results = () => {
        axios({
            url: `https://ypn-node-service.herokuapp.com/api/v1/questions/${this.state.id}`, 
            method: 'GET', 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${accountStore.user.token}`
            },
        }).then(res => console.log(res))
    }

    render() {
        console.log(this.state)
        const candidates = this.props.data.meta.candidates.map((candidate, i) => {
            return (
                <ListItem
                    key={i} 
                    avatar 
                    style={{paddingVertical: 15}}
                    onPress={() => this.handleSelect(candidate.name)}>
                    <Left>
                        {candidate.avatar ? <Thumbnail source={{uri: candidate.avatar}}/> : <Thumbnail source={require('../avatar.jpg')} />}
                    </Left>
                    <Body>
                        <Text style={{color: '#444', fontWeight: 'bold'}}>
                            {candidate.name}
                        </Text>
                        <Text style={{color: '#82Be30'}}>Click to select</Text>
                    </Body>
                    <Right>
                        {this.state.target === candidate.name ? <Icon name="ios-checkmark-circle" style={{color: '#82BE30', fontSize: 24}} /> : null}
                    </Right>
                </ListItem>
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
                       <Text style={styles.electionHeading}>Select your desired candidate</Text>
                    </View>
                    <View style={{height: height * 0.72}}>
                        <ScrollView>
                            {candidates}
                        </ScrollView>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button disabled={this.state.disabled} onPress={() => this.selectCandidate(this.state.target)} block>
                            <Text>Vote</Text>
                        </Button>
                    </View>
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