import React, { Component } from "react";
import { StyleSheet, View, ScrollView, ToastAndroid, BackHandler } from "react-native";
import { CreditCardInput } from "react-native-credit-card-input";
import { Button, Text, StyleProvider, Container, Header, Left, Right, Title, Icon, Body } from 'native-base'
import RNPaystack from 'react-native-paystack'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'
import { Actions } from 'react-native-router-flux'
import accountStore from '../../stores/Account'
import { observer } from 'mobx-react/native'

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    
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

@observer
export default class Subscribe extends Component {
  state = { 
    formData: {
      valid: false
    } 
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
    if(this.state.formData.valid === false) {
      ToastAndroid.show('All fields are reuqired', ToastAndroid.SHORT)
    }
    else if(accountStore.user.role == 1) {
      ToastAndroid.show('You already have a valid subscription', ToastAndroid.SHORT)
    }
    else {
        RNPaystack.chargeCard({
            cardNumber: this.state.formData.values.number,
            expiryMonth: this.state.formData.values.expiry.split("/")[0],
            expiryYear: this.state.formData.values.expiry.split("/")[1],
            cvc: this.state.formData.values.cvc,
            email: accountStore.user.email,
            amountInKobo: 60000
          })
          .then(res => {
            accountStore.becomeAPartyMember()
          })
          .catch(error => ToastAndroid.show(error.message, ToastAndroid.SHORT))
    }   
  }

  render() {
    console.log(this.state)
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
                    <Title>Subscribe</Title>
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
                  <Button block 
                      style={{backgroundColor: '#82BE30', marginTop: 20, width: 300, alignSelf: 'center'}}
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