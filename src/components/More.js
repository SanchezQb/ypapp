import React, { Component } from 'react'
import { TouchableOpacity, View, Text, ToastAndroid } from 'react-native'
import { Icon } from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Actions } from 'react-native-router-flux'
import accountStore from '../stores/Account';



export default class More extends Component {

  state = {
    partyMember: accountStore.user.role
  }
  render() {
    return (
      <React.Fragment>
          <View style={{justifyContent: 'space-around', flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => Actions.donations()}>
            <View style={{alignItems: 'center', marginTop: 20, width: 50}}>
              <Icon name="md-heart-outline" style={{color: '#fff'}}/>
              <Text style={{color: '#fff', fontSize: 10, marginTop: 4}}>Donate</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Actions.careers()}>
            <View style={{alignItems: 'center', marginTop: 20, width: 60}}>
              <Icon name="ios-briefcase-outline" style={{color: '#fff'}}/>
              <Text style={{color: '#fff', fontSize: 10, marginTop: 4}}>Careers</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Actions.townhalls()}>
            <View style={{alignItems: 'center', marginTop: 20, width: 60}}>
              <Icon name="md-megaphone" style={{color: '#fff'}}/>
              <Text style={{color: '#fff', fontSize: 9.5, marginTop: 4}}>Town Hall</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Actions.candidates()}>
            <View style={{alignItems: 'center', marginTop: 20, width: 60}}>
              <Icon name="ios-flag-outline" style={{color: '#fff'}}/>
              <Text style={{color: '#fff', fontSize: 10, marginTop: 4}}>Candidates</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Actions.survey()}>
            <View style={{alignItems: 'center', marginTop: 20, width: 50}}>
              <Icon name="ios-stats-outline" style={{color: '#fff'}}/>
              <Text style={{color: '#fff', fontSize: 10, marginTop: 4}}>Survey</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{borderColor: "#a6a6a6", borderWidth: 0.25, marginVertical: 15}}></View>
        <View style={{justifyContent: 'space-around', flexDirection: 'row'}}>
        {this.state.partyMember == 1 ?
          <TouchableOpacity onPress={() => Actions.elections()}>
            <View style={{alignItems: 'center', marginTop: 10, width: 50}}>
              <Icon name="md-checkmark-circle-outline" style={{color: '#fff'}}/>
              <Text style={{color: '#fff', fontSize: 10, marginTop: 4}}>Elections</Text>
            </View>
          </TouchableOpacity>
        :
        <TouchableOpacity onPress={() => Actions.benefits()}>
          <View style={{alignItems: 'center', marginTop: 10, width: 50}}>
            <Icon name="md-checkmark-circle-outline" style={{color: '#fff'}}/>
            <Text style={{color: '#fff', fontSize: 10, marginTop: 4}}>Elections</Text>
          </View>
        </TouchableOpacity>
        }
          <TouchableOpacity onPress={() => Actions.debate()}>
            <View style={{alignItems: 'center', marginTop: 10 ,width: 50}}>
              <Icon name="ios-microphone-outline" style={{color: '#fff'}}/>
              <Text style={{color: '#fff', fontSize: 10, marginTop: 4}}>Debate</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Actions.excos()}>
            <View style={{alignItems: 'center', marginTop: 10, width: 50}}>
              <MaterialIcons name="sitemap" style={{color: '#fff', fontSize: 26}}/>
              <Text style={{color: '#fff', fontSize: 10, marginTop: 4}}>Excos</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Actions.gallery()}>
            <View style={{alignItems: 'center', marginTop: 10, width: 50}}>
              <Icon name="ios-camera-outline" style={{color: '#fff'}}/>
              <Text style={{color: '#fff', fontSize: 10, marginTop: 4}}>Gallery</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Actions.events()}>
            <View style={{alignItems: 'center', marginTop: 10, width: 50}}>
              <Icon name="ios-calendar-outline" style={{color: '#fff'}}/>
              <Text style={{color: '#fff', fontSize: 10, marginTop: 4}}>Events</Text>
            </View>
          </TouchableOpacity>
        </View>
      </React.Fragment>
  )
  }

}