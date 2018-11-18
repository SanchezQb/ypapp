import { AsyncStorage } from 'react-native'
window.navigator.userAgent = 'react-native'
const io = require('react-native-socket.io-client/socket.io');
import config from './config';



export default async (callback)  => {
    // check for the item
    let init = await AsyncStorage.getItem(`MessageNotificationTray`)
    let tray;
    if(!init) {
        await AsyncStorage.setItem(`MessageNotificationTray`, JSON.stringify([]))
    }
    
    return  (user) => (ops) => {
    //establish the connection here
   const handler =  io.connect(`${config.realTimeUrl}/base`, { query: { userID: user.id }})
   handler.on(`new-message-convo`, async (data) => {
       //set it as unread
       tray = await AsyncStorage.getItem(`MessageNotificationTray`)
       tray = [...JSON.parse(tray), data.destination];
       callback(tray);
       AsyncStorage.setItem(`MessageNotificationTray`, JSON.stringify(tray));
   })

  const handleRetriveCurrentUnread = async () => {
    tray =  await AsyncStorage.getItem(`MessageNotificationTray`)
    return JSON.parse(tray);
  }

  const clearFromUnreadChats = async () => {
      tray = await AsyncStorage.getItem('MessageNotificationTray');
      tray = JSON.parse(tray)
             .filter((id) => id !== ops.target);
     AsyncStorage.setItem(`MessageNotificationTray`, JSON.stringify(tray))
     callback(tray)
    }

    if(ops.remove) return clearFromUnreadChats();
    if(ops.fetch) return handleRetriveCurrentUnread();

}

}