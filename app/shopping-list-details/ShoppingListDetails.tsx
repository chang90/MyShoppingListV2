import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import SqlDatabase from '../shared-service/Sql-database';
import { ToDoItem } from './components/ToDoItem';
import { AddItem } from './components/AddItem';
const db = SqlDatabase.getConnection();

type RootStackParamList = {
  ShoppingListDetails: { shoppinglist_id: string };
  Feed: { sort: 'latest' | 'top' } | undefined;
};

type ShoppingListDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ShoppingListDetails'>;

type Props = {
  route: ShoppingListDetailsScreenRouteProp;
};

export type Item = {
  id: number;
  item_name: string;
  created_date: string;
  updated_date: string;
  expiry_date: string;
  notes: string;
  status: number;
}

export type CreateItemQuery = {
  id: number|null;
  item_name: string;
  notes: string;
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  }
})




export function ShoppingListDetailsScreen({ route }: Props) {
  const [table, setTable] = useState([]);
  const [itemSelected, setItemSelected] = useState<Item|null>(null);
  const { shoppinglist_id } = route.params;

  const deleteTodo = (id: number) => {
    db.transaction(
      tx => {
        // Remove tags with this item Id
        tx.executeSql(`DELETE FROM item_tags WHERE item_id = ${id};`);

        //Remove item
        tx.executeSql(`DELETE FROM items WHERE id = ${id};`);

        tx.executeSql(`select * from items where shoppinglist_id = ${shoppinglist_id}`, [], (_, { rows }) => {
          setTable((rows as any)._array);
        });
      }
    );
  }

  const updateTodoItem = (todo: any) => {
    console.log('update todo item', todo);
  }


  const add = (text: string) => {
    // is text empty?
    if (text === null || text === "") {
      return false;
    }
    db.transaction(
      tx => {
        const currentDate = new Date().toUTCString();

        tx.executeSql(`insert into items (item_name, created_date, updated_date, status, shoppinglist_id) values ('${text}', '${currentDate}', '${currentDate}', ${1}, ${shoppinglist_id})`, [], error =>
          console.log(error)
        );
        tx.executeSql(`select * from items where shoppinglist_id = ${shoppinglist_id}`, [], (_, { rows }) => {
          setTable((rows as any)._array);
        });
      }
    );
  }
  const handleModifyItem = (itemObj: Item | CreateItemQuery) => {
    db.transaction(
      tx => {
        const currentDate = new Date().toUTCString();
        if (itemObj.id != null) {
          // If already select an item, modify this item in DB
          tx.executeSql(`UPDATE items SET item_name = '${itemObj.item_name}', updated_date = '${currentDate}', notes = '${itemObj.notes}' WHERE id = '${itemObj.id}';`, [], error =>
            console.log(error)
          );
          tx.executeSql(`select * from items where shoppinglist_id = ${shoppinglist_id}`, [], (_, { rows }) => {
            setTable((rows as any)._array);
          });
        } else {
          //add new item into the list
          tx.executeSql(`insert into items (item_name, created_date, updated_date, notes, status, shoppinglist_id) values ('${itemObj.item_name}', '${currentDate}', '${currentDate}', '${itemObj.notes}', ${1}, ${shoppinglist_id})`, [], error =>
            console.log(error)
          );
        }
        setItemSelected(null);
        tx.executeSql(`select * from items where shoppinglist_id = ${shoppinglist_id}`, [], (_, { rows }) => {
          setTable((rows as any)._array);
        });
      });
  }
  const openUpEditor = (item: Item) => {
    if(item){
      setItemSelected(item);
      // Todo: open up modal
    }
    
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
    <View style={styles.container}>
      
      <ScrollView>
        
        {
          table.map((item: Item, index: number) => {
            return <ToDoItem key={index} todo={item} deleteTodo={deleteTodo} modifyItem={handleModifyItem} editItem={openUpEditor}></ToDoItem>
          })
        }
      </ScrollView>
      <Text>{itemSelected?.item_name}</Text>
      <AddItem modifyItem={handleModifyItem} itemSelected={itemSelected}/>
    </View>


  );
}