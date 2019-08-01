import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, ViewPropTypes, Image, TouchableOpacity, Alert, AsyncStorage,ScrollView, Linking, Share  } from 'react-native';
import { Container, Content, List, ListItem, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux'
import accountStore from '../stores/Account'
import { observer } from 'mobx-react/native'

@observer
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
    AsyncStorage.removeItem('OnesignalPlayerId')
    Actions.main()
  }

  shareApp = () => {
    Share.share({
        message: "Join Youth Party in shaping the future.Download our mobile app for android here >> https://play.google.com/store/apps/details?id=com.youthparty"
      })
      .then((result) => console.log(result))
      .catch(err => console.log(err))
  }

  userProfile = (avatar) => {
    if(avatar == null || avatar == '') {
        return (
            <Image source={require('./logo.png')} resizeMode="center" style={styles.dp}/>
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
    openManual = () => {
        Linking.openURL('https://youthpartyng.com/wp-content/uploads/2015/10/YP-App-Manual.pdf').catch(err => console.log(err))
    }

  render() {
    return (
      <View style={styles.container}>
        <Container>
            <View style={styles.span}>
                <List style={styles.list}>
                    <View style={styles.listitem}>
                        <TouchableOpacity style={styles.dpcont}>
                            {this.userProfile(accountStore.user.avatar)}
                        </TouchableOpacity>
                        <View style={styles.bioCont}>
                           {this.renderName()}
                            <Text style={{color: '#fff', fontSize: 14}}>
                               {`Ward ${accountStore.user.ward} | ${accountStore.user.lga} LGA | ${accountStore.user.state} State`}
                            </Text>
                        </View>
                    </View>
                </List>
            </View>
            <Content style={styles.content}>
                <ScrollView>
                <List>{accountStore.user.role == 1 ?
                        <ListItem style={styles.listitem} onPress={() => Actions.partymember()}>
                            <Icon name="md-star-outline" style={{color: '#000'}} />
                            <Text style={styles.link}>Membership</Text>
                        </ListItem>
                    : 
                    <ListItem style={styles.listitem} onPress={() => Actions.benefits()}>
                        <Icon name="md-star-outline" style={{color: '#000'}} />
                        <Text style={styles.link}>Membership</Text>
                    </ListItem>
                    }
                    <ListItem onPress={() => Actions.groups()} style={styles.listitem}>
                        <Icon name="md-people" style={{color: '#000'}} />
                        <Text style={styles.link}>Groups</Text>
                    </ListItem>
                    <ListItem onPress={() => Actions.pdfView({data: 'Constitution'})}style={styles.listitem}>
                        <Icon name="ios-paper-outline" style={{color: '#000'}} />
                        <Text style={styles.link}>Constitution</Text>
                    </ListItem>
                    <ListItem onPress={() => Actions.eligibility()}style={styles.listitem}>
                        <Icon name="ios-checkmark-circle" style={{color: '#000'}} />
                        <Text style={styles.link}>Voter Eligibility</Text>
                    </ListItem>
                    <ListItem onPress={() => Actions.about()} style={styles.listitem}>
                        <Icon name="md-information-circle" style={{color: '#000'}} />
                        <Text style={styles.link}>About Us</Text>
                    </ListItem>
                    <ListItem style={styles.listitem} onPress={() => this.openManual()}>
                        <Icon name="ios-paper-outline" style={{color: '#000'}} />
                        <Text style={styles.link}>App Manual</Text>
                    </ListItem>
                    <ListItem style={styles.listitem} onPress={() => Actions.contact()}>
                        <Icon name="md-mail" style={{color: '#000'}} />
                        <Text style={styles.link}>Contact Us</Text>
                    </ListItem>
                    <ListItem style={styles.listitem} onPress={() => this.shareApp()}>
                        <Icon name="md-share" style={{color: '#000'}} />
                        <Text style={styles.link}>Share App</Text>
                    </ListItem>
                    <ListItem style={styles.listitem} onPress={() => Actions.settings()}>
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
        justifyContent: 'center',
        marginLeft: 12,
        backgroundColor: '#f2f2f2',
        height: 80,
        borderRadius: 40,
        width: 80,
        marginBottom: 10,
        alignItems: 'center'
    },
    dp: {
        height: 75,
        borderRadius: 37.5,
        width: 75,
        alignSelf: 'center'
    },
    bioCont: {
        marginLeft: 12
    },
    list: {
        marginTop: 30
    }
});
