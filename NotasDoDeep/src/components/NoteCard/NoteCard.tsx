import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Note} from '../../state/features/notes/notes-slice';
import {Colors} from '../../assets/Colors';

interface NoteCardProps {
  note: Note;
}

export default function NoteCard(props: NoteCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.note.title}</Text>
      <Text style={styles.descriptionMsg} numberOfLines={2}>
        {props.note.description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: '90%',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  title: {
    fontSize: 25,
    color: Colors.primaryColor,
    fontWeight: '900',
  },
  descriptionMsg: {
    color: Colors.primaryColor,
    fontSize: 15,
    fontWeight: '400',
  },
});
