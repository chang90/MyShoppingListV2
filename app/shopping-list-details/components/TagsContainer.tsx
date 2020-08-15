import React, { useState } from "react";
import { Tag } from "./AddItem";
import { StyleSheet, View, Text, TextInput } from "react-native";

type Props = {
  itemTagsArr: Array<string>,
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
  colorTagText: {
    textAlign: 'center'
  },
  tagGroup: {
    display: "flex",
    flexDirection: "row",
  },
  hideElement: {
    display: "none"
  }
});

export function TagsContainer({ itemTagsArr, tagLists }: Props) {
  const [displayTagList, setDisplayTagList] = useState([] as Tag[]);
  const [newTagName, setNewTagName] = useState('');

  React.useEffect(() => {
    if (itemTagsArr && tagLists) {
      const displayTagList: Tag[] = tagLists.map((tag: Tag) => {
        return Object.assign({}, tag, { color: itemTagsArr.includes(tag?.id.toString()) ? tag.color : '#ccc' });
      })
      setDisplayTagList(displayTagList);
    }

  }, [itemTagsArr, tagLists]);

  return (
    <View>
      <Text>{itemTagsArr}</Text>
      <Text>item tag (Limit to 3)</Text>
      <View style={styles.tagGroup}>
        <View style={styles.colorTag}>
          <TextInput
            style={styles.colorTagText}
            onChangeText={text => setNewTagName(text)}
            onFocus={() => setNewTagName('')}
            value={newTagName}
            placeholder="+"
            placeholderTextColor={'#aaa'}
            onSubmitEditing={()=>console.log('submit')}
          >
          </TextInput>
        </View>
        {
          displayTagList.map((tag: Tag, index: number) => {
            return <View key={index} style={[styles.colorTag, { backgroundColor: tag.color as string }]}>
              <Text>{tag.tagName}</Text>
            </View>
          })
        }
      </View>
    </View>
  );
};