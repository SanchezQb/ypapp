import React, { Component } from 'react'
import { 
    StyleProvider, 
    Header, 
    Left, 
    Body, 
    Right, 
    Button, 
    Icon, Title, Thumbnail, Text } from 'native-base';
import { StyleSheet, View, ScrollView } from 'react-native'
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import { Actions } from 'react-native-router-flux'

export default class CandidateProfile extends Component {

    renderLocation = () => {
        const loc = this.props.data
        if(loc.value.level == 'Federal') {
            return <Text style={{color: '#82BE30', fontSize: 18, textAlign: 'center'}}>Federal</Text>
        }
        else if(loc.value.level == 'state') {
            return (
                <Text style={{color: '#82BE30', fontSize: 18, textAlign: 'center'}}>{loc.value.state} State</Text>
            )
        }
        else {
            return (
                <React.Fragment>
                     <Text style={{color: '#82BE30', fontSize: 18, textAlign: 'center'}}>{loc.value.local} LGA</Text>
                    <Text style={{color: '#82BE30', fontSize: 18, textAlign: 'center'}}>{loc.value.state} State</Text>
                </React.Fragment>
            )
        }
    }

    

    render() {
        const item = this.props.data
        return (
            <StyleProvider style={getTheme(material)}>
                <View>
                    <Header>
                        <Left>
                            <Button transparent onPress={() => Actions.pop()}>
                                <Icon name="arrow-back" style={{color: '#fff'}}/>
                            </Button>
                        </Left>
                        <Body>
                            <Title>{item.value.firstname} {item.value.lastname}</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <ScrollView>
                        <View style={styles.view}>
                            <View>
                                {item.value.avatar ? 
                                    <Thumbnail large source={item.value.avatar} resizeMode="center" style={{alignSelf: 'center'}} />
                                :
                                    <Thumbnail large source={require('../logo.png')} resizeMode="center" style={{alignSelf: 'center'}} />
                                }
                                <Text style={{color: '#777', fontSize: 18, textAlign: 'center', marginTop: 10}}>{item.position}</Text>
                                {this.renderLocation()}
                            </View>
                        </View>
                        <View style={{width: '93%', alignSelf: 'center', marginTop: 30}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', color: '#555', marginVertical: 10}}>{item.value.firstname} {item.value.lastname}'s Bio:</Text>
                            <Text style={{fontSize: 16, color: '#555'}}>
                           {item.value.bio}
                            </Text>
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
       width: '93%',
       alignSelf: 'center'
    },
    buttonContainer: {
        width: '93%',
        alignSelf: 'center',
        marginTop: 70
    },
    button: {
        backgroundColor: '#82BE30',
    },
})

