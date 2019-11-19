import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, ActivityIndicator,TouchableOpacity,ToastAndroid} from 'react-native';
import { ListItem } from 'react-native-elements';

import gpl from "graphql-tag";
import {useQuery} from '@apollo/react-hooks';

const GET_REPOSITORIES = gpl`
    query ReposFromUser($props:String!){
      user (login: $props) {
        repositories (first:20){
          edges {
            node {
              id
              description
              name
              pullRequests {
                totalCount
              }
            }
          }
        }
      }
    }
`;

function Repositories ({props}) {
    const {loading, error, data} = useQuery(GET_REPOSITORIES,{
        variables: {props},
    });

    if (loading) return <View style={styles.loading}><ActivityIndicator size="large" color="#aea8b0" animating/></View>
    if (error) return <Text style={styles.screen}>Error </Text>;
    return <FlatList 
            data={data.user.repositories.edges} 
            renderItem={({item}) => (
                <TouchableOpacity style={styles.touchable}
                    onPress={()=>ToastAndroid.show(item.node.name, ToastAndroid.SHORT)}>
                    <ListItem 
                        title = {item.node.name}
                        subtitle = {item.node.description} 
                        rightSubtitle = {`PR Count: ${item.node.pullRequests.totalCount}`} 
                    />
                </TouchableOpacity>
                )}
            keyExtractor={item => item.node.id}
            ItemSeparatorComponent={({highlighted}) => (
                <View style={[styles.separator, highlighted && {marginLeft: 0}]} />
                )}
            />;
    //    data.user.repositories.edges.map(({node},i)=>(
    //    <View key={i} style={styles.screen}>
    //        <Text >{`${node.name} -> ${node.description} and ${node.pullRequests.totalCount}`} </Text>
    //    </View>
    //));
}

const styles  = StyleSheet.create({
    screen: {
      //flex: 1,
      padding: 14
      //alignItems: 'center'
    },
    separator:{
        height:0.8,
        width:'100%',
        backgroundColor: '#dedcde'
    },
    loading:{
        //flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    touchable:{
        flex:1,
        marginBottom:2
    }
});

export default Repositories