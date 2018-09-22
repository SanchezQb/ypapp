import React, { Component } from 'react'
import { StyleProvider, Header, Left, Body, Right, Button, Icon, Title} from 'native-base';
import ScrollableTabView from 'react-native-scrollable-tab-view'
import Vacancies from './Vacancies'
import Voluntaries from './Voluntaries'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'
import { Actions } from 'react-native-router-flux'
import { BackHandler } from 'react-native'


export default class Careers extends Component {

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress () {
        Actions.pop()
        return true;
    }
    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <React.Fragment>
                    <Header>
                        <Left>
                            <Button transparent onPress={() => Actions.pop()}>
                                <Icon name="arrow-back" style={{fontSize: 20, color: '#fff'}}/>
                            </Button>
                        </Left>
                        <Body>
                            <Title>Careers</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <ScrollableTabView 
                        tabBarUnderlineStyle={{backgroundColor: '#82BE30'}}
                        tabBarBackgroundColor="#f2f2f2"
                        tabBarInactiveTextColor="#777"
                        tabBarActiveTextColor="#82BE30"
                        activeTabStyle={{ backgroundColor: 'red' }}
                        tabBarTextStyle={{fontSize: 15}}
                        >
                        <Vacancies tabLabel="Vacancies" />
                        <Voluntaries tabLabel="Volunteer" />
                    </ScrollableTabView>
                </React.Fragment>
            </StyleProvider>
            
        )
    }
}