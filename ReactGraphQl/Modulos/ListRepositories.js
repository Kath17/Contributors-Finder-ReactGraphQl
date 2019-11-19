import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, ActivityIndicator,TouchableOpacity,ToastAndroid} from 'react-native';
import { ListItem } from 'react-native-elements';
import { useNavigation } from 'react-navigation-hooks'

import gpl from "graphql-tag";
import {useQuery} from '@apollo/react-hooks';

import CollaboratorsFromRepo from './ListUsersFromRepo';

const GET_REPOSITORIES = gpl`
    query ReposFromUser($props:String!, $cursor:String){
      user (login: $props) {
        repositories (first:10,after:$cursor){
            pageInfo{
                hasNextPage
                endCursor
                startCursor
            }
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
    const {loading, error, data, fetchMore} = useQuery(GET_REPOSITORIES,{
        variables: {props, cursor:null},
    });

    const navigation = useNavigation();

    if (loading) return <View style={styles.loading}><ActivityIndicator size="large" color="#aea8b0" animating/></View>
    if (error) return <Text style={styles.screen}>Error </Text>;
    return <FlatList 
            data={data.user.repositories.edges} 
            renderItem={({item}) => (
                <TouchableOpacity 
                    style={styles.touchable}
                    onPress={()=> {navigation.navigate('CollaboratorsScreen',{repo:item.node.name})}} >
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
            onEndReachedThreshold={1}
            onEndReached={()=>{
                fetchMore({
                    variables: {cursor:data.user.repositories.pageInfo.endCursor},
                    updateQuery: (previousResult, { fetchMoreResult }) => { 
                        const newEdges = fetchMoreResult.user.repositories.edges;
                        const pageInfo = fetchMoreResult.user.repositories.pageInfo;        
                        
                        console.log(previousResult.user.repositories);               
                        
                        if(!fetchMoreResult){
                            return previousResult;
                        }
                        return {
                            user:{
                                ...previousResult.user,
                                repositories:{
                                    __typename: previousResult.user.repositories.__typename,
                                    edges: [
                                        ...previousResult.user.repositories.edges,
                                        ...newEdges
                                    ],
                                    pageInfo
                                }
                            }
                        }
                    }
                })
            }}
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