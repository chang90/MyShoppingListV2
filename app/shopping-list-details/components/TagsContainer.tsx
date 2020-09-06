import React, { useState } from "react";
import { Tag } from "./AddItem";
import { StyleSheet, View, Text, TextInput } from "react-native";

type Props = {
  itemTagsArr: Array<string>,
  tagLists: Tag[],
  addNewTag: Function
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
    flexWrap: "wrap",
    flexDirection: "row",
  },
  hideElement: {
    display: "none"
  }
});

const limitNum = 3;

export function TagsContainer({ itemTagsArr, tagLists, addNewTag }: Props) {
  const [displayTagList, setDisplayTagList] = useState([] as Tag[]);
  const [newTagName, setNewTagName] = useState('');
  const addTagToTagList = () => {
    addNewTag(newTagName);
    setNewTagName('');
  }

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
      <Text>item tag (Limit to {limitNum})</Text>
      <View style={styles.tagGroup}>
       {itemTagsArr?.length < limitNum &&
          (<View style={styles.colorTag}>
            <TextInput
              style={styles.colorTagText}
              onChangeText={text => setNewTagName(text)}
              onFocus={() => setNewTagName('')}
              value={newTagName}
              placeholder="+"
              placeholderTextColor={'#aaa'}
              onSubmitEditing={() => addTagToTagList()}
            >
            </TextInput>
          </View>)
        }

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