import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, CheckBox, Button, Alert, ToastAndroid } from 'react-native';
import { Item } from '../ShoppingListDetails';

type Props = {
  todo: Item;
  deleteTodo: Function;
  modifyItem: Function;
  editItem: Function;
  key: number;
};

type Color = {
  veryfresh: boolean;
  nearexpire: boolean;
  isexpired: boolean;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: "#F5F5F5",
    paddingTop: 30,
    paddingLeft: 10,
    paddingRight: 10,
  },
  content: {
    flex: 1,
    flexDirection: 'row'
  },
  button: {
    color: '#b131d8'
  },
  expire_date: {
    flex: 1
  },
  gray_color: {
    color: "#ccc"
  },
  red_color: {
    color: "red"
  },
  dark_gray_color: {
    color: "#50555b",
    textDecorationLine: "line-through"
  }
})

const findStatusColor = (expireDate: Date | null): Color | null => {
  if(!expireDate){
    return null;
  }
  let num = Math.floor ((Number(expireDate) - Date.now()) / ( 24 * 3600 * 1000 ))+1
  if(num<3 && num>=0){
    return {
      veryfresh:false,
      nearexpire:true,
      isexpired:false
    }
  }
  else if(num<0){
    return {
      veryfresh:false,
      nearexpire:false,
      isexpired:true
    }
  }
  else{
    return {
      veryfresh:true,
      nearexpire:false,
      isexpired:false
    }
  }
}

const deleteTodoWithConfirm = (todo: any, callback: Function) => {
  Alert.alert(
    'Are you sure to delete ' + todo.item_name + '?',
    'This operation cannot be undone',
    [		    
      {text: 'Yes', onPress: () => callback(todo.id)},
      {text: 'No', onPress: () =>{} },
    ],
    { cancelable: true }
  )  
}

const handleChange = (todo: any, callback: Function) => {
  todo.isDone = !todo.isDone
  
  if(todo.isDone && todo.easyToexpired) {
    ToastAndroid.showWithGravity('please enter item expire date', ToastAndroid.SHORT, ToastAndroid.TOP);
  }
  callback(todo);
};

export function ToDoItem({ todo, deleteTodo, modifyItem, editItem }: Props) {
  const { item_name, notes, status } = todo;
  const expiry_date: Date | null = todo.expiry_date ? new Date(todo.expiry_date) : null;
  let color: Color = {
    veryfresh: false,
    nearexpire: false,
    isexpired: false
  } 
  color = findStatusColor(expiry_date) || color;
  const isDone: boolean = todo.status > 1;
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <CheckBox value={isDone} onValueChange={()=>{handleChange(todo, modifyItem)}} />
        <TouchableOpacity onPress={()=>{editItem(todo)}}>
          <Text>{item_name}</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.expire_date, color.veryfresh && styles.gray_color, color.nearexpire && styles.red_color, color.isexpired && styles.dark_gray_color]}>
        {(expiry_date != null) ? ("Expire date:\n" + expiry_date.getFullYear() + "/" + (expiry_date.getMonth() + 1) + "/" + expiry_date.getDate()) : ""}
      </Text>
      <TouchableOpacity style={styles.content} onPress={()=>{deleteTodoWithConfirm(todo, deleteTodo)}}>
        <Text>delete</Text>
      </TouchableOpacity>
    </View>
  );
}