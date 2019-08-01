import React, { Component } from 'react'
import { 
    StyleProvider, 
    Header, 
    Left, 
    Body, 
    Right, 
    Button, 
    Icon, 
    Title, 
    View, List, ListItem
} from 'native-base';
import { StyleSheet, ScrollView, Text, Linking, BackHandler, Dimensions } from 'react-native'
import getTheme from '../../native-base-theme/components'
import material from '../../native-base-theme/variables/material'
import { Actions } from 'react-native-router-flux'
import MaterialIcon from 'react-native-vector-icons/Entypo'

const { height } = Dimensions.get('window')

export default class Contact extends Component {

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }
    onBackPress () {
        Actions.pop();
        return true;
    }


    telephone = () => {
        Linking.openURL('tel:08069216186').catch(err => console.error('An error occurred', err));
    }
    mail = () => {
        Linking.openURL('mailto:info@youthpartyng.com').catch(err => console.error('An error occurred', err));
    }
    geo = () => {
        Linking.openURL('geo:9.053448,7.459499').catch(err => console.error('An error occurred', err));
    }

    openLink = (url) => {
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    }

    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <ScrollView>
                <View style={{flex: 1}}>
                    <Header>
                        <Left>
                            <Button onPress={() => Actions.pop()}transparent>
                                <Icon name="arrow-back" style={{color: '#fff'}}/>
                            </Button>
                        </Left>
                        <Body>
                            <Title>Contact Us</Title>
                        </Body>
                        <Right></Right>
                    </Header> 
                    <View style={styles.wrap}> 
                        <Button iconLeft transparent style={{width: '50%'}} onPress={() => this.geo()}>
                            <Icon name='md-pin' style={{color: '#82BE30', marginBottom: 10}} />
                            <Text style={{color: '#222', marginLeft: 10, fontSize: height * 0.024 }}>Youth Party Nigeria, Wuse, Abuja</Text>
                        </Button>
                        <Button transparent iconLeftt onPress={() => this.mail()}>
                            <Icon name='md-mail' style={{color: '#82BE30',}} />
                            <Text uppercase={false} style={{color: '#555',}}>info@youthpartyng.com</Text>
                        </Button>
                    </View>
                    <View style={styles.phone}>
                        <List>
                            <ListItem style={{borderBottomWidth: 0}} noIndent onPress={() => this.telephone()}>
                                <Left>
                                    <View>
                                        <Text style={{fontSize: 18, color: '#222'}}>Phone</Text>
                                        <Text style={{color: '#555'}}>08032345678</Text>
                                    </View>
                                </Left>
                                <Right>
                                    <View style={{backgroundColor: '#82BE30', width: 30, height: 'auto', borderRadius: 15}}>
                                        <Icon name="md-call" 
                                        style={{color: '#fff', alignSelf: 'center'}} />
                                    </View>
                                </Right>
                            </ListItem>
                        </List>
                    </View>
                    <View style={styles.social}>
                        <Text style={{textAlign: 'center', fontSize: 15}}>Follow us @YouthPartyNg</Text>
                        <View style={styles.icons}>
                            <MaterialIcon onPress={() => this.openLink('https://www.instagram.com/youthparty_nigeria/')} name="instagram-with-circle" style={{ fontSize: 24 }} />
                            <MaterialIcon onPress={() => this.openLink('https://www.facebook.com/YouthPartyNG')} name="facebook-with-circle" style={{ fontSize: 24 }}/>
                            <MaterialIcon onPress={() => this.openLink('https://twitter.com/youthparty_ng')} name="twitter-with-circle" style={{ fontSize: 24 }}/>
                        </View>
                    </View>
                </View>
                </ScrollView>
            </StyleProvider>
        )
    }
}
const styles = StyleSheet.create({
    wrap: {
        marginTop: 30,
    },
    phone: {
        borderWidth: 1,
        marginTop: 30,
        borderColor: '#ccc',
        width: '95%',
        alignSelf: 'center',
        padding: 10,
        backgroundColor: '#fff'
    },
    category: {
        borderWidth: 1,
        marginTop: 30,
        borderColor: '#ccc',
        width: '95%',
        alignSelf: 'center',
        padding: 10,
        backgroundColor: '#fff'
    },
    textarea: {
        borderWidth: 1,
        marginTop: 30,
        borderColor: '#ccc',
        width: '95%',
        alignSelf: 'center',
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 20
    },
    social: {
        width: '50%',
        alignSelf: 'center',
        marginTop: 40
    },
    icons: {
        flexDirection: 'row', 
        justifyContent: 'space-around',
        marginTop: 10, 
        width: '70%', 
        alignSelf: 'center'
    }
})
