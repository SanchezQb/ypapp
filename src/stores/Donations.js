import { observable } from 'mobx'
import { Actions} from 'react-native-router-flux'
import { ToastAndroid } from 'react-native'
import accountStore from './Account'
import axios from 'axios'


class Donations {
    @observable donations = []
    @observable amount = 0
    @observable disabled = false

    storeDonations(donations) {
        this.donations = donations
    }
    setAmount(amount) {
        this.amount = parseInt(amount)
    }
    donate(ref, id) {
        this.disabled = true
        const request = {
            referenceID: ref,
            amount: this.amount,
            date: Date.now()
        }
        axios({
            url: `https://ypn-node.herokuapp.com/api/v1/donations/donate/${id}`, 
            method: 'PUT', 
            data: request,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${accountStore.user.token}`
            },
        })
        .then(res => {
            this.disabled = false
            console.log(res.data)
            Actions.accepted()
        })
        .catch(err => {
            this.disabled = false
            ToastAndroid.show(err.response.data, ToastAndroid.SHORT)
        })

    }
}


const donationStore = new Donations()
export default donationStore