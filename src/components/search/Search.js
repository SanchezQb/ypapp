import React, { Component } from 'react'
import { Button, Icon, Text, Header, Item, Input, StyleProvider, Container } from 'native-base'
import { observer } from 'mobx-react/native'
import { BackHandler,} from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import PostSearch from './PostSearch'
import UserSearch from './UserSearch'
import searchStore from '../../stores/Search'
import { Actions } from 'react-native-router-flux'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'

@observer
export default class Search extends Component {

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress () {
        Actions.pop()
        return true
    }
    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <Header searchBar rounded>
                        <Item>
                            <Icon name="ios-search" />
                            <Input
                                onChangeText={(text) => {
                                    searchStore.filterList(text)
                                    searchStore.searchUsers(text)
                                }}
                                placeholder="Search" />
                        </Item>
                        <Button transparent>
                            <Text>Search</Text>
                        </Button>
                    </Header>
                    <ScrollableTabView
                        tabBarUnderlineStyle={{backgroundColor: '#82BE30'}}
                        tabBarActiveTextColor="#82BE30"
                        tabBarInactiveTextColo="#a6a6a6"
                    >
                        <PostSearch tabLabel="Posts" />
                        <UserSearch tabLabel="Users" />
                    </ScrollableTabView>
                </Container>
            </StyleProvider>
        )
    }
}
