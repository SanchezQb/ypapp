import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { Button, Text } from 'native-base'
import * as RNCloudinary from 'react-native-cloudinary-x'

RNCloudinary.init('741854955822223','0Y6bxC5eCBKjXZLuyOJpm6tcJTM','ddjyel5tz')

export default class Upload extends Component {
    upload = () => {
        RNCloudinary.UploadImage('http://res.cloudinary.com/paperstack/image/upload/v1530745688/khdpzhyxwuzsnmdxoeyd.jpg').then(res => {
            console.log(res)
        }).catch(err => console.log(err))
    }
    render() {
        return (
            <View style={styles.container}>
                <Button onPress={() => this.upload()}> 
                    <Text>Upload Image</Text>
                </Button>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
export const SendToCloudinary = async (data, key) => {
    const images = [];
    RNCloudinary.init(config.cloudinaryKey, config.cloudinarySecret, config.cloud);
    if (!key) return RNCloudinary.UploadImage(data.path);
  
  
    for (let i = 0; i < data.length; i++) {
      const url = await RNCloudinary.UploadImage(data[i].path);
      images.push(url);
    }
    return images;
  };