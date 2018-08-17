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
    verifyVin = (data) => {
        if(!accountStore.user.lastname) return ToastAndroid.show('You need a Last Name to verify your VIN')
        const generateState = () => {
            const items = StateData.filter(item => item.state.name === accountStore.user.state)
            return items.length ? items[0].state.id : ''
        }
        axios({
            url: `https://ypn-election-02.herokuapp.com/api/verify`, 
            method: 'POST', 
            data: {
                vin: data.vin,
                state_id: generateState(),
                search_mode: 'vin',
                last_name: accountStore.user.lastname
            },
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${accountStore.user.token}`
            },
        }).then(() => {
            ToastAndroid.show('You have successfully verified your VIN', ToastAndroid.SHORT)
            this.updateUserInfo({vin: data.vin})
        }).catch(err => ToastAndroid.show(`${err.response ? err.response.message : 'Something went wrong, pleasr try again'}`, ToastAndroid.SHORT))
    }
    
}


const electionsStore = new Elections()
export default electionsStore