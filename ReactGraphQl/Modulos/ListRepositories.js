import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import gpl from "graphql-tag";
import {useQuery} from '@apollo/react-hooks';

const GET_REPOSITORIES = gpl`
    query ReposFromUser($props:String!){
      user (login: $props) {
        repositories (first:20){
          edges {
            node {
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

    if (loading) return <Text style={styles.screen}>Loading ...</Text>;
    if (error) return <Text style={styles.screen}>Error </Text>;
    return data.user.repositories.edges.map(({node},i)=>(
        <View key={i} style={styles.screen}>
            <Text >{`${node.name} -> ${node.description} and PR Count: ${node.pullRequests.totalCount}`} </Text>
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

export default Repositories;