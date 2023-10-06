import React, {useState, useEffect} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {useAppSelector} from '../state/hooks/hooks';
import {User} from '../state/features/user/user-slice';
import {Colors} from '../assets/Colors';
import {useDispatch} from 'react-redux';
import {getNotes} from '../actions/notes';
import {Note, getNoteList} from '../state/features/notes/notes-slice';
import Label from '../components/Label/Label';
import {PlusCircle, SignOut} from 'phosphor-react-native';
import {useNavigation} from '@react-navigation/native';
import {CommonActions} from '@react-navigation/native';
import NoteCard from '../components/NoteCard/NoteCard';

function Home() {
  const [flag, setFlag] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const user: User = useAppSelector(state => state.user.currentUser);
  const token = useAppSelector(state => state.user.token);
  const notes: Note[] = useAppSelector(state => state.notes.notes);
  const navigation = useNavigation();

  async function getUserNotes() {
    setIsRefreshing(true);
    const response = await getNotes(user.id, token);
    const note_list: Note[] = response ? response : [];
    dispatch(getNoteList(note_list));
    if (note_list.length === 0) {
      setFlag(true);
    }
    setIsRefreshing(false);
  }

  useEffect(() => {
    getUserNotes();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Label fontSize={45} fontWeight="900" color={Colors.primaryColor}>
          Home
        </Label>
        <View style={{flexDirection:'row'}}>
          <TouchableOpacity
            style={styles.buttonArea}
            onPress={() => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'NoteDetail'}],
                }),
              );
            }}>
            <PlusCircle size={45} color={Colors.primaryColor} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonArea}
            onPress={() => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Login'}],
                }),
              );
            }}>
            <SignOut size={45} color={Colors.primaryColor} />
          </TouchableOpacity>
        </View>
      </View>
      {flag ? (
        <View style={styles.infoArea}>
          <Label fontSize={20} fontWeight="bold" color={Colors.primaryColor}>
            Parece que você ainda não possui nenhuma nota!
          </Label>
        </View>
      ) : (
        <FlatList
          refreshing={isRefreshing}
          onRefresh={getUserNotes}
          data={notes}
          keyExtractor={item => item.id + ''}
          renderItem={item => (
            <TouchableOpacity
              onPress={() => {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'NoteDetail', params: {note: item.item}}],
                  }),
                );
              }}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 15,
              }}>
              <NoteCard note={item.item} />
            </TouchableOpacity>
          )}
        />
      )}
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
    marginTop: '12%',
    marginHorizontal: '5%',
    justifyContent: 'space-between',
  },
  buttonArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft:15
  },
  infoArea: {
    marginTop: '50%',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

export default Home;
