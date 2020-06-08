import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
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
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
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
    textAlign: "center",
    marginBottom: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export function AddItem({}: Props) {
  const [modalVisible, setModalVisible] = useState(false);
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
            <Text style={styles.modalText}>Hello World!</Text>

            <TouchableHighlight
              style={{ backgroundColor: "#2196F3" }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text>Hide Modal</Text>
            </TouchableHighlight>
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


