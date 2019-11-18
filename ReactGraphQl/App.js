import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableWithoutFeedback, Keyboard, ScrollView} from 'react-native';

import {ApolloProvider} from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';

import Header from './Modulos/Header';
import Repositories from './Modulos/ListRepositories';

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

export default function App() {
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
      <TouchableWithoutFeedback
        onPress={()=>{
          Keyboard.dismiss();
        }}
      >
        <View style={styles.container}>
          <Header title="Github Repositories"/>
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
            <ScrollView>
              <ApolloProvider client={client}>
                <Repositories props={enteredValue}/>
              </ApolloProvider>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
  else{
    return (
      <TouchableWithoutFeedback
        onPress={()=>{
          Keyboard.dismiss();
        }}
      >
        <View style={styles.container}>
          <Header title="Github Repositories"/>
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
            <ScrollView>
              <ApolloProvider client={client}>
                <Text style = {styles.showConfirmation}> No hay búsquedas</Text>
              </ApolloProvider>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //marginTop:40,
    //backgroundColor: '#fff',
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  inputContainer: {
    padding:10,
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
    marginLeft:10,
    marginRight:10,
    marginBottom:5
  },
});
