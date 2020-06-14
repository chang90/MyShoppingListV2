import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TextInput,
  Button
} from "react-native";
import { ShoppingList, CreateShoppingListQuery } from "../ShoppingList";

type Props = {
  modifyShoppingList: Function,
  unSelectShoppingList: Function,
  shoppingListSelected?: ShoppingList | null
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "space-between",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  addButton: {
    width: 70,
    height: 70,
    backgroundColor: '#e4d4f9',
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    position: "absolute",
    bottom: 100,
    right: 20

  },
  submitButton: {
    backgroundColor:'#009688',
    marginTop: 5,
    padding: 5,
    borderRadius: 5
  },
  submitButtonText:{
    color: "#fff",
    textAlign: "center"
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 70,
    textAlign: "left",
    marginBottom: 5
  },
  modalHeader: {
    display: "flex",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: "space-between"
  },
  modalTitle: {
    padding: 15,
    textAlign: "center",
    backgroundColor: '#fff',
  },
  modalCloseBtn: {
    margin: 15,
    width: 20,
    height: 20,
    backgroundColor: '#ccc',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    display: "flex",
    flexDirection: "column",
    margin: 15
  },
  inputBox: {
    borderColor: 'gray',
    borderWidth: 1
  },
  colorTag: {
    backgroundColor: "#ccc",
    margin: 3,
    padding: 3
  },
  tagGroup: {
    display: "flex",
    flexDirection: "row",
  }
});

export function AddShoppingList({ shoppingListSelected, modifyShoppingList, unSelectShoppingList }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [shoppingListName, setShoppingListName] = useState('');

  const addOrEditShoppingList = () => {
    // is text empty?
    if (shoppingListName === null || shoppingListName === "") {
      return false;
    }
    if(!shoppingListSelected) {
      const newShoppingListObj: CreateShoppingListQuery = {
        shopping_list_name: shoppingListName
      }
      modifyShoppingList(newShoppingListObj);
    } else {
      modifyShoppingList({...shoppingListSelected, 'shoppingList_name': shoppingListName});
    }
    setModalVisible(!modalVisible);
    setShoppingListName('');
  }

  React.useEffect(() => {
    if(shoppingListSelected) {
      setModalVisible(true);
      setShoppingListName(shoppingListSelected?.shopping_list_name);
    } else {
      setShoppingListName('');
    }
    
  }, [shoppingListSelected]);
  return (
    <View style={styles.buttonContainer}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{shoppingListSelected ? 'Edit': 'Add new shoppingList'}</Text>
              <TouchableHighlight
                style={styles.modalCloseBtn}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  unSelectShoppingList();
                }}
              >
                <Text>x</Text>
              </TouchableHighlight>
            </View>

            <View style={styles.modalBody}>
              <Text>shoppingList name</Text>
              <TextInput
                style={styles.inputBox}
                onChangeText={text => setShoppingListName(text)}
                value={shoppingListName}
              />
              <TouchableHighlight
                style={styles.submitButton}
                onPress={addOrEditShoppingList}>
                <Text style={styles.submitButtonText}>{shoppingListSelected ? 'Edit': 'Add'}</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>

      <Button
        title="add"
        onPress={() => {
          setModalVisible(true);
        }}
      />
    </View>
  );
};


