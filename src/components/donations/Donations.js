import React, { Component } from 'react'
import { StyleProvider, Header, Left, Body, Right, Button, Icon, Title, Text, Container } from 'native-base';
import { View, StyleSheet, BackHandler, ScrollView } from 'react-native'
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import { Actions } from 'react-native-router-flux'
import { observer } from 'mobx-react/native'
import RadioForm from 'react-native-simple-radio-button';

const level_props = [
    {label: 'Federal', value: 'Federal' },
    {label: 'State', value: 'State' },
    {label: 'Local', value: 'Local' }
  ];
const type_props = [
    {label: 'Party', value: 1 },
    {label: 'Candidate', value: 2 },
    {label: 'Project', value: 3 }
  ];

@observer
export default class Donations extends Component {
    state = {
        type: 1,
        level: 'Federal'
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress () {
        Actions.pop()
        return true;
    }

    pushToState = (value) => {
        if(value == 'State') {
            this.setState({level: 'State'})
        }
        else if(value == 'Federal') {
            this.setState({level: 'Federal'})
        }
        else if(value == 'Local') {
            this.setState({level: 'Local'})
        }
        else if(value == 3) {
            this.setState({type: value})
        }
        else if(value == 2) {
            this.setState({type: value})
        }
        else if(value == 1) {
            this.setState({ type: value})
        }

    }

    pushToListing = () => {
        Actions.donationListing({data: this.state})
    }

    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <Header>
                        <Left>
                            <Button transparent onPress={() => Actions.pop()}>
                                <Icon name="arrow-back" style={{color: '#fff'}}/>
                            </Button>
                        </Left>
                        <Body>
                            <Title>Donations</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <ScrollView>
                        <View style={{marginVertical: 30}}>
                            <Text style={styles.categoryText}>Select your donation type</Text>
                        </View>
                        <View style={styles.level}>
                            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#777'}}>Select Level</Text>
                            <RadioForm
                                radio_props={level_props}
                                initial={0}
                                buttonSize={15}
                                buttonColor={'#82BE30'}
                                animation={false}
                                selectedButtonColor={'#82BE30'}
                                style={{alignItems: 'flex-start', marginTop: 20}}
                                onPress={(value) => this.pushToState(value)}
                                />
                        </View>
                        <View style={styles.level}>
                            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#777'}}>Select Category</Text>
                            <RadioForm
                                radio_props={type_props}
                                initial={0}
                                buttonSize={15}
                                buttonColor={'#82BE30'}
                                animation={false}
                                selectedButtonColor={'#82BE30'}
                                style={{alignItems: 'flex-start', marginTop: 20}}
                                onPress={(value) => this.pushToState(value)}
                                />
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button onPress={() => this.pushToListing()} block>
                                <Text>Donate</Text>
                            </Button>
                        </View>
                    </ScrollView>
                </Container>
            </StyleProvider>
        )
    }
}

const styles = StyleSheet.create({
    categoryText: {
        color: '#777', 
        fontSize: 21, 
        fontWeight: 'bold', 
        textAlign: 'center'
    },
    level: {
        marginTop: 10,
        width: '85%',
        alignSelf: 'center'
    },
    listitem: {
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    amountInput: {
        borderColor: '#ccc',
        borderWidth: 1,
        width: '70%',
        marginTop: 20,
        paddingVertical: 0,
        height: 45,
        borderLeftWidth: 0
    },
    buttonContainer: {
        width: '85%',
        alignSelf: 'center',
        marginTop: 30
    }
})