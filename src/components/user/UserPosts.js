import React, { Component } from 'react'
import axios from 'axios'
import { observer } from 'mobx-react'
import {  Text, Thumbnail, Button } from 'native-base'
import { View,  StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import { PostList } from '../feed/Posts'
import accountStore from '../../stores/Account'
import Config from '../../config'


@observer
export default class Userposts extends Component {
    constructor() {
        super()
        this.state = {
            isLoading: true,
            error: false,
            posts: [],
        }
        this.baseState = this.state
    }

    componentDidMount() {
        this.getPosts()
    }
    getPosts = async () => {
        await axios({
          url: `${Config.postUrl}/posts//all/${accountStore.user.id}`, 
          method: 'GET', 
          headers: {
              "Content-Type": "application/json",
              "Authorization": `${accountStore.user.token}`
          },
      })
      .then(res => {
          this.setState({
            posts: res.data.data.filter(post => {
                return post.destination == null
          }),
              isLoading: false
          })
      })
      .catch(error => {
          this.setState({
              isLoading: false,
              error: true
          })
      })
    }
    reset = () => {
        this.setState(this.baseState)
        this.getPosts()
    }

    render() {
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
                <Text style={{color: '#444'}}>Could not load Posts:(</Text>
                <Text></Text>
                <Text></Text>
                <Button style={{backgroundColor: '#82BE30', alignSelf: 'center'}}onPress={() => {this.reset()}}>
                    <Text>Retry</Text>
                </Button>
              </View>
              
            )
        }
        return (
            <View>
                <FlatList
                    data={this.state.posts}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item}) =>
                    <PostList item={item} refresh={this.getPosts}/>
                    }
                    keyExtractor={item => item._id}
                    />
            </View>
        )
    }
}
const styles= StyleSheet.create({
    icons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    listitem: {
        marginLeft: 0,
        borderBottomWidth: 0
    },
    link:{
        flexDirection: 'row',
        backgroundColor: '#e1e1e1',
        padding: 5,
        marginTop: 10,
        marginRight: 30,
        borderRadius: 4
    }
})