import React, { Component } from 'react'
import { Button, Icon, Text, Left, Body, Right, Header, Title, StyleProvider, Container } from 'native-base'
import { View, StyleSheet, BackHandler } from 'react-native'
import { Actions } from 'react-native-router-flux'
import getTheme from '../../native-base-theme/components'
import material from '../../native-base-theme/variables/material'
import ConstitutionText from '../modules/ConstitutionText'

export default class Constitution extends Component {

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
    render() {
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
                            <Title>Constitution</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <View style={styles.container}>
                           <Text>
                               
                               
                           </Text>
                    </View>
                </Container>
            </StyleProvider>
        )
    }
}
const styles = StyleSheet.create({
   container: {
       flex: 1
   }
})