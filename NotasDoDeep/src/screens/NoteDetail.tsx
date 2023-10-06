import React, {useState, useEffect} from 'react';
import {Note} from '../state/features/notes/notes-slice';
import {View, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import {Colors} from '../assets/Colors';
import {ArrowLeft} from 'phosphor-react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useAppSelector} from '../state/hooks/hooks';
import {createNote, updateNote} from '../actions/notes';

interface NoteDetailParams {
  note: Note;
}

export default function NoteDetail() {
  const [textArea, setTextArea] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [update, setUpdate] = useState<boolean>(false);
  const [type, setType] = useState<string>('text');
  const user_id = useAppSelector(state => state.user.currentUser.id);
  const token = useAppSelector(state => state.user.token);
  const navigation = useNavigation();
  const route = useRoute();
  const note = route.params as NoteDetailParams;

  useEffect(() => {
    function checkNote() {
      if (note) {
        setType(note.note.type);
        setUpdate(true);
        setTitle(note.note.title);
        setTextArea(note.note.description);
      }
    }
    checkNote();
  }, []);

  async function handleSubmit() {

    const newNote: Note = {
      id: note ? note.note.id : null,
      type: type,
      title: title,
      user_id: user_id,
      description: textArea,
    };
    if (!update) {
      const response = await createNote(newNote, token);
    } else {
      const response = await updateNote(newNote, token);
    }
    navigation.navigate('Home');
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSubmit}>
          <ArrowLeft size={35} color={Colors.primaryColor} />
        </TouchableOpacity>
      </View>
      <View style={styles.noteArea}>
        <View style={styles.titleArea}>
          <TextInput
            style={styles.titleInput}
            placeholder="Título da Nota"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={Colors.secundaryColor}
          />
        </View>
        <View style={styles.textArea}>
          <TextInput
            placeholder="Nota"
            value={textArea}
            onChangeText={setTextArea}
            placeholderTextColor={Colors.primaryColor}
            multiline
            numberOfLines={40}
            style={styles.textAreaInput}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '13%',
    marginHorizontal: '5%',
    marginBottom: '10%',
  },
  titleArea: {
    width: '90%',
    height: 60,
    borderRadius: 12,
  },
  titleInput: {
    color: Colors.primaryColor,
    fontSize: 30,
    flex: 1,
    fontWeight: '900',
  },
  noteArea: {
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  textArea: {
    width: '90%',
    height: 600,
  },
  textAreaInput: {
    color: Colors.primaryColor,
    fontSize: 20,
    textAlignVertical: 'top',
    flex: 1,
  },
});
