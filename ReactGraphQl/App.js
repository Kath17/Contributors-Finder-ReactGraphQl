import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableWithoutFeedback, Keyboard, ScrollView, FlatList} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import {ApolloProvider} from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';

import Header from './Modulos/Header';
import Repositories from './Modulos/ListRepositories';
import CollaboratorsFromRepo from './Modulos/ListUsersFromRepo';
import CollaboratorsFromRepo2 from './Modulos/ListUsersFromRepo2';

// --------------------- Apollo Client ---------------------//
const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  request: async operation =>{
    //const token = await AsyncStorage.getItem("token");
    operation.setContext({
      headers:{
        authorization: `token API_KEY`
      }
    });
  }
});

// -------------------------- App ----------------------------//
//export default function App() {
//class HomeScreen extends React.Component{
  //render(){
function HomeScreen () {
  const [enteredUser, setEnteredUser] = useState('');
  const [enteredValue, setEnteredValue] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const userInputHandler = (enteredText) => {
    setEnteredUser(enteredText);
  };

  const confirmInputHandler = () =>{
    if(enteredUser.length === 0){
      Alert.alert('Input vacío','Debe ingresar algún usuario',[{text:'Ok',style: 'destructive'}])
      return;
    }
    console.log(enteredUser);
    setEnteredValue(enteredUser);
    setEnteredUser('');
    setConfirmed(true);
  };
  let confirmedOutput;

  if(confirmed){
    confirmedOutput = <Text>Búsqueda: {enteredValue}</Text>
    return (
      //<Header title="Github Repositories"/>
      <TouchableWithoutFeedback
        onPress={()=>{
          Keyboard.dismiss();
        }}
      >
        <View style={styles.container}>
          <View style = {styles.inputContainer}>
            <TextInput
              placeholder = "Search github user"
              style={styles.input}
              onChangeText = {userInputHandler}
              value={enteredUser} />
            <Button color='#7d3c98' title="Search" onPress={confirmInputHandler}/>
          </View>
          <View style = {styles.showConfirmation}>
            {confirmedOutput}
          </View>
          <View onStartShouldSetResponder={() => true}>
            <ApolloProvider client={client}>
              <Repositories props={enteredValue}/>
            </ApolloProvider>
          </View>
        </View>
      </TouchableWithoutFeedback>
      //<CollaboratorsFromRepo2 repo={enteredValue}/>
      //<CollaboratorsFromRepo repo={enteredValue}/>
      //<Repositories props={enteredValue} navigation={navigator}/>
    );
  }
  else{
    return (
      //<Header title="Github Repositories"/>
      <TouchableWithoutFeedback
        onPress={()=>{
          Keyboard.dismiss();
        }}
      >
        <View style={styles.container}>
          <View style = {styles.inputContainer}>
            <TextInput
              placeholder = "Search github user"
              style={styles.input}
              onChangeText = {userInputHandler}
              value={enteredUser} />
            <Button color='#7d3c98' title="Search" onPress={confirmInputHandler}/>
          </View>
          <View style = {styles.showConfirmation}>
            {confirmedOutput}
          </View>
          <View onStartShouldSetResponder={() => true}>
            <ApolloProvider client={client}>
              <Text style = {styles.showConfirmation}>No hay búsquedas</Text>
            </ApolloProvider>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
//}
}

const AppNavigator = createStackNavigator({
    Home: {
      screen: HomeScreen,
      navigationOptions: ({ navigation }) => ({
        title: `Github Repositories`,
        headerTintColor: '#7d3c98'
      })
    },
    RepositoriesScreen: {
      screen: Repositories,
    },
    CollaboratorsScreen:{
      screen: CollaboratorsFromRepo,
      navigationOptions: ({ navigation }) => ({
        title: `Collaborators`,
        headerTintColor: '#7d3c98'
      })
    }
  }
);

const App = createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    //marginTop:40,
    backgroundColor: '#fff',
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  inputContainer: {
    marginLeft:14,
    marginRight:14,
    marginTop:10,
    marginBottom:4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  input: {
    width: '80%',
    height: 35,
    borderColor: '#7d3c98',
    borderWidth: 0.4,
    padding: 10
  },
  screen: {
    //flex: 1,
    padding: 12
    //alignItems: 'center'
  },
  showConfirmation: {
    marginLeft:14,
    marginRight:14,
    marginBottom:4
  },
});

export default App;
