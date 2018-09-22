import { observable } from 'mobx'
import accountStore from './Account'
import { AsyncStorage } from 'react-native'
import Config from '../config'
import axios from 'axios'

class Notifications {

    @observable notifications = []
    @observable unseenCount = 0
    @observable lastSeenCount = 0
    @observable count = 0

    async fetchNotifications() {
        this.count = await AsyncStorage.getItem('lastNotificationCount') || 0
        axios({
            url: `${Config.realTimeUrl}/fetch/${accountStore.user.id}`,
            method: 'POST', 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${accountStore.user.token}`
            },
        })
        .then(res => {
            const newCount = res.data.data.last - parseInt(this.count)
            this.notifications = res.data.data.notifications,
            this.unseenCount = newCount
            this.lastSeenCount = this.count
            // this.getCount()
        })
        .catch(err => {
            this.notifications = []
            this.count = 0
        })
    }
    clearNotficationCount() {
        this.unseenCount = 0
    }

    getCount() {
        console.log("count", this.unseenCount)
    }

    updateLastSeenCount(count) {
        this.lastSeenCount = count
    }

    receiveNotifications(notification, count) {
        this.notifications = [...notification, this.notifications]
        this.count = this.count + 1
    }
}

const notificationStore = new Notifications()
export default notificationStore