import React, { Component } from 'react'
import { Dimensions, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

export const { width, height } = Dimensions.get('window')

export const bigButton = {
  height: 45,
  width: width * 0.7,
  backgroundColor: '#82BE30',
  borderRadius: 5,
  justifyContent: 'center',
  alignSelf: 'center',
  alignItems: 'center',
  shadowColor: 'black',
  shadowOffset: { width: 10, height: 10 },
  shadowOpacity: 0.1,
  shadowRadius: 8
}

export const avatar = {
  height: 56,
  width: 56,
  borderRadius: 28
}

export const buttonText = {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold'
}

export const inputStyle = {
  height: 35,
  borderBottomWidth: 0.7,
  width: width * 0.7,
  borderBottomColor: '#B3B6B7'
}

export const formContainer = {
  height: 50,
  marginBottom: 50
}

export const formLabel = {
  fontSize: 12,
  color: '#2F2E2E',
  fontWeight: '500',
}

export const formHolder = {
  height: height / 4,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 40,
  marginBottom: 25
}

export const LightGrey = '#D0D3D4'
export const defaultGreen = '#82BE30'

// components mixins
export const Selectors = ({ sideOne, changeFunction, keys }) => (
  <View style={{ height: height * 0.05, width, flexDirection: 'row', flexWrap: 'nowrap' }}>
    <TouchableOpacity style={{ height: height * 0.05, width: width * 0.5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9F9' }} onPress={() => { console.log('yay')}}>
      <Text style={{ fontSize: 12.3, fontWeight: '600', color: !sideOne ? '#626567' : defaultGreen }}> {keys[0]} </Text>
    </TouchableOpacity>
    <TouchableOpacity style={{ height: height * 0.05, width: width * 0.5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E5E8E8'}} onPress={() => { console.log('Yay') }}>
      <Text style={{ fontSize: 12.3, fontWeight: '600', color: !sideOne ? '#626567' : defaultGreen }}> {keys[1]} </Text>
    </TouchableOpacity>
  </View>
)

export const TinySelectors = ({ keys, functionMap }) => {
  const selectorElements = keys.map((item, index) => {
    return (
      <TouchableOpacity key={`item123-${index}`}style={{ maxWidth: width * 0.2, flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center'}}
        onPress={() => functionMap[index]()}
      >
        <Text style={{ fontSize: 12, fontWeight: '500', color: defaultGreen }}> { item }</Text>
        <MaterialCommunityIcon name="menu-down" color={defaultGreen} size={17}/>
      </TouchableOpacity>
    )
  }
)
  return (
      <View style={{ height: 50, width, flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 25, paddingRight: 25 }}>
        { selectorElements }
      </View>
    )
}

const RadioButton =  ({ color, value, pushUp, keyX }) => {
  return (
    <TouchableOpacity
      style={{
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#7B7D7D50',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        marginRight: 5
      }}
      onPress ={() => { pushUp(value, keyX) }}
      >
      <TouchableOpacity
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color
        }}
        onPress ={() => { pushUp(value, keyX) }}
        >
      </TouchableOpacity>
    </TouchableOpacity>
  )
}




export class DisplayRadios extends Component {
  constructor(props) {
    super(props);
    this.state = { blah: 'yeah' };
    this.fixValues();
  }

  fixValues = () => {
    const newState = { ...this.state };
    this.props.values.forEach((value, index) => {
      newState[`${index}element`] = 'white';
    });
    this.state = Object.assign({}, this.state, newState)
  }

  handleSelect = (value, key) => {
    const changes = {}
    changes[`${key}element`] = defaultGreen;
    const previousState = Object.keys(this.state).filter(item => item !== `${key}element`);
    previousState.forEach(item => {
      changes[`${item}`] = 'white'
    });
    this.setState({ ...changes })
    this.props.pushToState(value);
  }

  renderItems = () => this.props.values.map((item, key) => {
    return (
      <View key={item} style={{ maxHeight: 50, width, flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'flex-start' }}>
        <RadioButton keyX={key} color={this.state[`${key}element`] ? this.state[`${key}element`] : 'white'} clicked={false} value={item} pushUp={(value, index) => this.handleSelect(value, index) }/>
        <Text style={{ fontSize: 14, color:'#444', position: 'relative', top: 2}}> { item }</Text>
    </View>
    )
  })

  render = () => {
    return (
      <View style={{ maxHeight: height * 0.1, maxWidth: 0.3, marginBottom: 15, justifyContent: 'center', ...this.props.style }}>
        { this.renderItems() }
    </View>
    )
  }
}

export const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  <ActivityIndicator size="small" color={`${defaultGreen}`} />
</View>
)