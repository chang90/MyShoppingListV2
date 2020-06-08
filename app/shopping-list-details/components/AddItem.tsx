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

type Props = {

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
    alignItems: "center",
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
    width: "100%"
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

export function AddItem({ }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemNote, setItemNote] = useState('');
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
              <Text style={styles.modalTitle}>Add new item</Text>
              <TouchableHighlight
                style={styles.modalCloseBtn}
                onPress={() => {
                  setModalVisible(!modalVisible);
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
              <Text>item tag (Limit to 3)</Text>
              <View style={styles.tagGroup}>
                <View style={styles.colorTag}>
                  <Text>Easy to expire</Text>
                </View>
                <View style={styles.colorTag}>
                  <Text>Fridge</Text>
                </View>
                <View style={styles.colorTag}>
                  <Text>meat</Text>
                </View>
              </View>
              <Text>notes</Text>
              <TextInput
                style={styles.inputBox}
                editable
                maxLength={40}
                onChangeText={text => setItemNote(text)}
                value={itemNote}
              />
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

