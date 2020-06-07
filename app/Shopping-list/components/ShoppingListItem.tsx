import React from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Feed: { sort: 'latest' | 'top' } | undefined;
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
    flex: 1
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
    height: "auto"
  }
});

export function ShoppingListItem({ shoppingListTitle, navigation }: Props) {
  return (
    <View style={styles.shoppingListContainer}>
      <View style={styles.shoppingListTitle}>
        <Text>{shoppingListTitle}</Text>
      </View>
      <Button
        onPress={() => navigation.navigate('Profile')}
        title="Press Me"
      />
    </View>
  );
}