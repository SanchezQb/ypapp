import { observable } from 'mobx'
import axios from 'axios'
import accountStore from './Account'

class Events {
    @observable events = null
    @observable isOpen = false

    async fetchAllEvents(){
        await axios({
            url: `https://ypn-node-service.herokuapp.com/api/v1/events`, 
            method: 'GET', 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${accountStore.user.token}`
            },
        }).then(res => {
            console.log(res.data.data)
            this.setState({events: res.data.data, isLoading: false})
        })
        .catch(error => {
            ToastAndroid.show(error.response.data.error, ToastAndroid.SHORT)
        })
    }

    async fetchSpecificEvent () {
        await axios
          .request({
            method: 'get',
            url: `https://ypn-node-service.herokuapp.com/api/v1/events/${id}`,
            headers: {
              Authorization: `${accountStore.user.token}`
            }
          })
          .then((response) => {
            console.log(response)
          })
          .catch((err) => {
                console(err)
          });
    };
    async attendEvent() {
       await axios.request({
          method: 'put',
          url: `https://ypn-node-service.herokuapp.com/api/v1/events/join/${id}`,
          headers: {
            Authorization: `${accountStore.user.token}`
          }
        })
          .then((res) => {
           console.log(res)
          })
          .catch((err) => {
            if (err.response && err.response.status) {
              dispatchNotification("You're attending this event already. Thank you!");
              return Actions.pop();
            }
            dispatchNotification('Something went wrong. Try again?');
            return Actions.pop();
          });
      };
      
     async leaveEvent() {
        await axios.request({
          method: 'put',
          url: `https://ypn-node-service.herokuapp.com/api/v1/events/leave/${id}`,
          headers: {
            Authorization: getState().users.token
          }
        })
          .then(() => {
            EndProcess(navigator);
            dispatchNotification(navigator)('Okay great done');
            navigator.pop();
          })
          .catch(() => {
            EndProcess(navigator);
            dispatchNotification('Something went wrong. Try again?');
            return navigator.pop();
          });
      };
    

}
const eventStore = new Events()
export default eventStore