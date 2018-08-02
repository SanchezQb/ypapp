import React, { Component } from 'react'
import { 
    StyleProvider, 
    Header, 
    Left, 
    Body, 
    Right, 
    Button, 
    Icon, Title, Text } from 'native-base';
import { StyleSheet, View, ScrollView, BackHandler } from 'react-native'
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Actions } from 'react-native-router-flux'


export default class DonationDetail extends Component {
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
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
            <View style={{flexDirection: 'row'}}>
                <Text style={{textDecorationLine: 'line-through'}}>N</Text>
                <Text>{pattern}</Text>
            </View>
        )
    }
    render() {
        const fill = Math.round((this.props.data.amount / this.props.data.target) * 100)
        return (
            <StyleProvider style={getTheme(material)}>
                <View style={{flex: 1}}>
                    <Header>
                        <Left>
                            <Button transparent onPress={() => Actions.pop()}>
                                <Icon name="arrow-back" style={{color: '#fff'}}/>
                            </Button>
                        </Left>
                        <Body>
                            <Title>{this.props.data.title}</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <ScrollView>
                        <View>
                            <View>
                                <View style={styles.meter}>
                                    <AnimatedCircularProgress
                                        size={160}
                                        width={10}
                                        fill={fill}
                                        tintColor="#82BE30"
                                        backgroundColor="#F0BA00">
                                        {
                                            (fill) => (
                                            <Text style={styles.gaugeText}>
                                                { `${Math.ceil(fill)}%` }
                                            </Text>
                                            )
                                        }
                                    </AnimatedCircularProgress>
                                </View>
                            </View>
                            <View style={styles.amountDetails}>
                                <View style={styles.box1}></View>
                                <Text>Amount Donated: </Text>
                                {this.renderTarget(this.props.data.amount)}
                            </View>
                            <View style={styles.amountDetails}>
                                <View style={styles.box2}></View>
                                <Text>Target: </Text>
                                {this.renderTarget(this.props.data.target)}
                            </View>
                            <View style={{width: '85%', alignSelf: 'center', marginTop: 30}}>
                                <Text style={{fontSize: 18, fontWeight: 'bold', color: '#555', marginVertical: 10}}>Description</Text>
                                <Text style={{fontSize: 16, color: '#555'}}>
                                    {this.props.data.description}
                                </Text>
                            </View>
                            <View style={styles.buttonContainer}>
                                <Button style={styles.button} onPress={() => Actions.donate({data: this.props.data._id})} block>
                                    <Text>donate now</Text>
                                </Button>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </StyleProvider>
        )
    }
}
const styles = StyleSheet.create({
    view: {
       marginTop: 30,
       borderColor: '#ccc',
       borderBottomWidth: 1,
       paddingBottom: 20,
       width: '85%',
       alignSelf: 'center'
    },
    buttonContainer: {
        width: '85%',
        alignSelf: 'center',
        marginTop: 70,
        marginBottom: 30
    },
    button: {
        backgroundColor: '#82BE30',
    },
    amountDetails: {
        flexDirection: 'row'
    },
    box1: {
        width: 20,
        height: 20,
        backgroundColor: '#82BE30',
        marginRight: 7
    },
    box2: {
        width: 20,
        height: 20,
        backgroundColor: '#F0BA00',
        marginRight: 7
    },
    meter: {
        flex: 1,  
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 70,
        marginBottom: 30 
    },
    gaugeText: {
        fontSize: 25,
        color: '#82BE30'
    },
    amountDetails: {
        width: '85%',
        alignSelf: 'center',
        flexDirection: 'row',
        marginVertical: 5,
        alignItems: 'center'
    }

})

