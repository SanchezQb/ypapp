import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const dots = ['\u2022', '\u2022', '\u2022', '\u2022']

const dotsets = dots.map((dotset, index) => {
    return (
        <Text key={index} style={{color: '#fff', fontSize: 36, marginRight: 3}}>{dotset}</Text>
    )
})

export default () => (
    <View style={{flexDirection: 'row', alignSelf: 'center', position: 'absolute', top: 60, paddingHorizontal: 10}}>
        <View style={styles.container}>
            {dotsets}
        </View>
        <View style={styles.container}>
            {dotsets}
        </View>
        <View style={styles.container}>
            {dotsets}
        </View>
        <View style={styles.container}>
            {dotsets}
        </View>
    </View>
)

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginHorizontal: 5,
    },
    dotText: {
        color: '#fff',
        fontSize: 28
    }
})

