import * as React from 'react';
import {
  Animated,
  View,
  TouchableWithoutFeedback,
  StyleSheet, StatusBar, Dimensions, Text
} from 'react-native';
import { TabViewAnimated, SceneMap } from 'react-native-tab-view';
import { Icon } from 'native-base'
import Posts from './feed/Posts'
import ChatList from './chat/ChatList'
import NewPost from './feed/NewPost'
import Profile from './user/Profile'
import More from './More'
import { observer } from 'mobx-react/native'


import type { Route, NavigationState } from 'react-native-tab-view/types';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

type State = NavigationState<
  Route<{
    key: string,
    title: string,
    icon: string,
  }>
>;

@observer
export default class TopBarIconExample extends React.Component<*, State> {
  static title = 'No animation';
  static backgroundColor = '#000000';
  static tintColor = '#263238';
  static appbarElevation = 4;
  static statusBarStyle = 'dark-content';

  state = {
    index: 0,
    show: false,
    routes: [
      { key: 'home', title: 'Home', icon: 'ios-home-outline' },
      { key: 'chat', title: 'Chat', icon: 'ios-chatboxes-outline' },
      { key: 'post', title: 'Post', icon: 'md-add-circle' },
      { key: 'profile', title: 'Profile', icon: 'ios-person-outline' },
    ],
  };

  _handleIndexChange = index =>
    this.setState({
      index,
    });
    toggleStatus = () => {
      this.setState({
          show: !this.state.show
      })
  }

  _renderLabel = ({ position, navigationState }) => ({ route, index }) => {
    const inputRange = navigationState.routes.map((x, i) => i);
    const outputRange = inputRange.map(
      inputIndex => (inputIndex === index ? '#F0BA00' : '#FFFFFF')
    );
    const color = position.interpolate({
      inputRange,
      outputRange,
    });
    return (
      <Animated.Text style={[styles.label, { color }]}>
        {route.title}
      </Animated.Text>
    );
  };

  _renderIcon = ({ navigationState, position }) => ({ route, index }) => {
    const inputRange = navigationState.routes.map((x, i) => i);
    const filledOpacity = position.interpolate({
      inputRange,
      outputRange: inputRange.map(i => (i === index ? 1 : 0)),
    });
    const outlineOpacity = position.interpolate({
      inputRange,
      outputRange: inputRange.map(i => (i === index ? 0 : 1)),
    });
    
    return (
      <View style={styles.iconContainer}>
        <AnimatedIcon
          name={route.icon}
          size={26}
          style={[styles.icon, { opacity: filledOpacity }]}
        />
        <AnimatedIcon
          name={route.icon}
          size={26}
          style={[styles.icon, styles.outline, { opacity: outlineOpacity }]}
        />
      </View>
    );
  };

  _renderFooter = props => (
    <View style={styles.tabbar}>
      {props.navigationState.routes.map((route, index) => {
        return (
          <TouchableWithoutFeedback
            key={route.key}
            onPress={() => props.jumpTo(route.key)}
          >
            <Animated.View style={styles.tab}>
              {this._renderIcon(props)({ route, index })}
              {this._renderLabel(props)({ route, index })}
            </Animated.View>
          </TouchableWithoutFeedback>
        );
      })}
        <TouchableWithoutFeedback
            onPress={() => {this.toggleStatus()}}
          >
            <Animated.View style={styles.tab}>
              <Icon name="md-apps" style={[styles.notSelectedIcon, this.state.show && styles.selectedIcon]}/>
              <Text style={[styles.notSelected, this.state.show && styles.selected]}>More</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
    </View>
  );

  _renderScene = SceneMap({
    home: Posts,
    chat: ChatList,
    post: NewPost,
    profile: Profile,
  });

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar translucent={false} />
        <View style={[styles.moreHide, this.state.show && styles.moreShow]}>
          <More />
        </View>
        <TabViewAnimated
            style={[styles.container, this.props.style]}
            navigationState={this.state}
            renderScene={this._renderScene}
            renderFooter={this._renderFooter}
            onIndexChange={this._handleIndexChange}
            animationEnabled={false}
            swipeEnabled={false}
            initialLayout={initialLayout}
        />
      </View>
    );
  }
}
const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#000000',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, .2)',
    paddingTop: 4.5,
  },
  iconContainer: {
    height: 26,
    width: 26,
  },
  icon: {
    position: 'absolute',
    textAlign: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    color: '#F0BA00',
  },
  outline: {
    color: '#ffffff',
  },
  label: {
    fontSize: 12,
    marginVertical: 6,
    backgroundColor: 'transparent',
  },
  moreShow: {
    height: 180, 
    position: 'absolute', 
    bottom: 55, 
    zIndex: 1, backgroundColor: 'rgba(0,0,0,0.8)',
    width: '100%',
  },
  moreHide: {
    display: 'none'
  },
  notSelectedIcon: {
    fontSize: 26,
    color: '#fff'
  },
  selectedIcon: {
    fontSize: 26,
    color: '#F0BA00'
  },
  notSelected: {
    color: '#fff',
    fontSize: 12,
    marginTop: 6
  },
  selected: {
    color: '#F0BA00',
    fontSize: 12,
    marginTop: 6
  }
});