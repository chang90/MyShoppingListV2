import React, { useState } from "react";
import { Item } from "../ShoppingListDetails";
import { Tag } from "./AddItem";
import { StyleSheet, View, Text } from "react-native";

type Props = {
  itemTagsArr: string,
  tagLists: Tag[]
};

const styles = StyleSheet.create({
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

export function TagsContainer({ itemTagsArr, tagLists }: Props) {
  return (
    <View>
      <Text>{itemTagsArr}</Text>
      <Text>item tag (Limit to 3)</Text>
      <View style={styles.tagGroup}>
        <View style={styles.colorTag}>
          <Text>+</Text>
        </View>
        {
          tagLists.map((tag: Tag, index: number) => {
            return <View key={index} style={[styles.colorTag, { backgroundColor: tag.color as string }]}>
              <Text>{tag.tagName}</Text>
            </View>
          })
        }
      </View>
    </View>
  );
};