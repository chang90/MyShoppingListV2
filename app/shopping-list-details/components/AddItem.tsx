import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TextInput
} from "react-native";
import { CreateItemQuery, Item } from "../ShoppingListDetails";
import SqlDatabase from "../../shared-service/Sql-database";
import { TagsContainer } from "./TagsContainer";

type Props = {
  modifyItem: Function,
  unSelectItem: Function,
  itemSelected?: Item | null
};

export type Tag = {
  id: number, 
  tagName: string,
  createdDate: string,
  updatedDate: string,
  default_tag: true,
  color: string
};

type Styles = {[key: string]: Object};

const styles = StyleSheet.create<Styles>({
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
    margin: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 3
  },
  tagGroup: {
    display: "flex",
    flexDirection: "row",
  }
});

export function AddItem({ itemSelected, modifyItem, unSelectItem }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemNote, setItemNote] = useState('');
  const [tagLists, setTagLists] = useState([] as Tag[]);
  const [itemTagsArr, setItemTagsArr] = useState([] as Array<string>);

  const addOrEditItem = () => {
    // is text empty?
    if (itemName === null || itemName === "") {
      return false;
    }
    if(!itemSelected) {
      const newItemObj: CreateItemQuery = {
        id: null,
        item_name: itemName,
        notes: itemNote
      }
      modifyItem(newItemObj);
    } else {
      modifyItem({...itemSelected, 'item_name': itemName, notes: itemNote});
    }

    setModalVisible(!modalVisible);
    setItemName('');
    setItemNote('');
  }

  const addNewTag = async (newTagName: string) => {
    // If this tag name is not inside database, create a new tag in tag table
    let existingTag = await SqlDatabase.getTagByName(newTagName);
    
    if(!existingTag) {
      const randomColor: string = '#' + Math.floor(Math.random()*16777215).toString(16);
      await SqlDatabase.createNewTag(newTagName, randomColor);
      existingTag = await SqlDatabase.getTagByName(newTagName);
    }
    const tagId:number = (existingTag as any)?.id;
    if(tagId) {
      SqlDatabase.activeTag(tagId,(itemSelected as Item).id);
      const tagListData = await SqlDatabase.checkTagList();
      setTagLists((tagListData as any)._array);

      setItemTagsArr([...itemTagsArr, tagId+'']);
    }
    
  }

  React.useEffect(() => {
    const runEffect = async () => {
      const tagListData = await SqlDatabase.checkTagList();
      setTagLists((tagListData as any)._array);
    };
    runEffect();
  }, []);

  React.useEffect(() => {
    if(itemSelected) {
      setModalVisible(true);
      setItemName(itemSelected?.item_name);
      setItemTagsArr(itemSelected?.tag_id_array.split(","));
      setItemNote(itemSelected?.notes);
    } else {
      setModalVisible(false);
      setItemName('');
      setItemNote('');
    }
    
  }, [itemSelected]);
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
              <Text style={styles.modalTitle}>{itemSelected ? 'Edit': 'Add new item'}</Text>
              <TouchableHighlight
                style={styles.modalCloseBtn}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  unSelectItem();
                }}
              >
                <Text>x</Text>
              </TouchableHighlight>
            </View>

            <View style={styles.modalBody}>
              <Text>item name</Text>
              <TextInput
                style={styles.inputBox}
                onChangeText={text => setItemName(text)}
                value={itemName}
              />
              <TagsContainer itemTagsArr={itemTagsArr} tagLists={tagLists} addNewTag={addNewTag}/>
              <Text>notes</Text>
              <TextInput
                style={styles.inputBox}
                editable
                maxLength={40}
                onChangeText={text => setItemNote(text)}
                value={itemNote}
              />
              <TouchableHighlight
                style={styles.submitButton}
                onPress={addOrEditItem}>
                <Text style={styles.submitButtonText}>{itemSelected ? 'Edit': 'Add'}</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableHighlight
        style={styles.addButton}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text style={styles.textStyle}>+</Text>
      </TouchableHighlight>
    </View>
  );
};


