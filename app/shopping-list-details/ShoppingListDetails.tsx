import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { Text, ScrollView, View, Button } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import SqlDatabase from '../shared-service/Sql-database';
import { ToDoItem } from './components/ToDoItem';
const db = SqlDatabase.getConnection();

type RootStackParamList = {
  ShoppingListDetails: { shoppinglist_id: string };
  Feed: { sort: 'latest' | 'top' } | undefined;
};

type ShoppingListDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ShoppingListDetails'>;

type Props = {
  route: ShoppingListDetailsScreenRouteProp;
};

const deleteTodo = () =>{
  console.log('delete todo item');
}

const updateTodoItem = (todo: any) => {
  console.log('update todo item', todo);
}

export type Item = {
  id: number;
  item_name: string;
  created_date: string;
  updated_date: string;
  expiry_date: string;
  notes: string;
  status: number;
}
export function ShoppingListDetailsScreen({ route }: Props) {
  const [ table, setTable ] = useState([]);
  const { shoppinglist_id } = route.params;

  const add = (text: string) => {
    // is text empty?
    if (text === null || text === "") {
      return false;
    }
    db.transaction(
      tx => {
        const currentDate = new Date().toUTCString();
      
        tx.executeSql(`insert into items (item_name, created_date, updated_date, status, shoppinglist_id) values ('${text}', '${currentDate}', '${currentDate}', ${1}, ${shoppinglist_id})`,[], error => 
          console.log(error)
        );
        tx.executeSql(`select * from items where shoppinglist_id = ${shoppinglist_id}`, [], (_, { rows }) => {
          setTable((rows as any)._array);
        });
      }
    );
  }
  
  React.useEffect(() => {
    db.transaction(tx => {
      console.log('create')
      tx.executeSql(`select * from items where shoppinglist_id = ${shoppinglist_id}`, [], (_, { rows }) => {
        setTable((rows as any)._array);
      })
    });
  }, []);
  return (
    <ScrollView >

      {
        table.map((item: Item, index:number ) => {
          return <ToDoItem key={index} todo={item} deleteTodo={deleteTodo} updateTodoItem={updateTodoItem}></ToDoItem>
        })
      }
      <Button
        title="add"
        onPress={()=>{add('apple')}}
      />
    </ScrollView>
    
  );
}