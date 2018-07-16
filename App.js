/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  View,
  StatusBar,
  Linking,
  AsyncStorage
} from 'react-native';
import SplashScreen from 'react-native-splash-screen'
import { Router, Scene, Drawer, Stack, Actions } from 'react-native-router-flux'
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator'
import Root from './src/components/Root'
import Loader from './src/components/auth/Loader'
import Login from './src/components/auth/Login'
import Main from './src/components/auth/Main'
import Forgot from './src/components/auth/Forgot'
import Register1 from './src/components/auth/Register1'
import Register2 from './src/components/auth/Register2'
import Interests from './src/components/auth/Interests'
import CandidateProfile from './src/components/candidates/CandidateProfile'
import Donations from './src/components/donations/Donations'
import DonationListing from './src/components/donations/DonationListing'
import DonationDetail from './src/components/donations/DonationDetail'
import Donate from './src/components/donations/Donate'
import Accepted from './src/components/donations/Accepted'
import Following from './src/components/user/Following'
import Followers from './src/components/user/Followers'
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
import Web from './src/components/Web'
import Benefits from './src/components/membership/Benefits'
import Subscribe from './src/components/membership/Subscribe'
import DrawerContent from './src/components/DrawerContent'
import Sessions from './src/components/debate/Sessions'
import { observer } from 'mobx-react/native'
import Chat from './src/components/chat/Chat'
import AllUsers from './src/components/user/AllUsers'
import ChatList from './src/components/chat/ChatList'
import NewPost from './src/components/feed/NewPost'
import Profile from './src/components/user/Profile'
import VoteDone from './src/components/elections/VoteDone'
import Posts from './src/components/feed/Posts'
import Upload from './src/components/survey/Upload'
import PartyMember from './src/components/membership/PartyMember'
import OtherProfile from './src/components/user/OtherProfile'
import accountStore from './src/stores/Account'


const prefix = 'youthparty://app/'

type Props = {};
@observer
export default class App extends Component<Props> {
  componentDidMount() {
    SplashScreen.hide()
    this.getData()
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
            <Scene key="loader" component={Loader} title="Loader" hideNavBar={true} />
            <Scene key="main" component={Main} title="Main" hideNavBar= {true} />
            <Scene key="login" component={Login} title="Login" hideNavBar= {true} />
            <Scene key="register1" component={Register1} title="Register1" hideNavBar= {true} />
            <Scene key="forgot" component={Forgot} title="Forgot" hideNavBar= {true} />
            <Scene key="register2" component={Register2} title="Register2" hideNavBar= {true} />
            <Scene key="interests" component={Interests} title="Event" hideNavBar= {true} />
            <Drawer
                hideNavBar
                key="drawer"
                contentComponent={DrawerContent}
                drawerWidth={300}>
              <Scene key="home" component={Root} title="Home" hideNavBar= {true} />
            </Drawer>
            <Scene key="posts" component={Posts} title="Posts" path={'posts'} hideNavBar= {true} />
            <Scene key="allusers" component={AllUsers} title="All Users" hideNavBar= {true} />
            <Scene key="chatlist" component={ChatList} title="Chat List" path={'chatlist'} hideNavBar= {true} />
            <Scene key="newpost" component={NewPost} title="New Post" path={'newpost'} hideNavBar= {true} />
            <Scene key="profile" component={Profile} title="Profile" path={'profile'} hideNavBar= {true} />
            <Scene key="chat" component={Chat} title="Chat" path={'chat'} hideNavBar= {true} />
            <Scene key="followers" component={Followers} title="Followers" hideNavBar= {true} />
            <Scene key="following" component={Following} title="Following" hideNavBar= {true} />
            <Scene key="careers" component={Careers} title="Careers" hideNavBar= {true} />
            <Scene key="vacancy" component={Vacancy} title="Vacancy" hideNavBar= {true} />
            <Scene key="candidates" component={Candidates} title="Candidates" hideNavBar= {true} />
            <Scene key="aspirants" component={Aspirants} title="Aspirants" hideNavBar= {true} />
            <Scene key="sponsored" component={SponsoredCandidates} title="Sponsored Candidates" hideNavBar= {true} />
            <Scene key="elected" component={ElectedOfficials} title="Elected Officials" hideNavBar= {true} />
            <Scene key="cp" component={CandidateProfile} title="Profile" hideNavBar= {true} />
            <Scene key="excos" component={Excos} title="Excos" hideNavBar= {true} />
            <Scene key="gallery" component={Gallery} title="Gallery" hideNavBar= {true} />
            <Scene key="events" component={Events} title="Events" hideNavBar= {true} />
            <Scene key="event" component={SingleEvent} title="Event" hideNavBar= {true} />
            <Scene key="contact" component={Contact} title="Contact" hideNavBar= {true} />
            <Scene key="web" component={Web} title="Web" hideNavBar= {true} />
            <Scene key="subscribe" component={Subscribe} title="Subscribe" hideNavBar= {true} />
            <Scene key="benefits" component={Benefits} title="Benefits" hideNavBar= {true} />
            <Scene key="debate" component={Sessions} title="Debates" hideNavBar= {true} />
            <Scene key="otherprofile" component={OtherProfile} title="User Profile" hideNavBar />
            <Scene key="voteDone" component={VoteDone} title="User Profile" hideNavBar />
            <Scene key="partymember" component={PartyMember} title="Party Member" hideNavBar />
            <Scene key="upload" component={Upload} title="Upload" />
            <Scene key="donations" component={Donations} title="Donations" hideNavBar />
            <Scene key="donationDetail" component={DonationDetail} title="Donation Detail" hideNavBar />
            <Scene key="donationListing" component={DonationListing} title="Donation Listing" hideNavBar />
            <Scene key="donate" component={Donate} title="Donate" hideNavBar />
            <Scene key="accepted" component={Accepted} title="Accepted" hideNavBar />
          </Scene>
        </Router>
    </View>
    );
  }
}

