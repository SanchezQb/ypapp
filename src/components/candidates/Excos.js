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
import { StyleSheet, TouchableOpacity, View, Picker, BackHandler, FlatList, ToastAndroid, ActivityIndicator } from 'react-native'
import { Actions } from 'react-native-router-flux'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'
import accountStore from '../../stores/Account'
import { StateData } from '../../modules/StateData'
import axios from 'axios'
import Config from '../../config'


export default class Excos extends Component {

    constructor() {
        super()
        this.state = {
            excos: [],
            items: [],
            isLoading: true,
            error: false,
            filterBy: 'All',
            state: '',
            lga: '',
            selectedLGAs: [],
            position: ''
        }
        this.baseState = this.state
    }

    componentDidMount() {
        this.fetchExcos()
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress () {
        Actions.pop()
        return true;
    }

    fetchExcos = async () => {
        await axios({
            url: `${Config.electionUrl}/excos`, 
            method: 'GET', 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${accountStore.user.token}`
            },
        })
        .then(res => {
            console.log(res.data.data)
            const { meta } = res.data.data;
            const payload = Object.keys(res.data.data.meta).map(item => {
                const ref = {}
                ref.position = item
                ref.value = meta[`${item}`]
                return ref
            })
            this.setState({excos: payload})
        }).then(() => {
            this.setState({items: this.state.excos, isLoading: false})
        })
        .catch(err => {
            this.setState({error: true, isLoading: false})
            ToastAndroid.show(err.response.data.error, ToastAndroid.SHORT)
        })
    }
    reset = () => {
        this.setState(this.baseState)
        this.fetchExcos()
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
            return this.setState({items: this.state.excos})
        }
        else if(text == 'Federal') {
            return this.setState({items: this.state.excos.filter(item => item.value.level == text)})
        }
        let updatedList = this.state.excos
        updatedList = updatedList.filter(v => {
            return v.value.state.toLowerCase().search(
                text.toLowerCase()) !== -1;
        })
        this.setState({
            items: updatedList
        })
    }
    filterList2 = (text) => {
        let updatedList = this.state.excos
        updatedList = updatedList.filter(v => {
            return v.value.local.toLowerCase().search(
                text.toLowerCase()) !== -1;
        })
        this.setState({
            items: updatedList
        })
    }

    renderLocation = (item) => {
        if(item.value.level == 'Federal') {
            return <Text note>Federal</Text>
        }
        else if(item.value.level == 'state') {
            return (
                <Text note>{item.value.state} State</Text>
            )
        }
        else {
            return (
                <React.Fragment>
                     <Text note>{item.value.local} LGA</Text>
                    <Text note>{item.value.state} State</Text>
                </React.Fragment>
            )
        }
    }
    
    render() {
        console.log(this.state)
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
        else if (this.state.excos.length == 0) {
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: '#444'}}>There are no excos to display</Text>
                    <Text></Text>
                    <Text></Text>
                    <Button style={{backgroundColor: '#82BE30', alignSelf: 'center', marginTop: 5}}onPress={() => {this.reset()}}>
                        <Text>refresh</Text>
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
                            <Title>Excos</Title>
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
                    <View>
                    {
                        this.state.items.length == 0 ?
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 18}}>No excos to display</Text>
                        </View>
                        :
                        <View style={{paddingBottom: 150}}>
                        <FlatList
                            legacyImplementation
                            initialNumToRender={10}
                            data={this.state.items}
                            showsVerticalScrollIndicator={false}
                            renderItem={({item}) =>
                                <View style={styles.listitem}>
                                    <ListItem avatar style={{paddingVertical: 15, marginLeft: 15}} onPress={() => Actions.cp({data: item})}>
                                        <Left>
                                            <Thumbnail source={require('../logo.png')} resizeMode="center" />
                                        </Left>
                                        <Body style={{borderBottomWidth: 0}}>
                                            <Text>{`${item.value.firstname} ${item.value.lastname}`}</Text>
                                            <Text style={{color: '#82BE30'}}>{item.position}</Text>
                                        </Body>
                                        <Right style={{borderBottomWidth: 0, marginRight: 0}}>
                                            <View style={{width: 60, marginTop: 10}}>
                                                {this.renderLocation(item)}
                                            </View>
                                        </Right>
                                    </ListItem>
                                </View>
                            }
                            keyExtractor={item => item.value.id.toString()}
                        />
                        </View>
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
        marginLeft: 25,   
    },
    listitem: {
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    
})