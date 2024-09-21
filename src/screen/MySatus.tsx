import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useGetUser, useGetUSerInfo, useUpdateUser} from '../api/firebase';
import {iHeight, iWidth} from '../../globalStyle';
import IInput from '../components/IInput';
import IButton from '../components/IButton';
import storage from '@react-native-firebase/storage';
import {useBottomSheetRef, useImagePicker, usePageInfo} from '../store/store';
import Icon from 'react-native-vector-icons/Ionicons';
import {UserDataType} from '../types/dataListType';
import {CheckedNickname} from '../utils/validation';
import {useNavigationState} from '@react-navigation/native';
import IModal from '../components/IModal';
const MyStatus = () => {
  const {bottomSheetRef} = useBottomSheetRef();
  const {imageData, setImageData} = useImagePicker();
  const {mutate} = useUpdateUser();
  const [userData, setUserData] = useState({
    id: '',
    nickname: '',
    profileImg: '',
  });
  const {data, isLoading, refetch} = useGetUSerInfo();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [nicknameCheck, setNicknameCheck] = useState(true);
  const [errorMsg, setErrorMsg] = useState({
    nickname: '',
  });
  const {setPageInfo} = usePageInfo();
  const [userNickname, setUserNickname] = useState('');
  const [passwordClicked, setPasswordClicked] = useState(false);
  const currentRouteName = useNavigationState(state => {
    const route = state.routes[state.index];
    return route.name;
  });
  useEffect(() => {
    setPageInfo(currentRouteName);
  }, [currentRouteName]);
  useEffect(() => {
    if (!data) return;
    setUserNickname(data.nickname);
    setUserData({
      id: data.email,
      nickname: data.nickname,
      profileImg: data.profileUrl,
    });
  }, [data]);

  useEffect(() => {
    if (userData.nickname !== userNickname) {
      setNicknameCheck(false);
    } else if (userData.nickname === userNickname) {
      setNicknameCheck(true);
    }
  }, [userData.nickname]);

  const handleBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  const handleSubmit = async () => {
    if (userNickname !== userData.nickname) {
      const check = await CheckedNickname({
        setErrorMsg,
        nickname: userData.nickname,
      });
      setNicknameCheck(check);
    }

    if (!nicknameCheck) return;

    setSubmitLoading(true);
    try {
      let url = '';
      if (imageData.uri) {
        const storageRef = storage().ref(`images/${imageData.fileName}`);
        await storageRef.putFile(imageData.uri!, {contentType: imageData.type});
        url = await storageRef.getDownloadURL();
      }
      const data: UserDataType = {
        nickname: userData.nickname,
      };

      if (imageData.uri) {
        data.profileUrl = url;
      }

      mutate(data, {
        onSuccess: () => {
          setSubmitLoading(false);
          Alert.alert('성공', '수정되었습니다.', [
            {
              text: '확인',
              onPress: () => {
                setImageData({
                  uri: '',
                  type: '',
                  fileName: '',
                });
                setErrorMsg({
                  nickname: '',
                });
                refetch();
              },
            },
          ]);
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
      <View style={styles.topBackground} />
      <View style={styles.bottomBackground} />
      {submitLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <View style={styles.userImgContainer}>
            <View style={styles.imgContainer}>
              <View style={styles.img}>
                {isLoading ? (
                  <ActivityIndicator size="large" />
                ) : (
                  <IButton buttonStyle="more" onPress={handleBottomSheet}>
                    <Image
                      source={
                        imageData.uri
                          ? {uri: imageData.uri}
                          : userData.profileImg
                          ? {uri: userData.profileImg}
                          : require('../assets/images/no_image.png')
                      }
                      style={styles.userImg}
                    />
                  </IButton>
                )}
                <View style={styles.iconContainer}>
                  <Icon name={'camera-sharp'} size={20} color="black" />
                </View>
              </View>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.inputMainContainer}>
              <IInput
                titleEnable={true}
                height={50}
                fontSize={16}
                titleText="이메일"
                value={userData.id}
                borderRadius={10}
                maxLength={30}
                deleteIcon={false}
                editable={false}
              />
            </View>
            {isLoading ? (
              <ActivityIndicator size="large" />
            ) : (
              <View style={styles.inputMainContainer}>
                <IInput
                  titleEnable={true}
                  height={50}
                  fontSize={16}
                  titleText="닉네임"
                  errorMsg={true}
                  errorText={errorMsg.nickname}
                  value={userData.nickname}
                  onChangeText={text =>
                    setUserData({...userData, nickname: text})
                  }
                  borderRadius={10}
                  maxLength={30}
                  deleteIcon={false}
                />
              </View>
            )}
            <IButton
              buttonStyle="more"
              onPress={() => setPasswordClicked(true)}>
              <View style={styles.passwordContainer}>
                <Text>비밀번호 변경</Text>
              </View>
            </IButton>
          </View>
          <View style={styles.submitButtonContainer}>
            <IButton
              buttonStyle="submit"
              title="확인"
              border={0}
              backgroundColor="#E07039"
              titleColor="white"
              onPress={() => handleSubmit()}
            />
          </View>
          <View style={styles.deleteAccountContainer}>
            <Text>회원탈퇴</Text>
          </View>
        </View>
      )}
      {passwordClicked && (
        <IModal
          passwordClicked={passwordClicked}
          setPasswordClicked={setPasswordClicked}
        />
      )}
    </Pressable>
  );
};

export default MyStatus;

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  topBackground: {
    height: iHeight * 150,
    backgroundColor: '#E07039',
  },
  bottomBackground: {
    height: '100%',
    backgroundColor: '#F7F7F7',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    position: 'absolute',
    marginTop: iHeight * 110,
    marginHorizontal: 30,
    height: iHeight * 500,
    elevation: 5,
  },
  userImgContainer: {
    position: 'relative',
  },

  imgContainer: {
    position: 'absolute',
    top: iHeight * -45,
    left: '50%',
    transform: [{translateX: -50}],
  },

  img: {
    position: 'relative',
    overflow: 'hidden',
  },

  userImg: {
    width: iWidth * 100,
    height: iWidth * 100,
    borderRadius: 999,
    backgroundColor: 'gray',
  },

  iconContainer: {
    width: 30,
    height: 30,
    backgroundColor: '#e3e3e3',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },

  inputContainer: {
    marginTop: iHeight * 75,
    paddingHorizontal: 15,
  },

  inputMainContainer: {
    marginTop: 10,
  },

  passwordContainer: {
    height: 50,
    borderWidth: 0.5,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },

  deleteAccountContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
});
