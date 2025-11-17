import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import ExpenseForm from './components/ExpenseForm';
import * as DriveService from './services/drive';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'local_expenses_v1';

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    (async () => {
      const local = await AsyncStorage.getItem(STORAGE_KEY);
      if (local) setExpenses(JSON.parse(local));
    })();
  }, []);

  function addExpense(exp) {
    const newList = [exp, ...expenses];
    setExpenses(newList);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  }


  return (
    <SafeAreaView style={styles.container}>
      <ExpenseForm onSubmit={(exp) => addExpense(exp)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700' },
  item: { padding: 12, borderRadius: 8, backgroundColor: '#f2f2f2', marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' },
  itemDate: { fontWeight: '600' },
  category: { marginTop: 4, fontStyle: 'italic' }
});