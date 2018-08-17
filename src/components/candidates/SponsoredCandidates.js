import React, { Component } from 'react'
import { 
    StyleProvider, 
    Header, 
    Left, 
    Body, 
    Right, 
    Button, 
    Title, 
    ListItem, Thumbnail, Container, Icon, Text
} from 'native-base';
import { StyleSheet, TouchableOpacity, View, Picker, FlatList, ActivityIndicator, ToastAndroid, BackHandler } from 'react-native'
import { Actions } from 'react-native-router-flux'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'
import accountStore from '../../stores/Account'
import { StateData } from '../../modules/StateData'
import axios from 'axios'

export default class SponsoredCandidates extends Component {
    constructor() {
        super()
        this.state = {
            sponsored: [],
            items: [],
            isLoading: true,
            error: false,
            filterBy: 'All',
            state: '',
            lga: '',
            selectedLGAs: [],
            position: '',
        }
        this.baseState = this.state
    }

    componentDidMount() {
        this.fetchSponsored()
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress () {
        Actions.pop()
        return true;
    }
    fetchSponsored = async () => {
        await axios({
            url: 'https://ypn-election-02.herokuapp.com/api/candidates', 
            method: 'GET', 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${accountStore.user.token}`
            },
        })
        .then(res => {
            console.log(res.data)
            this.setState({sponsored: res.data.sponsored})
        }).then(() => {
            this.setState({
                isLoading: false,
                items: this.state.sponsored
            })
        })
        .catch(err => {
            this.setState({error: true, isLoading: false})
            ToastAndroid.show(err.response.data.error, ToastAndroid.SHORT)
        })
    }
    reset = () => {
        this.setState(this.baseState)
        this.fetchSponsored()
    }
    setLGAs = () => {						
		let selectedLGAs = [];
		StateData.map((v) => {
            let state = v['state']['name'];
			if(state == this.state.state){
                let LGAS = v['state']['locals'];
				LGAS.map((v,i) => {
					selectedLGAs.push(<Picker.Item key={i} value={v['name']} label={v['name']} />);
				});
			}
		});
		this.setState({
			selectedLGAs
		});
    }
    filterList = (text) => {
        if(text == "All") {
            return this.setState({items: this.state.aspirants})
        }
        let updatedList = this.state.sponsored
        updatedList = updatedList.filter(v => {
            return v.location.toLowerCase().search(
                text.toLowerCase()) !== -1;
        })
        this.setState({
            items: updatedList
        })
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
                <Text style={{color: '#444'}}>Could not load excos :(</Text>
                <Text></Text>
                <Text></Text>
                <Button style={{backgroundColor: '#82BE30', alignSelf: 'center'}}onPress={() => {this.reset()}}>
                    <Text>Retry</Text>
                </Button>
              </View> 
            )
        }
        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <Header noShadow>
                        <Left>
                            <Button transparent onPress={() => Actions.pop()}>
                                <Icon name="arrow-back" style={{ color: '#fff'}}/>
                            </Button>
                        </Left>
                        <Body>
                            <Title>Sponsored Candidates</Title>
                        </Body>
                        <Right>
                           
                        </Right>
                    </Header>
                    <View>
                    <View style={styles.pickerView}>
                        <Picker
                            selectedValue={this.state.filterBy}
                            onValueChange={(value) => {
                                this.setState({
                                    filterBy: value,
                                    state: 'Select State',
                                    lga: 'Select LGA'
                                })
                                this.filterList(value)
                            }}
                            style={styles.picker}
                            mode='dialog'>
                            <Picker.Item label="All" value="All" />
                            <Picker.Item label="Federal" value="Federal" />
                            <Picker.Item label="State" value = "State" />
                            <Picker.Item label="Local" value="Local" />
                        </Picker>
                        {this.state.filterBy == 'State'? 
                            <Picker
                                style={styles.picker}
                                selectedValue={this.state.state}
                                onValueChange={(state) => {
                                    this.setState({state}, () => {
                                        this.setLGAs()
                                        this.filterList(state)
                                    })
                                }}
                                mode='dialog'>
                            {
                                    StateData.map((item, index) => {
                                        let state = item['state']['name'];
                                        return <Picker.Item key={index} value={state} label={state} />;
                                    })
                                }
                            </Picker> :
                            null
                        }
                        {this.state.filterBy == 'Local'?
                            <View>
                                <Picker
                                    style={styles.picker}
                                    selectedValue={this.state.state}
                                    onValueChange={(state) => {
                                        this.setState({state}, () => {
                                            this.setLGAs()
                                            this.filterList(state)
                                        })
                                    }}
                                    mode='dialog'>
                                    {
                                        StateData.map((item, index) => {
                                            let state = item['state']['name'];
                                            return <Picker.Item key={index} value={state} label={state} />;
                                        })
                                    }
                                </Picker>
                                <Picker
                                    style={styles.picker}
                                    selectedValue={this.state.lga}
                                    onValueChange={(lga) => {
                                        this.setState({lga}, () => {
                                            this.filterList(lga)
                                        })
                                    }}
                                    mode='dialog'>
                                    <Picker.Item  label="Select LGA" value="select lga" />
                                    {this.state.selectedLGAs}
                                </Picker>
                            </View> 
                         :
                            null
                        }
                    </View>
                    <View style={{paddingBottom: 100}}>
                    {this.state.items.length == 0 ? 
                        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 15}}>
                            <Text style={{fontSize: 18}}>No sponsored candidates to display</Text>
                        </View>
                    :
                    <FlatList
                        legacyImplementation
                        initialNumToRender={10}
                        data={this.state.items}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item}) =>
                            <View style={styles.listitem}>
                                <ListItem avatar style={{paddingVertical: 15, marginLeft: 15}} onPress={() => console.log("Pressed")}>
                                    <Left>
                                        <Thumbnail source={require('../profile.png')} />
                                    </Left>
                                    <Body style={{borderBottomWidth: 0}}>
                                        <Text>{`${item.firstname} ${item.lastname}`}</Text>
                                        <Text style={{color: '#82BE30'}}>{item.position}</Text>
                                    </Body>
                                    <Right style={{borderBottomWidth: 0, marginRight: 0}}>
                                        <TouchableOpacity style={styles.touchable}>
                                            <Text style={{color: '#fff', textAlign: 'center'}}>View</Text>
                                        </TouchableOpacity>
                                        <View style={{width: 60, marginTop: 10}}>
                                            <Text note>{item.location}</Text>
                                        </View>
                                    </Right>
                                </ListItem>
                            </View>
                        }
                        keyExtractor={item => item.values.id.toString()}
                        />
                    }
                    </View>
                    </View>   
                </Container>
            </StyleProvider>
        )
    }
}
const styles = StyleSheet.create({
    touchable: {
        backgroundColor: '#82BE30',
        padding: 2,
        width: 60,
        borderRadius: 4
    },
    picker: {
        color: '#82BE30', 
        width: '30%', 
        marginLeft: 25
    },
    listitem: {
        borderBottomWidth: 1,
        borderColor: '#ddd',
    }
})