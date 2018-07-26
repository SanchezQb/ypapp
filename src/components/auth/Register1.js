import React, { Component } from 'react'
import { 
    StyleSheet,  
    TouchableOpacity, 
    Image, 
    Picker, 
    ScrollView, ToastAndroid, BackHandler, Linking } from 'react-native'
import DatePicker from 'react-native-datepicker'
import { 
    StyleProvider,   
    Body,  
    Header,
    Button, 
    Title, 
    Text, 
    View, Item, Input, Label, Left, Right, Icon
} from 'native-base';
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import ImagePicker from 'react-native-image-crop-picker';
import { observer } from 'mobx-react/native'
import { Actions } from  'react-native-router-flux'
import { StateData } from '../../modules/StateData'

@observer
export default class Register1 extends Component {
    state = {
        fullname: '',
        dob: '',
        state: 'Select State',
        lga: 'Aba South',
        ward: '',
        selectedLGAs: []
    }
    constructor(){
		super();
		this.setLGAs = this.setLGAs.bind(this);
    }
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
    
    userProfile = () => {
        if(!this.state.image) {
            return (
                <Image source={require('../avatar.jpg')} style={styles.dp}/>
            )
        }
        else {
            return (
                <Image source={{uri: this.state.image}} style={styles.dp}/>
            )
        }
    }

    
    selectImage = () => {
        ImagePicker.openPicker({
            cropperCircleOverlay: true,
            width: 300,
            height: 300,
            cropping: true
          }).then(image => {
            this.setState({image: image.path})
          });
    } 
    openSite = () => {
        Linking.openURL('http://voters.inecnigeria.org').catch(err => console.log(err))
    }

    continue = () => {
        if(this.state.fullname == "" || this.state.dob == "" || this.state.residence == "" || this.state.lga == "" || this.state.ward == "" ){
            ToastAndroid.show('All fields are required', ToastAndroid.SHORT)
        }
        else {
            Actions.register2({data: this.state})
        }
    }
     

    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <React.Fragment>
                    <Header noShadow>
                        <Left>
                            <Button transparent onPress={() => Actions.pop()}>
                                <Icon name="arrow-back" style={{fontSize: 20, color: '#fff'}}/>
                            </Button>
                        </Left>
                        <Body>
                            <Title>Registration</Title>
                        </Body>
                        <Right></Right>
                    </Header>
                    <View style={styles.span}>
                    </View>
                    <TouchableOpacity  onPress={() => this.selectImage()} style={styles.dpcont}>
                        {this.userProfile()}
                    </TouchableOpacity>
                    <ScrollView keyboardShouldPersistTaps="always">
                        <View style={styles.form}>
                            <Item stackedLabel style={styles.item}>
                                <Label style={{color: '#444'}}>FULL NAME</Label>
                                <Input
                                    style={{ paddingVertical: 0}} 
                                    onChangeText={(fullname) => this.setState({fullname})}/>
                            </Item>
                            <View style={styles.picker}>
                                <Label style={{color: '#444'}}>DATE OF BIRTH</Label>
                                <DatePicker
                                    date={this.state.dob}
                                    mode="date"
                                    placeholder="Click to Select"
                                    format="YYYY-MM-DD"
                                    minDate="1900-05-01"
                                    maxDate="2000-01-01"
                                    androidMode="spinner"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    showIcon={false}
                                    customStyles={{
                                        placeholderText: {
                                            color: '#777',
                                            fontSize: 12,
                                            justifyContent:'flex-start',
                                        },
                                    dateInput: {
                                        // marginLeft: 36,
                                        borderWidth: null,
                                        borderBottomWidth: 1,
                                        borderColor: '#fff'
                                    },
                                    dateText:{
                                        justifyContent: 'flex-start'
                                    }
                                    // ... You can check the source to find the other keys.
                                    }}
                                    onDateChange={(date) => {this.setState({dob: date})}}
                                />
                            </View>
                            <View style={styles.picker}>
                                <Label style={{color: '#444'}}>STATE OF REGISTRATION</Label>
                                <Picker
                                    selectedValue={this.state.state}
                                    onValueChange={(state) => {
                                        this.setState({state}, () => {
                                            this.setLGAs()
                                        })
                                    }}
                                    mode='dropdown'>
                                   {
                                        StateData.map((item, index) => {
                                            let state = item['state']['name'];
                                            return <Picker.Item key={index} value={state} label={state} />;
                                        })
                                    }
                                </Picker>
                            </View>
                            <View style={styles.picker}>
                                <Label style={{color: '#444'}}>LGA</Label>
                                <Picker
                                    selectedValue={this.state.lga}
                                    onValueChange={(lga) => this.setState({lga})}
                                    mode='dropdown'>
                                    {this.state.selectedLGAs}
                                </Picker>
                            </View>
                            <Item stackedLabel style={styles.item}>
                                <Label style={{color: '#444'}}>WARD</Label>
                                <Input 
                                    style={{ paddingVertical: 0}} 
                                    onChangeText={(ward) => this.setState({ward})}/>
                            </Item>
                        </View>
                        <View style={styles.inec}>
                            <Text style={{color: '#444', textAlign: 'center'}}>
                                Check your registration information <Text onPress={() => this.openSite()}style={{color: '#82BE30'}}>here</Text>
                            </Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button onPress={() => this.continue()} style={styles.button} block>
                                <Text>Continue</Text>
                            </Button>
                        </View>
                        <View style={styles.login}>
                            <Text style={styles.loginText}>
                                Already a member? Click to <Text onPress={() => Actions.login()}style={styles.loginLink}>Log In</Text>
                            </Text>
                        </View>
                    </ScrollView>
                </React.Fragment>
            </StyleProvider>
        )
    }
    setLGAs(){						
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
}
const styles = StyleSheet.create({
    span: {
        height: 90,
        backgroundColor: '#82BE30',    
    },
    dpcont: {
        backgroundColor: '#ccc',
        height: 90,
        borderRadius: 45,
        width: 90,
        alignSelf: 'center',
        position: 'absolute',
        top: 90,
        zIndex: 200
    },
    dp: {
        height: 90,
        borderRadius: 45,
        width: 90,
    },
    form: {
        width: '85%',
        alignSelf: 'center',
        marginTop: 70
    },
    item: {
        marginBottom: 15
    },
    picker: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderColor: '#ccc'
    },
    buttonContainer: {
        width: '85%',
        alignSelf: 'center',
        marginTop: 30
    },
    button: {
        backgroundColor: '#82BE30',
    },
    login: {
        width: '75%',
        alignSelf: 'center',
        flex: 1
    },
    loginText: {
        marginTop: 10,
        textAlign: 'center',
        color: '#777',
        fontSize: 18
    },
    loginLink: {
        color: '#82BE30',
        fontSize: 18
    }
})