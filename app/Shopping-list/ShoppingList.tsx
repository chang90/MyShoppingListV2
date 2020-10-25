import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import SqlDatabase from '../shared-service/Sql-database';
import { ShoppingListItem } from './components/ShoppingListItem';
import { AddShoppingList } from './components/AddShoppingList';

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

  const handleModifyShoppingList = async (ShoppingListObj: ShoppingList | CreateShoppingListQuery) => {

    if (ShoppingListObj.id != null) {
      // If already select a shopping list, modify this item in DB
      await SqlDatabase.updateShoppingList(ShoppingListObj as ShoppingList);
    } else {
      // Add new shopping list into the list
      await SqlDatabase.createShoppingList(ShoppingListObj as CreateShoppingListQuery, userId)
    }
    setShoppingListSelected(null);
    const shoppingListData = await SqlDatabase.checkShoppingLists(userId) as any;
    setTable((shoppingListData as any)._array);
  }

  const unSelectShoppingList = () => {
    setShoppingListSelected(null);
  }

  React.useEffect(() => {
    const runEffect = async () => {
      console.log('call',userId)
      const shoppingListData = await SqlDatabase.checkShoppingLists(userId) as any;
      console.log(shoppingListData)
      setTable((shoppingListData as any)._array);
    };
    runEffect();
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