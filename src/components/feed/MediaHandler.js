import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, FlatList, Linking } from 'react-native'
import LinkPreview from 'react-native-link-preview'
import postStore from '../../stores/Post'
import { observer } from 'mobx-react/native'
import { YouTubeStandaloneAndroid } from 'react-native-youtube';
import { Actions } from 'react-native-router-flux'

const { width, height } = Dimensions.get('window')

@observer
class MediaHandler extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: false,
      images: false,
      imageToOpen: null,
      isOpen: false,
    }
  }

  componentDidMount() {
    if (this.props.data.media.length > 0 ) return this.setState({ images: this.props.data.media })
    const links = this.props.data.links.filter(item => item.length > 0 && item !== "");
    if (links.length > 0) {
      this.setState({ target: links[0]})
      LinkPreview.getPreview(links[0])
      .then(data => {
       this.setState({ data })
      })
    }
  }

 ImageRender = () =>{
  return (  this.state.images ?
   (  <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: width * 0.7, marginTop: 10, borderColor: '#e9e9e9', borderWidth: 1 }}>
        { this.RenderSingleItem(this.state.images) }
      </View>
    ) : null )
 }

  RenderSingleItem = (data) => data.map((uri, index) => {
    return (
      <View key={index} style={{ maxHeight: height * 0.3, backgroundColor: '#E5E7E9', marginRight: 3, marginBottom: 3 }}>
        <FlatList
          horizontal
          data={uri}
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) =>  
          <TouchableOpacity onPress={() => {
             Actions.imageSwiper({data: uri, index})
            }}>
             <Image 
              style={{ marginHorizontal: 5, height: this.__calculateHeight(data), width: width * 0.34 }} source={{ uri: item }}/>
          </TouchableOpacity>
           }
          keyExtractor={(item, index) => index.toString()}
          />
      </View>
    )
  }
  )

__calculateHeight = (data) => {
  if(data.length > 3) return height * 0.15;
  if(data.length < 3) return height * 0.2;
  return height * 0.15;
}

__truncateText = (text) => {
  if (!text) return null;
  return text.split(' ').slice(0, 9).join(' ')
}
playContent = (str) => {
  YouTubeStandaloneAndroid.playVideo({
      apiKey:"AIzaSyCZNRFr_mF53iI6wLcznjXHjA4KWrQ4eXM",
      videoId: str.substr(str.length - 11),
      autoplay: false,
      startTime: 0,
    })
      .then(() => console.log('Standalone Player Exited'))
      .catch(errorMessage => console.error(errorMessage))
}
openURL = (str) => {
  Linking.openURL(str).catch(err => console.error('An error occurred', err));
}

 previewLink = () => {
   const { data } =  this.state
   if(data.url.match(/youtu/) && data.url.match(/be/)) {
     return (
      <TouchableOpacity onPress={() => this.playContent(this.state.target)} style={{ borderWidth: 1, maxHeight: height * 0.25, borderRadius : 5, marginRight: 30, marginTop: 10, borderColor: '#F2F3F4'}}>
        { data.images ? <Image source={{ uri: data.images[0] }} style={{ height: height * 0.15 }} />: null}
        <View style={{ borderTopWidth: 0.5, borderTopColor: '#F2F3F4', paddingLeft: 10, paddingTop: 5, paddingBottom: 10, backgroundColor: '#ECF0F1' }}>
          <Text style={{ fontSize: 13, color: '#171717', fontWeight: '600', marginBottom: 5 }}>{data.title}</Text>
          <Text style={{ fontSize: 11, width: width * 0.62 }}>{`${this.__truncateText(data.description)}...`}</Text>
        </View>
      </TouchableOpacity>
     )
   }
   return data ? (
     <TouchableOpacity onPress={() => this.openURL(data.url)} style={{ borderWidth: 1, maxHeight: height * 0.25, borderRadius : 5, marginRight: 30, marginTop: 10, borderColor: '#F2F3F4'}}>
      { data.images ? <Image source={{ uri: data.images[0] }} style={{ height: height * 0.15 }} />: null}
       <View style={{ borderTopWidth: 0.5, borderTopColor: '#F2F3F4', paddingLeft: 10, paddingTop: 5, paddingBottom: 10, backgroundColor: '#ECF0F1' }}>
         <Text style={{ fontSize: 13, color: '#171717', fontWeight: '600', marginBottom: 5 }}>{data.title}</Text>
      {data.description ? <Text style={{ fontSize: 11, width: width * 0.62 }}>{`${this.__truncateText(data.description)}...`}</Text> :  <Text style={{ fontSize: 14, color: '#0066CC', width: width * 0.62 }}>{data.url}</Text>}
       </View>
   </TouchableOpacity>
 ) : null
 }

  render = () => {
    return this.state.data ? this.previewLink() : this.ImageRender()
  }
}

export default MediaHandler