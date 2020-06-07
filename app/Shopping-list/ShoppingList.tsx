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

type Shopping_list = {
  id: number;
  shopping_list_name: string;
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
        tx.executeSql(`INSERT INTO shopping_lists (shopping_list_name, created_date, updated_date, user_id ) VALUES ('today''s shopping list', '${currentDate}','${currentDate}',${userId});`);
        tx.executeSql("select * from shopping_lists", [], (_, { rows }) => {
          setTable((rows as any)._array);
        });
      }
    );
  }
  
  React.useEffect(() => {
    db.transaction(tx => {
      tx.executeSql("SELECT id FROM shopping_lists WHERE id=1;", [], (_, { rows }) => {
        console.log(rows.length)
        if (rows.length == 0) {
          console.log('add default shopping list')
          // create default shoppinglist
          const currentDate = new Date().toUTCString();
          tx.executeSql(`INSERT INTO shopping_lists (shopping_list_name, created_date, updated_date, user_id ) VALUES ('today''s shopping list', '${currentDate}','${currentDate}',${userId});`);
        }
        tx.executeSql("select * from shopping_lists", [], (_, { rows }) => {
          setTable((rows as any)._array);
          })
      })
    });
  }, []);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View>
        {
          table.map((shopping_list: Shopping_list, index:number ) => {
          return <Text key={index}>{shopping_list.id} {shopping_list.shopping_list_name}</Text>
          })
        }
      </View>
      <Button
        title="add"
        onPress={()=>{add('pear')}}
      />
      
    </View>
    
  );
}