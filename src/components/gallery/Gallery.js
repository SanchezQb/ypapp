import React, { Component } from 'react'
import { 
    StyleProvider, 
    Header, 
    Left, 
    Body, 
    Right, 
    Button, 
    Title, 
    Container, Icon, Text
} from 'native-base';
import { StyleSheet, ActivityIndicator, TouchableOpacity, View, ScrollView, Image, BackHandler } from 'react-native'
import { Actions } from 'react-native-router-flux'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material'
import Modal from 'react-native-modalbox'
import axios from 'axios'

export default class Gallery extends Component {
    constructor() {
        super()
        this.state = {
            isLoading: true,
            error: false,
            isOpen: false,
            isDisabled: false,
            swipeToClose: true,
            images: [],
            imageToOpen: null
        }
        this.baseState = this.state
    }
    
    // onMenuPressed = (labels) => {
    //     const { onPress } = this.props;
    //     UIManager.showPopupMenu (
    //         findNodeHandle(this.menu),
    //         ["Item1", "Item2", "Item3"],
    //         () => {},
    //         (result, index) => {
    //         if (index == 0) {
    //           Actions.drawerOpen()
    //         }
    //       },
    //     );
    //   };

    componentDidMount() {
        this.getImages()
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress () {
        Actions.pop()
        return true;
    }
    getImages = () => {
        axios.get('https://paperstack.ml/posts')
        .then(res => {
            this.setState({
                isLoading: false,
                images: res.data.posts.slice(0,10)
            })
        })
        .catch(error => {
            this.setState({
                isLoading: false,
                error: true
            })
        })
    }
    reset = () => {
        this.setState(this.baseState)
        this.getPosts()
      }

    render() {
        if (this.state.isLoading) {
            return (
              <View style={{flex: 1, justifyContent: 'center'}}>
                <ActivityIndicator size="large" color="#82BE30"/>
              </View>
            );
          }
          else if (this.state.error) {
            return (
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#444'}}>Could not Load photos</Text>
                <Text></Text>
                <Text></Text>
                <Button style={{backgroundColor: '#82BE30', alignSelf: 'center'}}onPress={() => {this.reset()}}>
                    <Text>Retry</Text>
                </Button>
              </View>
              
            )
        }
        const { labels } = this.props;
        const gallery = this.state.images.map(image => {
            return (
                <View key={image._id}>
                    <TouchableOpacity onPress={() => {
                        this.setState({
                            imageToOpen: image.thumbnail,
                            isOpen: true
                        })
                    }}>
                        <View style={styles.image}>
                            <Image
                                resizeMode="cover"
                                source={{uri: image.thumbnail}}
                                style={{width: 300, height: 300}} 
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            )
        })
        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <Header noShadow>
                        <Left>
                            <Button onPress={() => Actions.pop()} transparent>
                                <Icon name="arrow-back" style={{ color: '#fff'}}/>
                            </Button>
                        </Left>
                        <Body>
                            <Title>Gallery</Title>
                        </Body>
                        <Right>
                            {/* <Button transparent  onPress={() => this.onMenuPressed(labels)}>
                                <View style={{flexDirection: 'row'}}>
                                    <View>
                                        <View
                                            ref={c => this.menu = c}
                                            style={{
                                                backgroundColor: 'transparent',
                                                width: 1,
                                                height: StyleSheet.hairlineWidth,
                                            }}
                                        />
                                        <Icon
                                            name="md-search"
                                            style={{color: 'white', fontSize: 28 }}
                                        />
                                    </View>
                                </View>
                            </Button>  */}
                        </Right>
                    </Header>
                    <ScrollView>
                        <View style={styles.stamp}>
                            <Text style={{fontSize: 24, fontWeight: 'bold', color: '#444'}}>Recent</Text>
                            <Text style={{fontSize: 14,}}>March 2018</Text>
                        </View>
                        <View>
                            <View style={styles.gallery}>
                                <Text style={{fontSize: 16, color: '#777'}}>Capacity Building Workshop</Text>
                            </View>
                            <View style={styles.galleryContainer}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {gallery}
                                </ScrollView>
                            </View>  
                        </View>
                        <View>
                            <View style={styles.gallery}>
                                <Text style={{fontSize: 16, color: '#777'}}>Capacity Building Workshop</Text>
                            </View>
                            <View style={styles.galleryContainer}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                   {gallery}
                                </ScrollView>
                            </View>    
                        </View>
                        </ScrollView>
                        <Modal
                            isOpen={this.state.isOpen} 
                            onClosed={() => this.setState({isOpen: false})} 
                            style={[styles.modal, styles.modal3]} 
                            position={"center"} 
                            entry="top"
                            animationDuration={200}>
                            <Image
                                resizeMode="cover"
                                source={{uri: this.state.imageToOpen}}
                                style={{width: 300, height: 300}} />
                        </Modal>
                </Container>
            </StyleProvider>
        )
    }
}

const styles = StyleSheet.create({
    stamp: {
        marginVertical: 30,
        alignSelf: 'center',
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    gallery: {
        width: '80%',
        alignSelf: 'center'
    },
    image: {
        width: 150,
        height: 150,
        backgroundColor: 'rgba(130,190,48, 0.5)',
        marginRight: 20
    },
    galleryContainer: {
        marginLeft: 40,
        marginVertical: 30,
        alignSelf: 'flex-start',
        flexDirection: 'row'
    },
    modal3: {
        height: 300,
        width: 300
      },
})