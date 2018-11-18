import { observable } from 'mobx'
import axios from 'axios'
import {Actions} from 'react-native-router-flux'
import { AsyncStorage, ToastAndroid } from 'react-native'
import * as RNCloudinary from 'react-native-cloudinary-x'
import Config from '../config'

RNCloudinary.init('396818972971315','lOgXSTjfh-IJLkQJD8G6MZ5d3ro','booktu')


class Account {
    @observable user = {
        token: '',
        avatar: null,
        email: '',
        id: null,
        bio: '',
        firstname: '',
        lastname: '',
        phone: '',
        state: null,
        lga: null,
        ward: null,
        username: '',
        membership_number: '',
        role: null,
        roles: null,
        vin: null,
        followers: [],
        friends: []
    }
    @observable disabled = false
    @observable color = '#F0BA00'
    @observable notifications = true
    @observable visible = false

    getUserDataFromStorage(data) {
        this.user = data
    }

    registerUser(data) {
        this.disabled = true
        this.visible = true
        if(data.image) {
            RNCloudinary.UploadImage(data.image)
            .then(res => {
                const request = {
                    user: {
                        ...data,
                        avatar: res,
                        firstname: data.fullname.split(" ")[0],
                        lastname: data.fullname.split(" ")[1]

                    }
                }
                axios({
                    url: `${Config.baseUrl}/signup`, 
                    method: 'POST', 
                    data: request,
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
                .then((res) => {
                    this.disabled = false
                    this.visible = false
                    ToastAndroid.show('Account Created, Check your email to confirm account', ToastAndroid.LONG)
                    Actions.login()
                })
                .catch(err => {
                    this.disabled = false
                    this.visible = false
                    ToastAndroid.show(err.response.data.errors, ToastAndroid.SHORT)
                })

            })
            .catch(err => {
                this.disabled = false
                this.visible = false
                ToastAndroid.show('There was a problem uploading your photo, Please try again or try a different photo', ToastAndroid.SHORT)
            })
        }
        else {
            const request = {
                user: {
                   ...data,
                   firstname: data.fullname.split(" ")[0],
                   lastname: data.fullname.split(" ")[1]
                }
            }
            this.disabled = true
            this.visible = true
            axios({
                url: `${Config.baseUrl}/signup`, 
                method: 'POST', 
                data: request,
                headers: {
                    "Content-Type": "application/json"
                },
            })
            .then(() => {
                this.disabled = false
                this.visible = false
                ToastAndroid.show('Account Created, Check your email to confirm account', ToastAndroid.LONG)
                Actions.login()
            })
            .catch(err => {
                this.disabled = false
                this.visible = false
                ToastAndroid.show(err.response.data.errors, ToastAndroid.SHORT)
            })
        }
    }
    
    updateUserInfo(newInfo) {
        axios({
            url: `${Config.baseUrl}/user`, 
            method: 'PUT', 
            data: {
                user: newInfo
            },
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${this.user.token}`
            },
        }).then(res => {
           this.user.vin = res.data.data.vin
        })
        .catch(err => console.log(err))
    }
    passFollows(data) {
        this.user.followers = data.followers
        this.user.following = data.friends
    }
    editProfile(data) {
        if(data.avatar) {
            RNCloudinary.UploadImage(data.avatar)
            .then(res => {
                const request = {
                    user: {
                        ...data,
                        avatar: res,
                    }
                }
                axios({
                    url: `${Config.baseUrl}/user`, 
                    method: 'PUT', 
                    data: request,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `${this.user.token}`
                    },
                })
                .then((res) => {
                    this.user.avatar = res.data.data.avatar
                    this.user.firstname = res.data.data.firstname
                    this.user.lastname = res.data.data.lastname
                    this.user.bio = res.data.data.bio
                    ToastAndroid.show('profile updated', ToastAndroid.LONG)
                    AsyncStorage.setItem('allUserData', JSON.stringify(this.user))
                })
                .catch(err => {
                    ToastAndroid.show('An error occured while updating your profile, Please try again', ToastAndroid.SHORT)
                })

            })
            .catch(err => ToastAndroid.show('There was a problem uploading your photo, Please try again or try a different photo', ToastAndroid.SHORT))
        }
        else {
            const req = {
                user: {
                   ...data,
                }
            }
            console.log(data)
            axios({
                url: `${Config.baseUrl}/user`, 
                method: 'PUT', 
                data: req,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${this.user.token}`
                },
            })
            .then((res) => {
                this.user.avatar = res.data.data.avatar
                this.user.firstname = res.data.data.firstname
                this.user.lastname = res.data.data.lastname
                this.user.bio = res.data.data.bio
                ToastAndroid.show('profile updated', ToastAndroid.LONG)
                AsyncStorage.setItem('allUserData', JSON.stringify(this.user))
            })
            .catch(err => {
                ToastAndroid.show('An error occurred', ToastAndroid.SHORT)
            })
        }
        console.log(data)
    }

    login(data) {
        const request = {
            user: {
                ...data
            }
        }
        this.disabled = true
        this.visible = true
        axios({
            url: `${Config.baseUrl}/login`, 
            method: 'POST', 
            data: request
        }).then(res => {
            this.visible = false
            this.disabled = false
            this.user.token = res.data.data.token
            this.user.avatar = res.data.data.user.avatar
            this.user.email =  res.data.data.user.email
            this.user.bio =  res.data.data.user.bio
            this.user.id = res.data.data.user.id
            this.user.firstname = res.data.data.user.firstname
            this.user.lastname = res.data.data.user.lastname
            this.user.phone = res.data.data.user.phone
            this.user.state = res.data.data.user.state
            this.user.lga = res.data.data.user.lga
            this.user.ward = res.data.data.user.ward
            this.user.username = res.data.data.user.username
            this.user.membership_number = res.data.data.user.membership_number
            this.user.role = res.data.data.user.role
            this.user.roles = res.data.data.user.roles
            this.user.vin = res.data.data.user.vin
            if(res.data.data.user.confirmed_email === true) {
                AsyncStorage.setItem('allUserData', JSON.stringify(this.user))
                ToastAndroid.show('Login Successful', ToastAndroid.SHORT)
                Actions.home()
            }
            else {
                // ToastAndroid.show('You must confirm your email to continue', ToastAndroid.SHORT)
                AsyncStorage.setItem('allUserData', JSON.stringify(this.user))
                ToastAndroid.show('Login Successful', ToastAndroid.SHORT)
                Actions.home()
            }

        })
        .catch(err => {
            ToastAndroid.show(err.response.data.errors, ToastAndroid.SHORT)
            this.disabled = false
            this.visible = false
        })
    }
    becomeAPartyMember() {
        axios({
            url: `${Config.baseUrl}/party/member/new/${this.user.id}`,
            method: 'GET', 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${this.user.token}`
            },
        })
        .then(res => {
            this.user.token = res.data.data.token
            this.user.avatar = res.data.data.data.avatar
            this.user.email =  res.data.data.data.email
            this.user.id = res.data.data.data.id
            this.user.firstname = res.data.data.data.firstname
            this.user.lastname = res.data.data.data.lastname
            this.user.phone = res.data.data.data.phone
            this.user.state = res.data.data.data.state
            this.user.lga = res.data.data.data.lga
            this.user.ward = res.data.data.data.ward
            this.user.username = res.data.data.data.username
            this.user.membership_number = res.data.data.data.membership_number
            this.user.role = res.data.data.data.role
            this.user.roles = res.data.data.data.roles
            this.user.vin = res.data.data.data.vin
            this.user.bio = res.data.data.data.bio
            AsyncStorage.setItem('allUserData', JSON.stringify(this.user))
            Actions.partymember()
        })
        .catch(error => ToastAndroid.show(error.response.data.errors, ToastAndroid.SHORT))
    }
}

const accountStore = new Account()
export default accountStore
