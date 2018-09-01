import React, { Component } from 'react'
import { Button, Icon, Text, Left, Body, Right, Header, Title, StyleProvider, Container } from 'native-base'
import { View, StyleSheet, BackHandler, ScrollView, Dimensions, ToastAndroid } from 'react-native'
import { Actions } from 'react-native-router-flux'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'
import accountStore from '../../stores/Account'
import axios from 'axios'
import { DisplayRadios } from './Mixins'

const { height, width } = Dimensions.get('window')


export default class SelectChoice extends Component {
    constructor(props) {
        super(props)
        this.state = {
            disabled: false,
            target: null,
            responses: {},
            reasons: [],
        }
        
    }

    componentWillMount() {
        console.log(this.props.data.options)
        if(this.props.data.responses.map(item => item.user.id).includes(accountStore.user.id)) return this.generateResults(this.props.data.options)();
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

    generateReasons = () => Object.keys(this.props.data.questions).map((key) => {
        const ref = {};
        ref[`${key}`] = '';
        this.state.reasons.push(ref)
    })

    

    renderCard = (q, i, o) => {
        return (
            <View key={i}>
                <Text style={{fontSize: 18, color: '#444',textAlign: 'center', fontWeight: 'bold', marginVertical: '5%'}}>{q}</Text>
                { !this.state.wantsToSeeResult && <DisplayRadios values={o} pushToState={value => this.pushUpValue(i)(value) } style={{ padding: 15, marginVertical: 20 }}/> }
                { this.state.wantsToSeeResult && this.renderResults(this.state.heatMap[`${i}`]) }
            </View>
        )
    }

    renderResults = (data) => {
        const RenderItemCard = ({ dataX }) => (
            <View style={{
              width: width * 0.8,
              height: 30,
              alignSelf: 'center',
              position: 'relative',
              paddingLeft: 10,
              marginBottom: 18,
              backgroundColor: '#E5E7E9',
              borderRadius: 2
            }}>
            <View style={{
              height: 30,
              width: dataX.width + 5,
              backgroundColor: '#82BE30',
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 15,
              borderRadius: 2
            }} />
            <Text style={{ fontSize: 14, color: '#585959', fontWeight: '600', position: 'relative', bottom: -5 }}>{` ${dataX.title} ${Math.floor(dataX.valueInPercentage)}% ` }</Text>
            </View>
      );
      return (
        <View style={{ maxHeight: height * 0.3, width, justifyContent: 'space-evenly', paddingBottom: 15 }}> 
            { data.map((item, i) => <RenderItemCard key={i} dataX={item} />)}
        </View>
  );
    }

    handleSubmit = () => {
        const { data } = this.props;
        const keys = Object.keys(this.state.responses);
        const status = Object.keys(data.questions).reduce((a, b) => {
          if (keys.includes(`${b}`)) {
            a = true;
          } else {
            a = false;
          }
          return a;
        }, false);
        if (!status) return ToastAndroid.show('Please complete the poll', ToastAndroid.SHORT)
        const { responsesX, reasons } = this.state;
       
        const dataX = { id: this.props.data._id, responses: responsesX, reasons };
        this.voteHandler(dataX) 
          
    }
    voteHandler = (data) => {
        this.setState({disabled: true})
        axios({
            url: `https://ypn-node.herokuapp.com/api/v1/questions/respond`, 
            method: 'PUT', 
            data,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${accountStore.user.token}`
            },
        }).then(res => {
            this.setState({disabled: false})
            this.generateResults(res.data.data.options)(options => this.setState({ heatMap: options, wantsToSeeResult: true }))
        })
        .catch(error => {
            this.setState({disabled: false})
            console.log(error.response.data)
            ToastAndroid.show("You cannot participate in this poll", ToastAndroid.SHORT)
        })
    }

    generateResults = optionsX => (callback) => {
        const options = { ...optionsX };
        const transformOptions = (obj) => {
          // total number of responses for the question
          const total = Object.values(obj).reduce((a, b) => a + b);
          return Object.keys(obj).map((key) => {
            const standardWidth = width * 0.8;
            const value = parseInt(obj[`${key}`]) / total;
            const trueWidth = standardWidth * value;
            return {
              title: key,
              width: trueWidth,
              valueInPercentage: value * 100
            };
          });
        };
        Object.keys(options).forEach((key) => {
          options[`${key}`] = transformOptions(options[`${key}`]);
        });
        if(callback) return callback(options);
        this.setState({wantsToSeeResult: true, heatMap: options})
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
                    <View style={{flex: 1}}>
                        <ScrollView>
                            <Text style={styles.electionHeading}>{this.props.data.title}</Text>
                            {this.questions()}
                            <Title></Title>   
                        </ScrollView>
                    </View>
                    <View style={styles.buttonContainer}>
                    {this.props.data.responses.map(item => item.user.id).includes(accountStore.user.id)?
                        <Text style={{color: '#444', textAlign: 'center'}}>You participated in this poll</Text>
                        :
                        <Button disabled={this.state.disabled} onPress={() => this.handleSubmit()} block>
                            <Text>Submit</Text>
                        </Button>
                    }
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