import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { Text, ScrollView, Button } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import SqlDatabase from '../shared-service/Sql-database';
import { ShoppingListItem } from './components/ShoppingListItem';
import { AddShoppingList } from './components/AddShoppingList';
const db = SqlDatabase.getConnection();

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
};

export type ShoppingList = {
  id: number;
  shopping_list_name: string;
}

export type CreateShoppingListQuery = {
  id?: number;
  shopping_list_name: string;
}
export function ShoppingListScreen({ route, navigation }: Props) {
  const [table, setTable] = useState([]);
  const [shoppingListSelected, setShoppingListSelected] = useState<ShoppingList|null>(null);
  const { userId } = route.params;

  const handleModifyShoppingList = (ShoppingListObj: ShoppingList | CreateShoppingListQuery) => {
    db.transaction(
      tx => {
        const currentDate = new Date().toUTCString();
        if (ShoppingListObj.id != null) {
          // If already select a shopping list, modify this item in DB
          tx.executeSql(`UPDATE shopping_lists SET shopping_list_name = '${ShoppingListObj.shopping_list_name}', updated_date = '${currentDate}' WHERE id = '${ShoppingListObj.id}';`, [], error =>
            console.log(error)
          );
        } else {
          //add new shopping list into the list
          tx.executeSql(`INSERT INTO shopping_lists (shopping_list_name, created_date, updated_date, user_id ) VALUES ('${ShoppingListObj.shopping_list_name}', '${currentDate}','${currentDate}',${userId});`, [], error =>
            console.log(error)
          );
        }
        setShoppingListSelected(null);
        tx.executeSql(`SELECT * FROM shopping_lists WHERE user_id = ${userId}`, [], (_, { rows }) => {
          setTable((rows as any)._array);
        });
      });
  }

  const unSelectShoppingList = () => {
    setShoppingListSelected(null);
  }

  React.useEffect(() => {
    db.transaction(tx => {
      tx.executeSql("SELECT id FROM shopping_lists WHERE id=1;", [], (_, { rows }) => {
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
    <ScrollView>
      {
        table.map((shopping_list: ShoppingList, index: number) => {
          return <ShoppingListItem
            shoppingListId ={shopping_list.id}
            shoppingListTitle = {shopping_list.shopping_list_name}
            route = {route}
            navigation = {navigation}
            key={index}
           />
        })
      }
      <AddShoppingList modifyShoppingList={handleModifyShoppingList} shoppingListSelected={shoppingListSelected} unSelectShoppingList={unSelectShoppingList}/>
    </ScrollView>  
  );
}