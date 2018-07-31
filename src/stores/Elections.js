import { observable } from 'mobx'
import axios from 'axios'
import accountStore from './Account'

class Elections {
    @observable candidates = []
    @observable error = false

    
    vote(data) {
        axios({
            url: `https://ypn-node.herokuapp.com/api/v1/questions/respond`, 
            method: 'PUT', 
            data,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${accountStore.user.token}`
            },
        }).then(res => {
            this.isLoading = false
            Actions.voteDone()
        })
        .catch(error => {
            this.error = true
            ToastAndroid.show(error.response.data.error, ToastAndroid.SHORT)
        })
    }
}


const electionsStore = new Elections()
export default electionsStore