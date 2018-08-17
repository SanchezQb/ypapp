import React, { Component } from 'react'
import { Button, Icon } from 'native-base'
import { View, Image, BackHandler } from 'react-native'
import Swiper from 'react-native-swiper'
import { Actions } from 'react-native-router-flux'

export default class ImageSwiper extends Component {

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
        const images = this.props.data.map((image, index) => {
            return (
                <View key={index} style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Image 
                    resizeMode="contain"
                    style={{width: '100%', height: '100%',}}
                    source={{uri: image}} />
                </View>
            )
        })
        return (
            <View style={{flex: 1,}}>
                <View  style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <Button transparent onPress={() => Actions.pop()}>
                        <Icon name="ios-close" style={{fontSize: 34, color: '#F0BA00'}} />
                    </Button>
                </View>
                <Swiper 
                    activeDot={
                        <View style={{backgroundColor: '#F0BA00', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />
                    }
                    style={{backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center'}} 
                    index={this.props.index}>
                    {images}
                </Swiper>
            </View>
        )
    }
}