import React, {Component} from "react";
import {Animated, Dimensions, Text, StyleSheet, TouchableOpacity, StatusBar, View, Image, ActivityIndicator, BackHandler,ToastAndroid, NativeModules, findNodeHandle } from "react-native";
import {Body, Header, ScrollableTab, Tab, Icon, TabHeading, Tabs, StyleProvider, Left, Right, Button, Title, Fab} from "native-base";
import { Actions } from 'react-native-router-flux'
import accountStore from '../../stores/Account';
import messagingStore from '../../stores/Messaging'
import OtherPosts from './OtherPosts'
import axios from 'axios'
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'

const UIManager = NativeModules.UIManager;
const {width: SCREEN_WIDTH} = Dimensions.get("window");
const IMAGE_HEIGHT = 300;
const HEADER_HEIGHT = 50;
const SCROLL_HEIGHT = IMAGE_HEIGHT - HEADER_HEIGHT;
const THEME_COLOR = "#82BE30";
const FADED_THEME_COLOR = "rgb(130,190,48)";

export default class OtherProfile extends Component {
  nScroll = new Animated.Value(0);
  scroll = new Animated.Value(0);
  textColor = this.scroll.interpolate({
    inputRange: [0, SCROLL_HEIGHT / 5, SCROLL_HEIGHT],
    outputRange: [THEME_COLOR, FADED_THEME_COLOR, "white"],
    extrapolate: "clamp"
  });
  tabBg = this.scroll.interpolate({
    inputRange: [0, SCROLL_HEIGHT],
    outputRange: ["white", THEME_COLOR],
    extrapolate: "clamp"
  });
  tabY = this.nScroll.interpolate({
    inputRange: [0, SCROLL_HEIGHT, SCROLL_HEIGHT + 1],
    outputRange: [0, 0, 1]
  });
  headerBg = this.scroll.interpolate({
    inputRange: [0, SCROLL_HEIGHT, SCROLL_HEIGHT + 1],
    outputRange: ["transparent", "transparent", THEME_COLOR],
    extrapolate: "clamp"
  });
  imgScale = this.nScroll.interpolate({
    inputRange: [-25, 0],
    outputRange: [1.1, 1],
    extrapolateRight: "clamp"
  });
  imgOpacity = this.nScroll.interpolate({
    inputRange: [0, SCROLL_HEIGHT],
    outputRange: [1, 0],
  });
  tabContent = (x, i) => <View style={{height: this.state.height}}>
    <List onLayout={({nativeEvent: {layout: {height}}}) => {
      this.heights[i] = height;
      if (this.state.activeTab === i) this.setState({height})
    }}>
      {new Array(x).fill(null).map((_, i) => <Item key={i}><Text>Item {i}</Text></Item>)}
    </List></View>;
  heights = [500, 500];
  
  constructor(props) {
    super(props);
    this.nScroll.addListener(Animated.event([{value: this.scroll}], {useNativeDriver: false}));
    this.state = {
        isLoading: true,
        user: {},
        text: 'Follow',
        activeTab: 0,
        height: 500,
    }
    this.baseState = this.state
  }

  componentDidMount() {
    this.getUserProfile()
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }
  componentWillUnmount () {
      messagingStore.fetchAllConversations()
      BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress () {
      Actions.pop()
      return true
  }
  onMenuPressed = (labels) => {
    const { onPress } = this.props;
    UIManager.showPopupMenu (
        findNodeHandle(this.menu),
        ["Edit Profile"],
        () => {},
        (result, index) => {
        if (index == 0) {
          Actions.drawerOpen()
        }
      },
    );
  };
  getUserProfile = async () => {
    await axios({
      url: `https://ypn-base.herokuapp.com/profile/${this.props.data}`, 
      method: 'GET', 
      headers: {
          "Content-Type": "application/json",
          "Authorization": `${accountStore.user.token}`
      },
  })
  .then(res => {
      this.setState({
          user: res.data,
          isLoading: false
      })
  })
  .catch(error => {
      console.log(error.response.data)
      this.setState({
          isLoading: false,
          error: true
      })
  })
}
reset = () => {
    this.setState(this.baseState)
    this.getUserProfile()
}
userProfile = (avatar) => {
    if(avatar == null || avatar == '') {
        return (
            <Image source={require('../avatar.jpg')} style={styles.dp}/>
        )
    }
    else {
        return (
            <Image source={{uri: avatar}} style={styles.dp}/>
        )
    }
}
follow = (user) => {
    this.setState({text: 'Following'})
    axios({
        url: `https://ypn-base.herokuapp.com/follow/${user.id}`, 
        method: 'POST', 
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${accountStore.user.token}`
        },
    })
    .then(response => {
        this.setState({text: "Following"})
        ToastAndroid.show(`Now following ${user.firstname}`, ToastAndroid.SHORT)
    })
    .catch(err => {
        this.setState({text: 'Follow'})
        console.log(err.response.data)
    })
}
  render() {
    const { labels } = this.props;
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
            <Text style={{color: '#444'}}>Could not load User Profile</Text>
            <Text></Text>
            <Text></Text>
            <Button style={{backgroundColor: '#82BE30', alignSelf: 'center'}}onPress={() => {this.reset()}}>
                <Text>Retry</Text>
            </Button>
          </View>
          
        )
    }
    return (
      <StyleProvider style={getTheme(material)}>
        <React.Fragment>
        <View>
          <Animated.View style={{position: "absolute", width: "100%", backgroundColor: this.headerBg, zIndex: 1}}>
            <StatusBar
                backgroundColor="#82BE30"
            />
            <Header noShadow hasTabs>
                <Left>
                    <Button transparent onPress={() => Actions.pop()}>
                        <Icon name="arrow-back" style={{color: '#fff'}}/>
                    </Button>
                </Left>
                <Body>
                    <Title>Profile</Title>
                </Body>
                <Right>
                  <Button transparent  onPress={() => this.onMenuPressed(labels)}>
                    <View style={{flexDirection: 'row'}}>
                        <View>
                          <View
                              ref={c => this.menu = c}
                              style={{
                                  backgroundColor: 'transparent',
                                  width: 1,
                                  height: StyleSheet.hairlineWidth,
                              }}
                          />
                            <Icon
                              name="md-more"
                              style={{color: 'white' }}
                            />
                        </View>
                    </View>
                  </Button>
                </Right>
            </Header>
          </Animated.View>
          <Animated.ScrollView
            scrollEventThrottle={5}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.nScroll}}}], {useNativeDriver: true})}
            style={{zIndex: 0}}>
              <Animated.View style={{
                transform: [{translateY: Animated.multiply(this.nScroll, 0.65)}, {scale: this.imgScale}],
                backgroundColor: THEME_COLOR
              }}>
                <Animated.View
                  style={{height: IMAGE_HEIGHT, width: "100%", opacity: this.imgOpacity}}>
                  <View style={{backgroundColor: '#fff', marginTop: 10, height: 300, borderColor: '#f2f2f2', borderBottomWidth: 2}}>
                    <View style={styles.dpView}>
                      <TouchableOpacity style={styles.dpcont}>
                        {this.userProfile(this.state.user.data.avatar)}
                      </TouchableOpacity>
                      <View style={styles.profile}>
                            <Text style={{fontWeight: 'bold', fontSize: 16, color: '#fff'}}>
                                {`${this.state.user.data.firstname} ${this.state.user.data.lastname}`}
                            </Text>
                            <Text style={{fontSize: 16, color: '#fff'}}>
                                {`Ward ${this.state.user.data.ward} | ${this.state.user.data.lga} LGA`}
                            </Text>
                            <Text style={{fontSize: 16, color: '#fff'}}>
                                {`${this.state.user.data.state} State`}
                            </Text>
                        </View>
                    </View>
                      <View style={{top: 30, backgroundColor: '#fff'}}>
                        <View style={styles.bio}>
                            <Text style={{fontSize: 14, color: '#555'}}>Philosopher | Human Rights Activist.
                            I believe in an urgent restoration of active and participatory democracy, social justice
                            and good leadership
                            </Text>
                        </View>
                        <View style={styles.CardItem}>
                            <TouchableOpacity style={styles.touchable} onPress={() => Actions.followers({data: this.state.user.followers})}>
                                <Text style={{color: '#555', fontSize: 12, textAlign: 'center'}}>{`${this.state.user.friends.length} Followers`}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.touchable} onPress={() => Actions.following({data: this.state.user.friends})}>
                                <Text style={{color: '#555', fontSize: 12, textAlign: 'center'}}>{`${this.state.user.friends.length} Following`}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.follow(this.state.user.data)}style={styles.touchableMessage}>
                                <Text style={{color: '#fff', fontSize: 12, textAlign: 'center'}}>{this.state.text}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                  </View>
                </Animated.View>
              </Animated.View>
              <Tabs
                prerenderingSiblingsNumber={3}
                onChangeTab={({i}) => {
                  this.setState({height: this.heights[i], activeTab: i})
                }}
                renderTabBar={(props) => <Animated.View
                  style={{transform: [{translateY: this.tabY}], zIndex: 1, width: "100%", backgroundColor: "white"}}>
                  <ScrollableTab {...props}
                    renderTab={(name, page, active, onPress, onLayout) => (
                      <TouchableOpacity key={page}
                        onPress={() => onPress(page)}
                        onLayout={onLayout}
                        activeOpacity={0.4}>
                        <Animated.View
                          style={{
                            flex: 1,
                            height: 100,
                            backgroundColor: this.tabBg
                          }}>
                          <TabHeading
                            style={{
                                  marginTop: 7,
                              backgroundColor: "transparent",
                              width: SCREEN_WIDTH / 2
                            }}
                            active={active}>
                            <Animated.Text style={{
                              fontWeight: active ? "bold" : "normal",
                              color: this.textColor,
                              fontSize: 14
                            }}>
                              {name}
                            </Animated.Text>
                          </TabHeading>
                        </Animated.View>
                      </TouchableOpacity>
                    )}
                    underlineStyle={{backgroundColor: this.textColor}}/>
                </Animated.View>
                }>
                <Tab heading="Recent Posts">
                    <OtherPosts userId={this.state.user.data.id}/>
                </Tab>
                <Tab heading="Events">
                    <OtherPosts userId={this.state.user.data.id}/>
                </Tab>
              </Tabs>
          </Animated.ScrollView>
        </View>
        <Fab
            style={{ backgroundColor: '#82BE30' }}
            position="bottomRight"
            onPress={() => messagingStore.startPersonalConversation([this.state.user.data])}>
            <Icon name="mail" />
          </Fab>
        </React.Fragment>
      </StyleProvider>
    )
  }
}
const styles = StyleSheet.create({
  dpView: {
    backgroundColor: '#82BE30',
    width: '100%',
    alignSelf: 'center',
    top: 40,
    marginBottom: 10,
    flexDirection: 'row',
    padding: 20,
  },
  dpcont: { 
      height: 70,
      borderRadius: 35,
      width: 70
  },
  dp: {
      height: 70,
      borderRadius: 35,
      width: 70
  },
  profile: {
      marginLeft: 10,
      width: '90%',
      alignSelf: 'center',
  },
  bio: {
      marginTop: 10,
      width: '90%',
      alignSelf: 'center',
  },
  CardItem: {
      width: '90%',
      alignSelf: 'center',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'space-between',
      height: 50,
      marginTop: 10,
      marginBottom: 5
  },
  touchable: {
      paddingVertical: 4,
      height: 28,
      paddingHorizontal: 4,
      borderRadius: 2,
      borderColor: '#a6a6a6',
      borderWidth: 1,
      width: 90
  },
  touchableMessage: {
      paddingVertical: 4,
      height: 28,
      paddingHorizontal: 4,
      borderRadius: 2,
      backgroundColor: '#82BE30',
      width: 90
  }
})