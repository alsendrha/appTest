import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import MyBottomSheet from './src/components/BottomSheet/MyBottomSheet';
import ReactQueryProvider from './src/reactQuery/proovider';
import {colors} from './globalStyle';
import SplashScreen from 'react-native-splash-screen';
import AppStackScreen from './src/components/MainStackScreen/AppStackScreen';
import Toast from 'react-native-toast-message';
import ToastMsg from './src/components/ToastMsg';

function App() {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  });

  return (
    <>
      <ReactQueryProvider>
        <GestureHandlerRootView
          style={{flex: 1, backgroundColor: colors.white}}>
          <NavigationContainer>
            <AppStackScreen />
            <MyBottomSheet />
          </NavigationContainer>
        </GestureHandlerRootView>
      </ReactQueryProvider>
      <ToastMsg />
    </>
  );
}

export default App;
