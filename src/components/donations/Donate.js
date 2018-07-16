import React, { Component } from "react";
import { StyleSheet, View, ScrollView, TextInput, ToastAndroid, BackHandler } from "react-native";
import { CreditCardInput } from "react-native-credit-card-input";
import { Button, Text, StyleProvider, Container, Header, Left, Right, Title, Icon, Body } from 'native-base'
import RNPaystack from 'react-native-paystack'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'
import { Actions } from 'react-native-router-flux'
import accountStore from '../../stores/Account'
import donationStore from "../../stores/Donations";

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    
  },
  label: {
    color: "#444",
    fontSize: 12,
  },
  input: {
    fontSize: 16,
    color: "black",
  },
});


export default class Donate extends Component {
  state = { 
    formData: {} 
  };

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

  _onChange = (formData) => this.setState({formData});
  _onFocus = (field) => console.log("focusing", field);

  chargeCard = () => {
    ToastAndroid.show('Please wait', ToastAndroid.SHORT)
    let cardNumber= this.state.formData.values.number
    let expiryMonth= this.state.formData.values.expiry.split("/")[0]
    let expiryYear= this.state.formData.values.expiry.split("/")[1]
    let cvc= this.state.formData.values.cvc
    let amount= donationStore.amount
    if(cardNumber == "" || expiryMonth == "" || expiryYear == "" || cvc == "" || amount == 0) {
        ToastAndroid.show('All fields are required', ToastAndroid.SHORT)
    }
    else {
        RNPaystack.chargeCard({
            cardNumber: this.state.formData.values.number,
            expiryMonth: this.state.formData.values.expiry.split("/")[0],
            expiryYear: this.state.formData.values.expiry.split("/")[1],
            cvc: this.state.formData.values.cvc,
            email: accountStore.user.email,
            amountInKobo: donationStore.amount * 100
          })
          .then(res => {
            donationStore.donate(res.reference, this.props.data)
          })
          .catch(error => ToastAndroid.show(error.message, ToastAndroid.SHORT))
    }   
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
                    <Title>Donate</Title>
                </Body>
                <Right>
                </Right>
            </Header>
            <ScrollView keyboardShouldPersistTaps="always">
              <View style={styles.container}>
                <CreditCardInput
                    requiresName
                    requiresCVC
                    labelStyle={styles.label}
                    inputContainerStyle={{marginTop: 20, borderColor: '#a6a6a6', borderBottomWidth: 1}}
                    inputStyle={styles.input}
                    validColor={"black"}
                    invalidColor={"red"}
                    placeholderColor={"darkgray"}
                    onFocus={this._onFocus}
                    onChange={this._onChange} />
                <View style={{width: '68%', alignSelf: 'center', marginTop: 20, borderColor: '#a6a6a6', borderBottomWidth: 1}}>
                    <Text style={{fontWeight: 'bold', fontSize: 11}}>{`Amount`.toUpperCase()}</Text>
                    <TextInput
                        keyboardType="numeric"
                        onChangeText={(text) => donationStore.setAmount(text)}
                        style={{fontSize: 16}}
                        placeholder="Amount"
                        underlineColorAndroid="rgba(0,0,0,0)"
                        placeholderTextColor="darkgray"
                    
                    />
                </View>
                  <Button block 
                    disabled={donationStore.disabled}
                      style={{backgroundColor: '#82BE30', marginTop: 20, width: '70%', alignSelf: 'center'}}
                      onPress={() => this.chargeCard()}>
                    <Text>Pay</Text>
                  </Button>
              </View>
              <View style={{flexDirection: 'row', marginTop: 20, alignSelf: 'center'}}>
                <Icon name="md-lock" style={{fontSize: 14, marginRight: 5}} />
                <Text style={{fontWeight: 'bold', fontSize: 14, textAlign: 'center'}}>SECURED BY PAYSTACK</Text>
              </View>
            </ScrollView>
          </Container>
        </StyleProvider>
    );
  }
}