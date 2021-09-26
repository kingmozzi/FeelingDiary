/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{Fragment, Component, useState, useEffect,} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReactNativeFirebase } from '@react-native-firebase/app';
import database, { firebase } from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';

import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  TouchableOpacityBase,
  TouchableOpacity,
  PanResponder,
  Pressable,
  Alert,
  Button,
  props,
  TextInput,
  ImageBackground,
  
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { resolvePlugin } from '@babel/core';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
//navigatior bar, navigator stack

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const checkToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
        var result = String(fcmToken)
        return result
    } 
  }


  //Loading 첫 Load 인지 아닌지 Check
  function checkScreen({navigation}){
    
    const [animating, setAnimating] = useState(true);

    useEffect(() => {
      setTimeout(() => {
        setAnimating(false);
        //Check if user_id is set or not
        //If not then send for Authentication
        //else send to Home Screen
        AsyncStorage.getItem('userData').then((value) =>
          navigation.replace(value === null ? 'login' : 'first'),
        );
      }, 3000);
    }, []);
    
    return(
      <View style={styles.allCenter}>
        <Text>Checking...</Text>
        <Image source={require('./assets/Icon.png')}/>
      </View>
    );
  }

  async function storeData(key, value){
    try {
      await AsyncStorage.setItem(key, JSON.stringify({'userId': value}));
    } catch (error) {
        alert(error)
    }
    
  }
  
  async function getData(key){
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
          return value;
      }
    } catch (error) {
        alert(error)
    }
  }

  //프로필 입력 화면
  function loginScreen({navigation}){
    
    const [nickname, setNickname] = React.useState('')
    const [mbti, setMbti] = React.useState('')
    const [sex, setSex] = React.useState('')
    const [age, setAge] = React.useState('')
    const [workingHours, setWorkingHours] = React.useState('')
    const [intensity, setIntensity] = React.useState('')
    
    return(
      <View style={{flex:1,alignItems: 'stretch' }}>

        <View style={styles.login}>
          <Text style={{fontSize:20}}>닉네임 설정하기</Text>
          <TextInput 
              style={styles.detailBox}
              onChangeText={nickname => setNickname(nickname)}
              placeholder="닉네임"
          />
        </View>
        
        <View style={styles.login}>
          <Text style={{fontSize:20}} >MBTI</Text>
          <TextInput 
              style={styles.detailBox}
              onChangeText={mbti => setMbti(mbti)}
              placeholder="MBTI"
          />
        </View>
        
        <View style={styles.login}>
          <Text style={{fontSize:20}}>성별</Text>
          <TextInput 
              style={styles.detailBox}
              onChangeText={sex => setSex(sex)}
              placeholder="성별"
          />
        </View>

        <View style={styles.login}>
          <Text style={{fontSize:20}}>나이</Text>
          <TextInput 
              style={styles.detailBox}
              onChangeText={age => setAge(age)}
              placeholder="나이"
          />
        </View>

        <View style={styles.login}>
          <Text style={{fontSize:20}}>주 근무시간</Text>
          <TextInput 
              style={styles.detailBox}
              onChangeText={workingHours => setWorkingHours(workingHours)}
              placeholder="주 근무시간"
          />
        </View>

        <View style={styles.login}>
          <Text style={{fontSize:20}}>근무 강도(상중하)</Text>
          <TextInput 
              style={styles.detailBox}
              onChangeText={intensity => setIntensity(intensity)}
              placeholder="근무강도(상, 중, 하)"
          />
        </View>
        
        <View style={styles.login}>
          <Button title="제출" onPress={()=>{            
            storeData("userData", nickname);

            database()
            .ref('/users/'+nickname)
            .set({
              
              nickname: nickname,
              mbti: mbti,
              sex: sex,
              age: age,
              workingHours: workingHours,
              intensity: intensity,
            })
            navigation.navigate('first')
            }}
          />
        </View>
        
      </View>
    );
  }
  
  function firstScreen({navigation}){
    return(
      <View style={styles.first}>
        <Text style={{fontSize:40, margin:20}}>지금 기분이 어때?</Text>
        <Image source={require('./assets/first.png')} style={{width:400, height:300, margin:20}}/>
        <Button 
          title='터치로 넘어가기' 
          onPress={()=>
            navigation.navigate('second')
          }
          style={{margin:20}}
        />
      </View>
    );
  }

  function secondScreen({navigation}){
    return(
      <View style={styles.first}>
        <Text style={{fontSize:40, margin:20}}>네가 지금 느끼고 있는 {'\n'} 감정이 궁금해!</Text>
        <Image source={require('./assets/first.png')} style={{width:400, height:300, margin:20}}/>
        <Button 
          title='터치로 넘어가기' 
          onPress={()=>
            navigation.navigate('test')
          }
          style={{margin:20}}
        />
      </View>
    );
  }

  //Main화면, 기분을 선택
  function MainScreen({navigation}){

    return(
      //전체 View
      <View style={styles.container}>
        <View style={styles.mainTop}>
          <Text style={{fontSize:40, fontWeight:'bold'}}>기분이 어때?</Text>
        </View>
        
        <View style={styles.mainMid} >
          
          <Pressable 
            onPressOut={(evt) => {
              if(evt.nativeEvent.locationX > 207 && evt.nativeEvent.locationY <= 207){
                //1사분면
                navigation.navigate('when', {post:1})
              }
              else if(evt.nativeEvent.locationX <= 207 && evt.nativeEvent.locationY <= 207){
                //2사분면
                navigation.navigate('when', {post:2})
              }
              else if(evt.nativeEvent.locationX <= 207 && evt.nativeEvent.locationY > 207){
                //3사분면
                navigation.navigate('when', {post:3})
              }
              else if(evt.nativeEvent.locationX > 207 && evt.nativeEvent.locationY > 207){
                //4사분면
                navigation.navigate('when', {post:4})
              }
            }
            
          }>
            <Image source={require('./assets/cross.png')} style= {{width:400, height:400}}/>
          </Pressable>
        </View>

        <View style={styles.mainBottom}>
          <Image source={require('./assets/friend.png')} style={{width:50, height:60}}/>
          <Text style={{fontSize:30}}>  나한테만 말해봐 친구야</Text>
        </View>

      </View>

    );
  }

  //calendar 화면
  function CalendarScreen(){

    let items

    useEffect(() => {
      const storage = async()=>{
        items = await AsyncStorage.getItem('userData');
      }
      storage()
    }, []);

    items = String(items);  

    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'white'}}>
        <Text>Calendar</Text>
        <Button title='test'
          onPress={()=>{
            alert(items)
          }}
        
        />

        <Button title='delete'
          onPress={()=>{
            AsyncStorage.removeItem('userData');
          }}  
        
        />
      </View>
      
      
    );
  }

  //Analyze화면
  function AnalyzeScreen(){
    return(
      <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'white'}}>
        <Text>Analyze</Text>
      </View>
    );
  }

  //Edit 화면
  function EditScreen(){
    return(
      <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'white'}}>
        <Text>Edit</Text>
      </View>
    );
  }

  function whenScreen({navigation, route}){

    let present = '';
    let ing = '';

    return(
      <View style={{flexDirection:'column', alignItems:'stretch', flex:1, backgroundColor:'white', justifyContent:'center'}}>
        <View style={styles.whenLayout}>
          <Text style={{fontWeight:'bold', fontSize:25,}}>감정의 원인은 {'\n'}  언제 발생했을까?</Text>
          <View style={styles.whenButtonList}>
            <Button 
              title="과거"
              onPress={()=>{
                present='past'
              }}
            />

            <Button 
              title="현재"
              onPress={()=>{
                present='present'
              }}
            />

            <Button title="미래"
              onPress={()=>{
                present='future'
              }}
            />

          </View>
          
        </View>

        <View style={styles.whenLayout}>
          <Text style={{fontWeight:'bold', fontSize:25}}>그 원인은 {'\n'}  지속되는거야?</Text>

          <View style={styles.whenButtonList}>
            <Button 
              title ="일시적"
              onPress={()=>{
                ing='temporary'
              }}
            />

            <Button 
              title ="지속적"
              onPress={()=>{
                ing='continuance'
              }}
            />

          </View>
          

        </View>

        <Pressable onPress={()=>{
          navigation.navigate('detail',{ing:ing,present:present,post:route.params.post})
        }}>
          <View style={styles.detailCommit}>
            <Text style={{color:'white', fontSize: 20,}}>다음으로</Text>
          </View>
        </Pressable>

        
      </View>
    );

  }

  const UselessTextInput = (props) => {
    return (
      <TextInput
        {...props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
        editable
      />
    );
  }

  //detail 화면
  function detailScreen({navigation, route}){

    const [value, onChangeText] = React.useState('');
    
    const token = getData('userData').then((value) => {
      return value;
    });
    //token output [object Object]
    const token2 = token.userId;
    //token2 output undefined
    var year = new Date().getFullYear();
    var month = new Date().getMonth()+1;
    var date = new Date().getDate();
    var hour = new Date().getHours();
    var min = new Date().getMinutes();

    const today =  year+ '-' + month + '-' + date + ' ' + hour + '시 ' + min + '분'

    const address =  '/users/' +  token +'/diary/' + today

    //const address = items
    return(
      <View style={{flexDirection:'column', alignItems:'stretch', flex:1, backgroundColor:'white', justifyContent:'center'}}>
        {/* <Text>{route.params.post}{route.params.present}{route.params.ing}</Text> */}

        <View style={styles.detailView}>
          <Text style={{fontWeight:'bold', fontSize:40}}>왜 그런 기분이 들어?</Text>
          <UselessTextInput
            multiline  
            numberOfLines={4}
            onChangeText={text => onChangeText(text)}
            value={value}
            style={{padding: 10, margin:10, color:'white'}}
            backgroundColor={'lightgray'}
            placeholder={'구체적인 활동을 이야기하면 분석의 정확도가 올라가요:)'}
          />
        </View>

        <View style={{alignItems:'center'}}>
          <Image source={require('./assets/commit.png')} style={{width:200, height:200}}/>
        </View>

        <Pressable onPress={()=>{
          database()
          .ref(address)
          .set({
            날짜: today,
            사분면: route.params.post,
            언제: route.params.present,
            지속적: route.params.ing,
            detail: value,
          })
          navigation.navigate('test')
        }}>
          <View style={styles.detailCommit}>
            <Text style={{color:'white', fontSize: 20,}}>제출할래요</Text>
          </View>
        </Pressable>
        
      </View>
    )
  }

  //네이게이터바
  function testScreen(){
    return(
      <Tab.Navigator screenOptions={{headerShown:false}}>
        <Tab.Screen 
          name="main" 
          component={MainScreen} 
          options={{
            tabBarLabel: 'Record',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="pencil" color={color} size={size} />
            ),
          }} 
        />
          
        <Tab.Screen 
          name="calendar" 
          component={CalendarScreen}
          options={{
            tabBarLabel: 'Calendar',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="calendar" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen 
          name="analyze" 
          component={AnalyzeScreen}
          options={{
            tabBarLabel: 'Analyze',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="server" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen 
          name="edit" 
          component={EditScreen}
          options={{
            tabBarLabel: 'Edit',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="hammer" color={color} size={size} />
            ),
          }}
        />
        
      </Tab.Navigator> 

    )
    
  }


  return (
    <> 
      
      <NavigationContainer>
        <Stack.Navigator initialRouteName='check'>
          <Stack.Screen name='check' component={checkScreen} options={{headerShown:false}}/>
          <Stack.Screen name='login' component={loginScreen} options={{headerShown:false}}/>
          <Stack.Screen name='first' component={firstScreen} options={{headerShown:false}}/>
          <Stack.Screen name='second' component={secondScreen} options={{headerShown:false}}/>
          <Stack.Screen name="test" component={testScreen} options={{headerShown:false}}/>
          <Stack.Screen name="when" component={whenScreen}/>
          <Stack.Screen name="detail" component={detailScreen}/>
        </Stack.Navigator>
      </NavigationContainer>

      
    </>
  );

};

const styles = StyleSheet.create({
  login:{
    flex:1,
    margin: 30,
    alignContent: 'center',
    justifyContent: 'center',
  },
  first:{
    backgroundColor:'white',
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },
  container :{
    backgroundColor:'white',
    flex : 1,
    alignItems : 'stretch',
    justifyContent : 'center',
  },
  allCenter :{
    flex:1,
    alignItems:'center',
    justifyContent: 'center',
    backgroundColor:'white',
  },
  mainTop :{
    //backgroundColor:'#E91E63',
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },
  mainMid :{
    //backgroundColor:'skyblue',
    flex:5,
    justifyContent:'center',
    alignItems:'center',
  },
  mainBottom :{
    //backgroundColor:'steelblue',
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'row',
  },
  detailView :{
    backgroundColor: 'white',
    marginTop: 50,
    alignItems: 'center',
  },
  detailCommit :{
    backgroundColor: '#00b050',
    marginTop: 50,
    marginBottom: 50,
    alignItems:'center',
    height: 50,
    justifyContent:'center',
    //flexDirection:'row-reverse',
  },
  detailBox:{
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor:'white',
  },
  textIncircle:{
    width:50, 
    height:50, 
    justifyContent:'center', 
    alignItems:'center',
  },
  whenLayout:{
    justifyContent: 'center',
    margin: 50,
    //alignItems: 'center',
  },
  whenButtonList:{
    flexDirection:'row',
    justifyContent: 'space-around',
  }
});

export default App;
