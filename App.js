/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  View,
  StatusBar,
  AsyncStorage,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen'
import { Router, Scene, Drawer, Actions } from 'react-native-router-flux'
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator'
import axios from 'axios'
import Root from './src/components/Root'
import Loader from './src/components/auth/Loader'
import Login from './src/components/auth/Login'
import Main from './src/components/auth/Main'
import Forgot from './src/components/auth/Forgot'
import Register1 from './src/components/auth/Register1'
import Register2 from './src/components/auth/Register2'
import CandidateProfile from './src/components/candidates/CandidateProfile'
import RunForOffice from './src/components/candidates/RunForOffice'
import AspirantProfile from './src/components/candidates/AspirantProfile'
import Donations from './src/components/donations/Donations'
import DonationListing from './src/components/donations/DonationListing'
import DonationDetail from './src/components/donations/DonationDetail'
import Donate from './src/components/donations/Donate'
import Accepted from './src/components/donations/Accepted'
import Following from './src/components/user/Following'
import Followers from './src/components/user/Followers'
import EditProfile from './src/components/user/EditProfile'
import Careers from './src/components/careers/Careers'
import Vacancy from './src/components/careers/Vacancy'
import Candidates from './src/components/candidates/Candidates'
import Aspirants from './src/components/candidates/Aspirants'
import SponsoredCandidates from './src/components/candidates/SponsoredCandidates'
import ElectedOfficials from './src/components/candidates/ElectedOfficials'
import Excos from './src/components/candidates/Excos'
import Gallery from './src/components/gallery/Gallery'
import Events from './src/components/events/Events'
import SingleEvent from './src/components/events/Event'
import Contact from './src/components/Contact'
import Benefits from './src/components/membership/Benefits'
import Subscribe from './src/components/membership/Subscribe'
import DrawerContent from './src/components/DrawerContent'
import Sessions from './src/components/debate/Sessions'
import { observer } from 'mobx-react/native'
import Chat from './src/components/chat/Chat'
import AllUsers from './src/components/user/AllUsers'
import VoteDone from './src/components/elections/VoteDone'
import Eligibility from './src/components/elections/Eligibility'
import Elections from './src/components/elections/Elections'
import SelectCandidate from './src/components/elections/SelectCandidate'
import Results from './src/components/elections/Results'
import PartyMember from './src/components/membership/PartyMember'
import OtherProfile from './src/components/user/OtherProfile'
import About from './src/components/about/About'
import PdfView from './src/components/about/PdfView'
import Posts from './src/components/feed/Posts'
import Post from './src/components/feed/Post'
import ReactionList from './src/components/feed/ReactionList'
import Search from './src/components/search/Search'
import ImageSwiper from './src/components/feed/ImageSwiper'
import Survey from './src/components/survey/Survey'
import SelectChoice from './src/components/survey/SelectChoice'
import Townhalls from './src/components/townhalls/Townhalls'
import Groups from './src/components/groups/Groups'
import ShareTo from './src/components/feed/ShareTo'
import Settings from './src/components/settings/Settings'
import Newsletter from './src/components/settings/Newsletter'
import NewChat from './src/components/chat/NewChat'
import OneSignal from 'react-native-onesignal'
import Notifications from './src/components/feed/Notifications'
import accountStore from './src/stores/Account'
import notificationStore from './src/stores/Notifications'
import SinglePost from './src/components/feed/SinglePost'
import messagingStore from './src/stores/Messaging';
import Config from './src/config'

const prefix = 'youthparty://app/'

type Props = {};

@observer
export default class App extends Component<Props> {

  componentWillMount() {
    OneSignal.init("19c93878-1c4e-4fd7-b8ad-7ddf9eebc81d");
    OneSignal.addEventListener('ids', this.handleFetchIds)
    OneSignal.addEventListener('received',this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.inFocusDisplaying(0)
    OneSignal.configure()
  }
  componentDidMount() {
    SplashScreen.hide()
    this.getData()
  }

  handleFetchIds = async (device) => {
    if(!device.userId) return 
    const { token } = JSON.parse(await AsyncStorage.getItem('allUserData'));
     axios({
      url: `${Config.realTimeUrl}/register`,
      method: 'POST',
      data: {
        playerId: device.userId
      },
      headers: {
        Authorization: token
      }
    }).then((response) => {
      AsyncStorage.setItem('OnesignalPlayerId', response.data.data)
    }).catch((err) => {
      console.log(err.response.data)
    })
  }

  onReceived = (notification) => {
    notificationStore.fetchNotifications()
  }

  onOpened = (notification) => {
    if(notification.notification.payload.body.toLowerCase().match(/message/)) {
      messagingStore.setIndex()
    }
    else {
      Actions.notifications
    }
  }

  getData = async () => {
    try {
        let userData = await AsyncStorage.getItem('allUserData')
        let parsed = JSON.parse(userData)
        if(userData !== null) {
            accountStore.getUserDataFromStorage(parsed)
            Actions.home()
        }
        else {
            Actions.main()
        }
        
    }
    catch(error) {
        alert("Error fetching data")
    }   
}

  render() {
    return (
      <View style={{flex: 1,}}>
        <StatusBar
          backgroundColor="#689826"
        />
        <Router uriPrefix={prefix} wrapBy={observer} sceneStyle={{backgroundColor: '#fff'}}>
          <Scene key="root" transitionConfig={() => ({ screenInterpolator: CardStackStyleInterpolator.forFadeFromBottomAndroid })}>
            <Scene key="loader" component={Loader} hideNavBar={true} />
            <Scene key="main" component={Main} hideNavBar />
            <Scene key="login" component={Login} hideNavBar />
            <Scene key="register1" component={Register1} hideNavBar />
            <Scene key="forgot" component={Forgot} hideNavBar />
            <Scene key="register2" component={Register2} hideNavBar />
            <Drawer
                hideNavBar
                key="drawer"
                contentComponent={DrawerContent}
                drawerWidth={300}>
              <Scene key="home" component={Root} title="Home" hideNavBar />
              <Scene key="posts" component={Posts} hideNavBar />
            </Drawer>
            <Scene key="allusers" component={AllUsers} hideNavBar />
            <Scene key="chat" component={Chat} hideNavBar />
            <Scene key="followers" component={Followers} hideNavBar />
            <Scene key="following" component={Following} hideNavBar />
            <Scene key="careers" component={Careers} hideNavBar />
            <Scene key="vacancy" component={Vacancy} hideNavBar />
            <Scene key="candidates" component={Candidates} hideNavBar />
            <Scene key="aspirants" component={Aspirants} hideNavBar />
            <Scene key="sponsored" component={SponsoredCandidates} hideNavBar />
            <Scene key="elected" component={ElectedOfficials} hideNavBar />
            <Scene key="cp" component={CandidateProfile} hideNavBar />
            <Scene key="ap" component={AspirantProfile} hideNavBar />
            <Scene key="excos" component={Excos} hideNavBar />
            <Scene key="gallery" component={Gallery} hideNavBar />
            <Scene key="events" component={Events} hideNavBar />
            <Scene key="event" component={SingleEvent} hideNavBar />
            <Scene key="contact" component={Contact} hideNavBar />
            <Scene key="subscribe" component={Subscribe} hideNavBar />
            <Scene key="benefits" component={Benefits} hideNavBar />
            <Scene key="debate" component={Sessions} hideNavBar />
            <Scene key="otherprofile" component={OtherProfile} hideNavBar />
            <Scene key="voteDone" component={VoteDone} hideNavBar />
            <Scene key="partymember" component={PartyMember} hideNavBar />
            <Scene key="donations" component={Donations} hideNavBar />
            <Scene key="donationDetail" component={DonationDetail} hideNavBar />
            <Scene key="donationListing" component={DonationListing}hideNavBar />
            <Scene key="donate" component={Donate} hideNavBar />
            <Scene key="accepted" component={Accepted} hideNavBar />
            <Scene key="elections" component={Elections} hideNavBar />
            <Scene key="selectCandidate" component={SelectCandidate} hideNavBar />
            <Scene key="about" component={About} hideNavBar />
            <Scene key="pdfView" component={PdfView} hideNavBar />
            <Scene key="eligibility" component={Eligibility} hideNavBar />
            <Scene key="post" component={Post} hideNavBar />
            <Scene key="reactionList" component={ReactionList} hideNavBar />
            <Scene key="imageSwiper" component={ImageSwiper} hideNavBar />
            <Scene key="editProfile" component={EditProfile} hideNavBar />
            <Scene key="survey" component={Survey} hideNavBar />
            <Scene key="selectChoice" component={SelectChoice} hideNavBar />
            <Scene key="townhalls" component={Townhalls} hideNavBar />
            <Scene key="groups" component={Groups} hideNavBar />
            <Scene key="shareTo" component={ShareTo} hideNavBar />
            <Scene key="settings" component={Settings} hideNavBar />
            <Scene key="newsletter" component={Newsletter} hideNavBar />
            <Scene key="newChat" component={NewChat} hideNavBar />
            <Scene key="notifications" component={Notifications} hideNavBar />
            <Scene key="singlePost" component={SinglePost} hideNavBar />
            <Scene key="search" component={Search} hideNavBar />
            <Scene key="results" component={Results} hideNavBar />
            <Scene key="runforoffice" component={RunForOffice} hideNavBar />
          </Scene>
        </Router>
    </View>
    );
  }
}

