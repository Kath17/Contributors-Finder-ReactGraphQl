import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import gpl from "graphql-tag";
import {useQuery} from '@apollo/react-hooks';

const GET_USERS = gpl`
    query ReposFromUser($repo:String!){
        repository(owner: "Kath17", name: $repo) 
        {
            id
            name
            collaborators(first: 10, affiliation: ALL) {
              edges {
                permission
                node {
                  id
                  login
                  name
                }
              }
            }
        }
    }
`;

function CollaboratorsFromRepo({repo},{client}) {
    const {loading, error, data} = useQuery(GET_USERS,{
      variables: {repo},
    });
  
    if (loading) return <Text style={styles.screen}>Loading ...</Text>;
    if (error) return <Text style={styles.screen}>Error </Text>;
    return data.repository.collaborators.edges.map(({node},i)=>(
      <View key={i} style={styles.screen}>
          <Text >{`${node.name} -> ${node.login} `} </Text>
      </View>
    ));
  }
  
const styles  = StyleSheet.create({
    screen: {
      //flex: 1,
      padding: 12
      //alignItems: 'center'
    }
});
  
export default CollaboratorsFromRepo;
