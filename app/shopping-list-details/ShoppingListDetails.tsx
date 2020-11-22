import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import SqlDatabase from '../shared-service/Sql-database';
import { ToDoItem } from './components/ToDoItem';
import { AddItem } from './components/AddItem';

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
  tag_id_array: string
}

export type CreateItemQuery = {
  id: number | null;
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
  const [itemSelected, setItemSelected] = useState<Item | null>(null);
  const { shoppinglist_id } = route.params;

  const deleteTodo = async (id: string) => {
    // Remove tags with this item Id
    await SqlDatabase.deleteItemsTagsRelationshipByItemId(id);

    //Remove item
    await SqlDatabase.deleteItem(id);

    const itemListData = await SqlDatabase.checkItemsList(shoppinglist_id);
    setTable((itemListData as any)._array);
  }

  const unSelectItem = () => {
    setItemSelected(null);
  }

  const handleModifyItem = async (itemObj: Item | CreateItemQuery, itemTagsArr?: Array<string>) => {
    if (itemObj.id != null) {
      // If already select an item, modify this item in DB
      await SqlDatabase.updateItem(itemObj as Item);
    } else {
      //add new item into the list
      const newItemId = await SqlDatabase.createNewItem(itemObj, shoppinglist_id);
      // add all itemTags
      if(newItemId && itemTagsArr) {
        itemTagsArr.forEach(async (itemTag: string)=> {
          await SqlDatabase.activeTag(Number(itemTag), newItemId)
        })
      }
    }
    setItemSelected(null);
    const itemListData = await SqlDatabase.checkItemsList(shoppinglist_id);
    setTable((itemListData as any)._array);
  }
  const openUpEditor = (item: Item) => {
    if (item) {
      setItemSelected(item);
    }

  }

  const refreshItemSelected = async() => {
    const itemListData = await SqlDatabase.checkItemsList(shoppinglist_id);
    setTable((itemListData as any)._array);
    const newSelectedItem = (itemListData?._array as Array<Item>).find(item => item.id === itemSelected?.id);
    setItemSelected(newSelectedItem || null);
  }

  React.useEffect(() => {
    const runEffect = async () => {
      const itemListData = await SqlDatabase.checkItemsList(shoppinglist_id);
      setTable((itemListData as any)._array);
    };
    runEffect();
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
      <AddItem modifyItem={handleModifyItem} itemSelected={itemSelected} unSelectItem={unSelectItem} refreshItemSelected={refreshItemSelected}/>
    </View>


  );
}