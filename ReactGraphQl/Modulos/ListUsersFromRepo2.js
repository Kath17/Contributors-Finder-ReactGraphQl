import React, {useState} from 'react';
import {View, Text, StyleSheet,FlatList, ActivityIndicator,TouchableOpacity,ToastAndroid} from 'react-native';
import { ListItem } from 'react-native-elements';

import gpl from "graphql-tag";
import {useQuery} from '@apollo/react-hooks';

const GET_USERS = gpl`
    query CollaboratorsFromRepo($repo:String!){
        repository(owner: $repo, name: "GatosyPerros") 
        {
            id
            name
            collaborators(first: 10, affiliation: ALL) {
                pageInfo{
                    hasNextPage
                    endCursor
                    startCursor
                }
                edges {
                    permission
                    node {
                      id
                      login
                      name
                      location
                      avatarUrl
                      commitComments{
                        totalCount
                      }
                    }
                }
            }
        }
    }
`;

function CollaboratorsFromRepo2({repo}) {

    const {loading, error, data, fetchMore} = useQuery(GET_USERS,{
      variables: {repo},
    })
//    if (loading) return <Text style={styles.screen}>Loading ...</Text>;
//    if (error) return <Text style={styles.screen}>Error </Text>;
//    return data.repository.collaborators.edges.map(({node},i)=>(
//        <View key={i} style={styles.screen}>
//            <Text >{`${node.name} -> ${node.login} `} </Text>
//        </View>
//    ));

    if (loading) return <View style={styles.loading}><ActivityIndicator size="large" color="#aea8b0" animating/></View>
    if (error) return <Text style={styles.screen}>Error </Text>;
    return <FlatList 
            data={data.repository.collaborators.edges} 
            renderItem={({item}) => (
                <TouchableOpacity 
                    style={styles.touchable}
                    onPress={()=>{ToastAndroid.show(item.node.name,ToastAndroid.SHORT) }}>
                    <ListItem 
                        roundAvatar
                        title = {item.node.name}
                        subtitle = {item.node.login} 
                        rightTitle = {item.node.location}
                        rightSubtitle = {`Commits: ${item.node.commitComments.totalCount}`}
                        leftAvatar= {{ rounded: true,source: { uri: item.node.avatarUrl } }}
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
                    variables: {cursor:data.repository.collaborators.pageInfo.endCursor},
                    updateQuery: (previousResult, { fetchMoreResult }) => { 
                        const newEdges = fetchMoreResult.repository.collaborators.edges;
                        const pageInfo = fetchMoreResult.repository.collaborators.pageInfo;        
                        
                        console.log(previousResult.repository.collaborators);               
                        
                        if(!fetchMoreResult){
                            return previousResult;
                        }
                        return {
                            user:{
                                ...previousResult.user,
                                repositories:{
                                    __typename: previousResult.repository.collaborators.__typename,
                                    edges: [
                                        ...previousResult.repository.collaborators.edges,
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
  
export default CollaboratorsFromRepo2;