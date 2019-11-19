import React from 'react';
import { View, Text, StyleSheet} from 'react-native';

// ----------------------- Header --------------------//
const Header = props => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>{props.title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header:{
        width: '100%',
        height: 50,
        paddingTop:0,
        backgroundColor: '#7d3c98',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerTitle:{
        color:'white',
        fontSize: 18
    }
});

export default Header;