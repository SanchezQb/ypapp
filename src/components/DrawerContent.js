import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, ViewPropTypes, Image, TouchableOpacity, Alert, AsyncStorage,ScrollView  } from 'react-native';
import { Container, Content, List, ListItem, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux'
import accountStore from '../stores/Account'


export default class DrawerContent extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    sceneStyle: ViewPropTypes.style,
    title: PropTypes.string,
  }

  static contextTypes = {
    drawer: PropTypes.object,
  }

  logout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => this.logoutHandler()},
      ],
      { cancelable: false }
    )
  }

  logoutHandler = () => {
    AsyncStorage.removeItem('allUserData')
    Actions.main()
  }

  userProfile = (avatar) => {
    if(avatar == null || avatar == '') {
        return (
            <Image source={require('./avatar.jpg')} style={styles.dp}/>
        )
    }
    else {
        return (
            <Image source={{uri: avatar}} style={styles.dp}/>
        )
    }
}
    renderName = () => {
        if(accountStore.user.lastname == null) {
            return (
                <Text style={{color: '#fff', fontSize: 14}}>
                    {`${accountStore.user.firstname}`}
                </Text>
            )
        }
        else {
            return (
                <Text style={{color: '#fff', fontSize: 14}}>
                    {`${accountStore.user.firstname} ${accountStore.user.lastname}`}
                </Text>
            )
        }
    }

  render() {
    return (
      <View style={styles.container}>
        <Container>
            <View style={styles.span}>
                <List style={styles.list}>
                    <ListItem style={styles.listitem}>
                        <TouchableOpacity style={styles.dpcont}>
                            {this.userProfile(accountStore.user.avatar)}
                        </TouchableOpacity>
                        <View style={styles.bioCont}>
                           {this.renderName()}
                            <Text style={{color: '#fff', fontSize: 14}}>
                               {`Ward ${accountStore.user.ward} | ${accountStore.user.lga} LGA`}
                            </Text>
                        </View>
                    </ListItem>
                </List>
            </View>
            <Content style={styles.content}>
                <ScrollView>
                <List>
                    <ListItem style={styles.listitem} onPress={() => Actions.benefits()}>
                        <Icon name="md-star-outline" style={{color: '#000'}} />
                        <Text style={styles.link}>Membership</Text>
                    </ListItem>
                    <ListItem style={styles.listitem}>
                        <Icon name="md-people" style={{color: '#000'}} />
                        <Text style={styles.link}>Groups</Text>
                    </ListItem>
                    <ListItem style={styles.listitem}>
                        <Icon name="ios-paper-outline" style={{color: '#000'}} />
                        <Text style={styles.link}>Constitution</Text>
                    </ListItem>
                    <ListItem style={styles.listitem}>
                        <Icon name="md-information-circle" style={{color: '#000'}} />
                        <Text style={styles.link}>About Us</Text>
                    </ListItem>
                    <ListItem style={styles.listitem} onPress={() => Actions.contact()}>
                        <Icon name="md-mail" style={{color: '#000'}} />
                        <Text style={styles.link}>Contact Us</Text>
                    </ListItem>
                    <ListItem style={styles.listitem}>
                        <Icon name="md-settings" style={{color: '#000'}} />
                        <Text style={styles.link}>Settings</Text>
                    </ListItem>
                    <ListItem style={styles.listitem} onPress={() => this.logout()}>
                        <Icon name="md-exit" style={{color: '#000'}} />
                        <Text style={styles.link}>Log Out</Text>
                    </ListItem>
                </List>
                </ScrollView>
            </Content>
        </Container>
      </View >
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        borderWidth: 2,
    
      },
      content: {
        backgroundColor: '#fff'
      },
      listitem: {
          borderBottomWidth: 0
      },
      link: {
          marginLeft: 15,
          fontSize: 18,
          color: '#222'
      },
      span: {
          height: 200,
          backgroundColor: '#000',
      },
      dpcont: {
        backgroundColor: '#ccc',
        height: 90,
        borderRadius: 45,
        width: 90,
    },
    dp: {
        height: 90,
        borderRadius: 45,
        width: 90,
    },
    bioCont: {
        marginLeft: 12
    },
    list: {
        marginTop: 30
    }
});
