import React, { Component } from 'react'
import { StyleProvider, Header, Left, Body, Right, Button, Icon, Title, Text, Thumbnail,Item, ListItem, Input} from 'native-base';
import { View, StyleSheet, ActivityIndicator, ScrollView, BackHandler } from 'react-native'
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import { Actions } from 'react-native-router-flux'
import { observer } from 'mobx-react/native'
import accountStore from '../../stores/Account'
import axios from 'axios'

@observer
export default class DonationListing extends Component {
    constructor() {
        super()
        this.state = {
            refreshing: false,
            error: false,
            isLoading: true,
            donations: [],
            items: []
        }
        this.baseState = this.state
    }
    
    componentDidMount() {
        this.fetchAllDonations()
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress () {
       Actions.pop()
       return true
    }

    fetchAllDonations = async () => {
        await axios({
            url: `https://ypn-node-service.herokuapp.com/api/v1/donations`, 
            method: 'GET', 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${accountStore.user.token}`
            },
        })
        .then(res => {
            this.setState({
                isLoading: false,
                donations: res.data.data.filter(donation => {
                    return donation.type == this.props.data.type && donation.meta.level == this.props.data.level
                })
            })
        }).then(() => {
            this.setState({
                items: this.state.donations
            })
        })
        .catch(error => {
            this.setState({
                isLoading: false,
                error: true
            })
        })
        
    }
    reset = () => {
        this.setState(this.baseState)
        this.fetchAllDonations()
      }

    _onRefresh() {
        this.setState({refreshing: true})
        this.fetchAllDonations().then(() => {
            this.setState({
                refreshing: false
            })
        })
    }
    filterList = (text) => {
        let updatedList = this.state.donations
        updatedList = updatedList.filter(v => {
            return v.meta.location.toLowerCase().search(
                text.toLowerCase()) !== -1;
        })
        this.setState({
            items: updatedList
        })
    }
    renderDonationTitle = () => {
        if(this.props.data.type == 1) {
            return <Text style={styles.donationHeading}>Party Donations</Text>
        }
        else if(this.props.data.type == 2) {
            return <Text style={styles.donationHeading}>Candidate Donations</Text>
        }
        else {
            return <Text style={styles.donationHeading}>Project Donations</Text>
        }
    }
    render() {
        if (this.state.isLoading) {
            return (
              <View style={{flex: 1, justifyContent: 'center'}}>
                <ActivityIndicator size="large" color="#82BE30"/>
              </View>
            );
          }
          else if (this.state.error) {
            return (
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#444'}}>Could not load Posts:(</Text>
                <Text></Text>
                <Text></Text>
                <Button style={{backgroundColor: '#82BE30', alignSelf: 'center'}}onPress={() => {this.reset()}}>
                    <Text>Retry</Text>
                </Button>
              </View>
              
            )
        }
        const donationsList = this.state.items.map(donation => {
            return (
                <ListItem 
                    key={donation._id}
                    avatar 
                    style={{paddingVertical: 15}}
                    onPress={() => Actions.donationDetail({data: donation})}>
                    <Left>
                        <Thumbnail source={require('../avatar.jpg')} />
                    </Left>
                    <Body>
                        <Text style={{color: '#444', fontWeight: 'bold'}}>
                        {donation.title}
                        </Text>
                        <Text style={{color: '#82Be30'}}>{donation.meta.location}</Text>
                    </Body>
                    <Right>
                        
                    </Right>
                </ListItem>
            )
        })
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
                            <Title> Donations</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <View style={styles.searchBar}>
                        <Item>
                            <Icon name="ios-search" />
                            <Input
                                onChangeText={(text) => this.filterList(text)} 
                                placeholder="Search for locations"
                                placeholderTextColor="#777"    
                            />
                        </Item>                    
                    </View>
                    <View>
                        {this.renderDonationTitle()}
                    </View>
                    <ScrollView>
                        {donationsList}
                    </ScrollView>
                </View>
            </StyleProvider>
        )
    }
}
const styles = StyleSheet.create({
    searchBar: {
        width: '90%',
        alignSelf: 'center'
    },
    donationHeading: {
        fontSize: 20,
        textAlign: 'center',
        color: '#777',
        marginVertical: 20,
        fontWeight: 'bold'
    }
})