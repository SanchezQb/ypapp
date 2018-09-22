import React, { Component } from 'react'
import { Button, Icon, Left, Body, Right, Header, Title, StyleProvider, Container } from 'native-base'
import { View, StyleSheet, BackHandler, Text, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'

export default class About extends Component {

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
                            <Title>About</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <View style={styles.container}>
                       <Text style={{fontSize: 18, color: '#444', marginBottom: 5}}>
                        The Youth Party is made up of individuals and groups that seek to serve and unite Nigerians.
                        Our goal is to develop and improve the standard of living of all Nigerians.
                       </Text>
                       <Text style={{fontSize: 18, color: '#444', marginBottom: 5}}>The Youth Party believes in service oriented political leadership</Text>
                    </View>
                    <View style={styles.docs}>
                        <TouchableOpacity style={{marginVertical: 5, paddingHorizontal: 20}} onPress={() => Actions.pdfView({data: 'Aims and Objectives'})}>
                            <Text style={{color: '#82BE30', fontSize: 18}}>> Aims and Objectives</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{marginVertical: 5, paddingHorizontal: 20}} onPress={() => Actions.pdfView({data: 'Beliefs'})}>
                            <Text style={{color: '#82BE30', fontSize: 18}}>> Beliefs</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{marginVertical: 5, paddingHorizontal: 20}}  onPress={() => Actions.pdfView({data: 'Leadership'})}>
                            <Text style={{color: '#82BE30', fontSize: 18}}>> Leadership</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{marginVertical: 5, paddingHorizontal: 20}}  onPress={() => Actions.pdfView({data: 'Manifesto'})}>
                            <Text style={{color: '#82BE30', fontSize: 18}}>> Manifesto</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{marginVertical: 5, paddingHorizontal: 20}}  onPress={() => Actions.pdfView({data: 'Guidelines'})}>
                            <Text style={{color: '#82BE30', fontSize: 18}}>> Guidelines for Primaries</Text>
                        </TouchableOpacity>
                    </View>
                </Container>
            </StyleProvider>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        marginVertical: 30,
        paddingHorizontal: 20
    }
})