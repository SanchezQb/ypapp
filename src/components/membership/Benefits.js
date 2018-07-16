import React, { Component } from 'react'
import { 
    StyleProvider,   
    Body,  
    Header,
    Button, 
    Title, 
    Left, Right, Icon,Text, View
} from 'native-base';
import { 
    StyleSheet, 
    StatusBar, 
    BackHandler,
    ScrollView
} from 'react-native'
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import { Actions } from 'react-native-router-flux'
import CardDots from '../../modules/CardDots'

export default class Benefits extends Component {

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

    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <React.Fragment>
                    <StatusBar
                        backgroundColor="#82BE30"
                    />
                    <Header noShadow>
                        <Left>
                            <Button transparent onPress={() => Actions.pop()}>
                                <Icon name="arrow-back" style={{color: '#fff'}}/>
                            </Button>
                        </Left>
                        <Body>
                            <Title>Membership</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <View style={styles.span}>
                        <Text style={{marginHorizontal: 50, marginTop: 20, textAlign: 'center', color: '#fff', fontSize: 18}}>
                            Being a member gives you access to the highlighted features
                        </Text>
                    </View>
                        <ScrollView style={{paddingBottom: 10}}>
                        <View style={styles.card}>
                            <Text style={{marginLeft: 20, marginTop: 20, color: '#82BE30', fontSize: 24}}>N600</Text>
                            <Text style={{marginLeft: 20, fontSize: 18, color: '#fff'}}>For 3 months</Text>
                            <View>
                                <CardDots />
                            </View>
                        </View>
                        <View style={{width: 320, alignSelf: 'center'}}>
                            <Text style={{marginTop: 10, fontSize: 16, color: '#444'}}>
                                {'\u2022'} Contribute to posts and comments
                            </Text>
                            <Text style={{marginTop: 10, fontSize: 16, color: '#444'}}>
                                {'\u2022'} Participate in debates and townhall meetings
                            </Text>
                            <Text style={{marginTop: 10, fontSize: 16, color: '#444'}}>
                                {'\u2022'} Participate in polls and elections
                            </Text>
                            <Text style={{marginTop: 10, fontSize: 16, color: '#444'}}>
                                {'\u2022'} Real-time active messaging with other members
                            </Text>
                        </View>
                        <Button block 
                            style={{backgroundColor: '#82BE30', marginTop: 20, width: 320, alignSelf: 'center'}}
                            onPress={() => Actions.subscribe()}>
                            <Text>Subscribe</Text>
                        </Button>
                  </ScrollView>
                </React.Fragment>
            </StyleProvider>
        )
    }
}
const styles = StyleSheet.create({
    span: {
        height: 90,
        backgroundColor: '#82BE30',    
    },
    buttonContainer: {
        width: '85%',
        alignSelf: 'center',
        marginTop: 30
    },
    button: {
        backgroundColor: '#82BE30',
    },
    card: {
        backgroundColor: '#5214A3',
        width: 320,
        height: 203,
        alignSelf: 'center',
        borderRadius: 7,
        marginVertical: 25
    }
})



