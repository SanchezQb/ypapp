import React, { Component } from 'react'
import { Text, ListItem, Thumbnail, Left, Right, Body } from 'native-base'
import { View, StyleSheet, Picker, FlatList, ActivityIndicator, ToastAndroid, BackHandler } from 'react-native'
import { Actions } from 'react-native-router-flux'
import axios from 'axios'
import accountStore from '../../stores/Account';
import { StateData } from '../../modules/StateData'
import Config from '../../config'


export default class Vacancies extends Component {

    constructor() {
        super()
        this.state = {
            careers: [],
            items: [],
            isLoading: true,
            error: false,
            filterBy: 'All',
            state: '',
            lga: '',
            selectedLGAs: [],
        }
        this.baseState = this.state
    }

    componentDidMount() {
        this.fetchAllCareers()
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress () {
        Actions.pop()
        return true;
    }
    userProfile = (avatar) => {
        if(avatar == null || avatar == '') {
            return (
                <Thumbnail source={require('../logo.png')} resizeMode="center"/>
            )
        }
        else {
            return (
                <Thumbnail source={{uri: avatar}}/>
            )
        }
    }

    fetchAllCareers = async () => {
        await axios({
            url: `${Config.baseUrl}/careers`, 
            method: 'GET', 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${accountStore.user.token}`
            },
        })
        .then(res => {
            console.log(res.data.data)
            this.setState({careers: res.data.data.filter(item => !item.meta.voluntary), isLoading: false})
        })
        .then(() => {
            this.setState({items: this.state.careers, isLoading: false})
        })
        .catch(err => {
            this.setState({error: true, isLoading: false})
            ToastAndroid.show(err.response.data.error, ToastAndroid.SHORT)
        })
    }

    reset = () => {
        this.setState(this.baseState)
        this.fetchAllCareers()
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
            return this.setState({items: this.state.careers})
        }
        else if(text == 'Federal') {
            return this.setState({items: this.state.careers.filter(item => item.meta.location == text)})
        }
        let updatedList = this.state.careers
        updatedList = updatedList.filter(v => {
            return v.meta.location.toLowerCase().search(
                text.toLowerCase()) !== -1;
        })
        this.setState({
            items: updatedList
        })
    }
    filterList2 = (text) => {
        let updatedList = this.state.careers
        updatedList = updatedList.filter(v => {
            return v.meta.location.toLowerCase().search(
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
                <Text style={{color: '#444'}}>Could not load Careers :(</Text>
                <Text></Text>
                <Text></Text>
                <Button style={{backgroundColor: '#82BE30', alignSelf: 'center'}}onPress={() => {this.reset()}}>
                    <Text>Retry</Text>
                </Button>
              </View>
              
            )
        }
        else if (this.state.careers.length == 0) {
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: '#444'}}>There are no Careers to display</Text>
                    <Text></Text>
                    <Text></Text>
                    <Button style={{backgroundColor: '#82BE30', alignSelf: 'center', marginTop: 5}}onPress={() => {this.reset()}}>
                        <Text>refresh</Text>
                    </Button>
              </View>
            )
        }
        return (
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
                                        // this.setLGAs()
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
                                            // this.filterList(state)
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
                                            this.filterList2(lga)
                                        })
                                    }}
                                    mode='dialog'>
                                    <Picker.Item  value="Select LGA" label="Select LGA" />
                                    {this.state.selectedLGAs}
                                </Picker>
                            </View> 
                         :
                            null
                        }
                    </View>
                <View style={{paddingBottom: 100}}>
                        {this.state.items.length === 0 ? 
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 18}}>No careers to display</Text>
                        </View> 
                        :
                        <FlatList
                        legacyImplementation
                        initialNumToRender={10}
                        data={this.state.items}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item}) =>
                        <View style={styles.listContainer}>
                            <ListItem avatar style={{paddingVertical: 15, marginLeft: 10}} onPress={() => Actions.vacancy({item})}>
                                <Left>
                                    {this.userProfile(item.origin.avatar)}
                                </Left>
                                <Body style={{borderBottomWidth: 0}}>
                                    <Text>{item.origin}</Text>
                                    <Text style={{color: '#82BE30'}}>{item.role}</Text>
                                </Body>
                                <Right style={{borderBottomWidth: 0}}>
                                    <Text note>{item.meta.location}</Text>
                                </Right>
                            </ListItem>
                        </View>
                        }
                        keyExtractor={item => item.id.toString()}
                    />
                    }
                </View>
            </View>   
        )
    }
}
const styles= StyleSheet.create({
    picker: {
        color: '#82BE30', 
        width: '30%', 
        marginLeft: 25
    },
    listContainer: {
        borderBottomWidth: 1,
        borderColor: '#ddd',
        width: '95%',
        alignSelf: 'center'
    }

})