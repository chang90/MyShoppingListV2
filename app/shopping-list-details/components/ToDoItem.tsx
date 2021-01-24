import React from 'react';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StyleSheet, View, Text, TouchableOpacity, Button, Alert, ToastAndroid } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { ITEM_STATUS } from '../../enums/item-status.enum';
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
  if (!expireDate) {
    return null;
  }
  let num = Math.floor((Number(expireDate) - Date.now()) / (24 * 3600 * 1000)) + 1
  if (num < 3 && num >= 0) {
    return {
      veryfresh: false,
      nearexpire: true,
      isexpired: false
    }
  }
  else if (num < 0) {
    return {
      veryfresh: false,
      nearexpire: false,
      isexpired: true
    }
  }
  else {
    return {
      veryfresh: true,
      nearexpire: false,
      isexpired: false
    }
  }
}

const deleteTodoWithConfirm = (todo: any, callback: Function) => {
  Alert.alert(
    'Are you sure to delete ' + todo.item_name + '?',
    'This operation cannot be undone',
    [
      { text: 'Yes', onPress: () => callback(todo.id) },
      { text: 'No', onPress: () => { } },
    ],
    { cancelable: true }
  )
}



export function ToDoItem({ todo, deleteTodo, modifyItem, editItem }: Props) {
  const { item_name, notes, status } = todo;
  let color: Color = {
    veryfresh: false,
    nearexpire: false,
    isexpired: false
  }
  const isDone: boolean = todo.status > 1;
  const [date, setDate] = useState(todo.expiry_date ? new Date(todo.expiry_date): null);
  color = findStatusColor(date) || color;
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate?: Date | undefined) => {
    setShow(false);
    todo.status = ITEM_STATUS.Brought;
    todo.expiry_date = selectedDate?.toString() || new Date().toString()
    if(selectedDate) {
      setDate(selectedDate)
    }
    console.log(todo)
    modifyItem(todo);
  };

  const handleChange = (todo: any, callback: Function) => {

    // Unfinished feature
    if (todo?.status === ITEM_STATUS.Require && (todo?.tag_id_array.charAt(0)) === '1') {
      Alert.alert(
        "This item has tag `easy to expired`",
        "please enter item expire date",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          {
            text: "OK", onPress: () => {
              setShow(true);
              if(todo.expiry_date) {
                setDate(new Date(todo.expiry_date));
              } else {
                setDate(new Date())
              }
              
            }
          }
        ],
        { cancelable: false }
      );
    } else {
      if (todo.status === ITEM_STATUS.Require) {
        todo.status = ITEM_STATUS.Brought;
      } else {
        todo.status = ITEM_STATUS.Require;
      }
      callback(todo);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <CheckBox value={isDone} onValueChange={() => { handleChange(todo, modifyItem) }} />
        <TouchableOpacity onPress={() => { editItem(todo) }}>
          <Text>{item_name}</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.expire_date, color.veryfresh && styles.gray_color, color.nearexpire && styles.red_color, color.isexpired && styles.dark_gray_color]}>
        {(date != null) ? ("Expire date:\n" + date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate()) : ""}
      </Text>
      <TouchableOpacity style={styles.content} onPress={() => { deleteTodoWithConfirm(todo, deleteTodo) }}>
        <Text>delete</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date ? date: new Date()}
          mode='date'
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
}