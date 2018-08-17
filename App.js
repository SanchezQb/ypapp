/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  View,
  StatusBar,
  AsyncStorage
} from 'react-native';
import SplashScreen from 'react-native-splash-screen'
import { Router, Scene, Drawer, Actions } from 'react-native-router-flux'
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
import PartyMember from './src/components/membership/PartyMember'
import OtherProfile from './src/components/user/OtherProfile'
import About from './src/components/about/About'
import PdfView from './src/components/about/PdfView'
import AddComment from './src/components/feed/AddComment'
import Post from './src/components/feed/Post'
import ReactionList from './src/components/feed/ReactionList'
import ImageSwiper from './src/components/feed/ImageSwiper'
import Survey from './src/components/survey/Survey'
import SelectChoice from './src/components/survey/SelectChoice'

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
            <Scene key="main" component={Main} title="Main" hideNavBar />
            <Scene key="login" component={Login} title="Login" hideNavBar />
            <Scene key="register1" component={Register1} title="Register1" hideNavBar />
            <Scene key="forgot" component={Forgot} title="Forgot" hideNavBar />
            <Scene key="register2" component={Register2} title="Register2" hideNavBar />
            <Scene key="interests" component={Interests} title="Event" hideNavBar />
            <Drawer
                hideNavBar
                key="drawer"
                contentComponent={DrawerContent}
                drawerWidth={300}>
              <Scene key="home" component={Root} title="Home" hideNavBar />
            </Drawer>
            <Scene key="allusers" component={AllUsers} title="All Users" hideNavBar />
            <Scene key="chat" component={Chat} title="Chat" path={'chat/:id'} hideNavBar />
            <Scene key="followers" component={Followers} title="Followers" hideNavBar />
            <Scene key="following" component={Following} title="Following" hideNavBar />
            <Scene key="careers" component={Careers} title="Careers" hideNavBar />
            <Scene key="vacancy" component={Vacancy} title="Vacancy" hideNavBar />
            <Scene key="candidates" component={Candidates} title="Candidates" hideNavBar />
            <Scene key="aspirants" component={Aspirants} title="Aspirants" hideNavBar />
            <Scene key="sponsored" component={SponsoredCandidates} title="Sponsored Candidates" hideNavBar />
            <Scene key="elected" component={ElectedOfficials} title="Elected Officials" hideNavBar />
            <Scene key="cp" component={CandidateProfile} title="Profile" hideNavBar />
            <Scene key="excos" component={Excos} title="Excos" hideNavBar />
            <Scene key="gallery" component={Gallery} title="Gallery" hideNavBar />
            <Scene key="events" component={Events} title="Events" hideNavBar />
            <Scene key="event" component={SingleEvent} title="Event" hideNavBar />
            <Scene key="contact" component={Contact} title="Contact" hideNavBar />
            <Scene key="subscribe" component={Subscribe} title="Subscribe" hideNavBar />
            <Scene key="benefits" component={Benefits} title="Benefits" hideNavBar />
            <Scene key="debate" component={Sessions} title="Debates" hideNavBar />
            <Scene key="otherprofile" component={OtherProfile} title="User Profile" hideNavBar />
            <Scene key="voteDone" component={VoteDone} title="User Profile" hideNavBar />
            <Scene key="partymember" component={PartyMember} title="Party Member" hideNavBar />
            <Scene key="donations" component={Donations} title="Donations" hideNavBar />
            <Scene key="donationDetail" component={DonationDetail} title="Donation Detail" hideNavBar />
            <Scene key="donationListing" component={DonationListing} title="Donation Listing" hideNavBar />
            <Scene key="donate" component={Donate} title="Donate" hideNavBar />
            <Scene key="accepted" component={Accepted} title="Accepted" hideNavBar />
            <Scene key="elections" component={Elections} title="Elections" hideNavBar />
            <Scene key="selectCandidate" component={SelectCandidate} title="Select Candidate" hideNavBar />
            <Scene key="about" component={About} title="About" hideNavBar />
            <Scene key="pdfView" component={PdfView} title="View PDF" hideNavBar />
            <Scene key="addComment" component={AddComment} title="Add Comment" hideNavBar />
            <Scene key="eligibility" component={Eligibility} title="Eligibility" hideNavBar />
            <Scene key="post" component={Post} title="Post" path={'post/:item'} hideNavBar />
            <Scene key="reactionList" component={ReactionList} title="Reaction List" hideNavBar />
            <Scene key="imageSwiper" component={ImageSwiper} title="Image Swiper" hideNavBar />
            <Scene key="editProfile" component={EditProfile} title="Edit Profile" hideNavBar />
            <Scene key="survey" component={Survey} title="Survey" hideNavBar />
            <Scene key="selectChoice" component={SelectChoice} title="Select Choice" hideNavBar />
          </Scene>
        </Router>
    </View>
    );
  }
}

