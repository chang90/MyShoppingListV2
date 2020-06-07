import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Feed: { sort: 'latest' | 'top' } | undefined;
  ShoppingListDetails: { shoppinglist_id: number };
};

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Profile'
>;

type Props = {
  route: ProfileScreenRouteProp;
  navigation: ProfileScreenNavigationProp;
  shoppingListId: number;
  shoppingListTitle: string;
  key: number;
};

const styles = StyleSheet.create({
  shoppingListContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#ccc'
  },
  shoppingListTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: "center",
    padding: 10
  },
  detailsBtn: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    height: "auto",
    backgroundColor: 'rgba(255, 0, 255, 0)',
    color: '#009688'
  }
});

export function ShoppingListItem({ shoppingListTitle, shoppingListId, navigation }: Props) {
  return (
    <View style={styles.shoppingListContainer}>
      <View style={styles.shoppingListTitle}>
        <Text>{shoppingListTitle}</Text>
      </View>
      <TouchableOpacity
        style={styles.shoppingListTitle}
        onPress={() => navigation.navigate('ShoppingListDetails', { shoppinglist_id: shoppingListId })}
      >
        <Text>></Text>
      </TouchableOpacity>
    </View>
  );
}