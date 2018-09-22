import { observable } from 'mobx'
import axios from 'axios'
import accountStore from './Account'
import config from '../config'
import { ToastAndroid } from 'react-native'

class Search {
    @observable query = ""
    @observable posts = []
    @observable items = []
    @observable users = []

    acceptPosts(posts) {
        this.posts = posts
    }

    filterList(query) {
        if(query.length === 0) {
            return this.items = []
        }
        this.query = query
        let updatedList = this.posts
        updatedList = updatedList.filter(v => {
            return v.content.toLowerCase().search(
                query.toLowerCase()) !== -1;
        })
        this.items = updatedList
    }

    searchUsers(query) {
        if(query.length === 0) {
            return this.users = []
        }
        axios({
            url: `${config.baseUrl}/users`, 
            method: 'GET', 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${accountStore.user.token}`
            },
        }).then(res => {
            let updatedList = res.data.data.filter(v => {
                return v.id !== accountStore.user.id && v.firstname.toLowerCase().search(
                    query.toLowerCase()) !== -1;
            })
           this.users = updatedList
    })
    .catch(err => {
        ToastAndroid.show("Could not fetch users", ToastAndroid.SHORT)
    })
    
}


}

const searchStore = new Search()
export default searchStore