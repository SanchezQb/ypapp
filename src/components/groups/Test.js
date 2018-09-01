import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import { defaultGreen, height, width } from '../../mixins';
import { startPersonalConversation } from '../../actions/thunks/conversations';

const uri = 'https://ht-cdn.couchsurfing.com/assets/profile-picture-placeholder.png';

class RenderGroupsOfUsers extends Component {
  constructor(props) {
    super(props);
    const { navigator } = this.props;
    navigator.setStyle({
      tabBarHidden: true
    });
    navigator.setDrawerEnabled({ side: 'left', enabled: false });
    navigator.setButtons({
      leftButtons: [
        {
          id: 'Back.button',
          component: 'Back.Button',
          passProps: {
            navigator
          }
        }
      ]
    });
    this.state = { members: [], selected: false };
  }

  static getDerivedStateFromProps = (props, state) => {
    state.users = props.users;
    return state;
  }

  componentWillUnmount = () => {
    this.props.navigator.setDrawerEnabled({ side: 'left', enabled: true });
    this.props.navigator.toggleTabs({ to: 'shown', animated: true });
  }


    handleSelect = (data) => {
      if (this.props.single) return this.setState({ selected: data });
      let { members } = this.state;
      if (members.map(item => item.id).includes(data.id)) {
        members = members.filter(item => item.id !== data.id);
        return this.setState({ members });
      }
      members.push(data);
      this.setState({ members });
    }

    handleDone = () => {
      if (this.props.single) {
        // there has to be a reference object that the user will want to send as a message;
        if (!this.state.selected) return;
        return this.props.dispatch(startPersonalConversation([this.state.selected], this.props.reference)(this.props.navigator));
      }
      if (!this.state.members.length) return;
      this.props.dispatch(startPersonalConversation(this.state.members)(this.props.navigator));
    }

    _members = () => (this.state.members.length ? this.state.members.map(item => item.id) : []);

     renderItems = () => {
       const items = this.props.users.map(item => <SingleUser members={this._members()} selected={this.state.selected.id} handleSelect={this.handleSelect} data={item} obj={{ ...this.props }} />);
       return (
            <ScrollView style={{ height: height * 0.8, width }}>
                   { items }
                 </ScrollView>
       );
     }

  render = () => (
          <View style={{ flex: 1, paddingTop: 20, }}> 
            <Text 
                style={{
                fontSize: 14,
                fontWeight: '500',
                 color: defaultGreen,
                marginBottom: 20, 
                 paddingLeft: 20
            }}
            onPress={this.handleDone}
            > Done </Text>
            <View>
            { this.state.users.length ? this.renderItems() : null}
            </View>  
          </View>
    )
}

const SingleUser = ({
 data, members, selected, handleSelect 
}) => (
  <TouchableOpacity
      style={{
        height: height * 0.15,
        width,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        paddingLeft: 20,
        backgroundColor: members.includes(data.id) || selected === data.id ? '#F2F3F4' : 'white',
        paddingRight: 20,
        borderColor: '#D0D3D4',
        borderBottomWidth: 0.3,
        alignItems: 'center'
      }}
      onPress={() => { handleSelect(data); }}
    >
      <View style={{
        height: height * 0.05, width: width * 0.5, flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center'
      }}
      >
        <Image
          style={{
            height: 60, width: 60, borderRadius: 30, marginRight: 8,
          }}
          source={{ uri: (data.avatar || uri) }}
        />
        <View style={{ height: height * 0.06 }}>
          <Text style={{
            fontSize: 14, fontWeight: '600', color: '#1F2020', marginBottom: 5
          }}
          > 
{' '}
{ `${data.firstname || ''} ${data.lastname || ''}` }
          </Text>
          <Text style={{ fontSize: 12, fontWeight: '500', color: defaultGreen }}> 
{' '}
{`${data.username}`}
</Text>
        </View>
      </View>
      <View style={{ height: height * 0.05, width: width * 0.4 }}>
        <Text style={{
          fontSize: 11.5, fontWeight: '500', color: '#D0D3D4', alignSelf: 'flex-end'
        }}
        > 
{' '}
{ `${data.lga || ''}` }
        </Text>
      </View>
    </TouchableOpacity>
);

const mapStateToProps = state => ({
  users: state.users.followers
});
export default connect(mapStateToProps)(RenderGroupsOfUsers);