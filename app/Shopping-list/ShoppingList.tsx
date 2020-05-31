import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableHighlightBase } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as SQLite from 'expo-sqlite';
import SqlDatabase from '../shared-service/Sql-database';
const db = SqlDatabase.getConnection();

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
export function ShoppingListScreen({ route, navigation }: Props) {
  const [ table, setTable ] = useState([]);
  const { userId } = route.params;

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
        });
      }
    );
  }
  
  React.useEffect(() => {
    db.transaction(tx => {
      console.log('create')
      tx.executeSql("select * from items", [], (_, { rows }) => {
        setTable((rows as any)._array);
        })
      tx.executeSql(`select * from users where id = ${userId}`, [], (_, { rows }) => {
          console.log('row',rows)
        });
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
        onPress={()=>{add('pear')}}
      />
      <View>
        {
          table.map((item: Item, index:number ) => {
          return <Text key={index}>{item.id} {item.item_name}</Text>
          })
        }
      </View>
    </View>
    
  );
}