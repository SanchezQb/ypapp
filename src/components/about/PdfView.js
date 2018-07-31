import React, { Component } from 'react';
import { View, BackHandler, Text } from 'react-native'
import { Button, Icon, Left, Body, Right, Header, Title, StyleProvider, Container } from 'native-base'
import Pdf from 'react-native-pdf'
import { Actions } from 'react-native-router-flux'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'

export default class PdfView extends Component {
  constructor() {
    super()
    this.state = {
      page: 1,
      scale: 1,
      numberOfPages: 0
    }
    this.pdf = null;
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
  
  render() {
    console.log(this.state)
    let yourPDFURI = {uri:`bundle-assets://pdf/${this.props.data}.pdf`, cache: true};
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
                  <Title>{this.props.data}</Title>
              </Body>
              <Right>
              </Right>
          </Header>
          <Pdf ref={(pdf)=>{this.pdf = pdf;}}
            source={yourPDFURI}
            style={{flex: 1}}
            onPageChanged={(page) => this.setState({page})}
            onLoadComplete={(numberOfPages) => this.setState({numberOfPages})}
            onError={(error)=>{console.log(error);}} />
            <View style={{position: 'absolute', bottom: 5, backgroundColor: 'transparent', alignSelf: 'center'}}>
              <Text style={{textAlign: 'center'}}>{this.state.page} / {this.state.numberOfPages}</Text>
            </View>
        </Container>
      </StyleProvider>
    );
  }
}