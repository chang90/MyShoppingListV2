import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableHighlightBase } from 'react-native';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase("ShoppingList.db");

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
};

type Item = {
  id: number;
  item_name: string;
}
export function HomeScreen({ route, navigation }: Props) {
  const [ table, setTable ] = useState([]);

  const add = (text: string) => {
    // is text empty?
    if (text === null || text === "") {
      return false;
    }

    db.transaction(
      tx => {
        const currentDate = new Date().toUTCString();
      
        tx.executeSql(`insert into items (item_name, create_date, update_date, status, shoppinglist_id) values ('${text}', '${currentDate}', '${currentDate}', ${1}, ${1})`,[], error => 
          console.log(error)
        );
        tx.executeSql("select * from items", [], (_, { rows }) => {
          setTable((rows as any)._array);
        }
      );
      }
    );
  }
  React.useEffect(() => {
    db.transaction(tx => {
      console.log('create')
      tx.executeSql(
        "create table if not exists items (id integer primary key not null, item_name text, create_date text, update_date text, expiry_date text, notes text, status number not null, tags blobs, shoppinglist_id integer not null);")
      tx.executeSql("select * from items", [], (_, { rows }) => {
        setTable((rows as any)._array);
        })
    });
  }, []);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="dashboard"
        onPress={() => navigation.navigate('Profile')}
      />
      <Button
        title="add"
        onPress={()=>{add('apple')}}
      />
      <View>
        {
          table.map((item: Item) => {
          return <Text>{item.id} {item.item_name}</Text>
          })
        }
      </View>
    </View>
    
  );
}