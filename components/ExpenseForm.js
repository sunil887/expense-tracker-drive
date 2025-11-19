import { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import AddExpenseForm from './AddExpenseForm';
import ExpenseSummaryList from './ExpenseSummaryList';

export default function ExpenseForm() {
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  function handleAdded() {
    setRefreshTrigger(prev => prev + 1);
  }

  return (
    <View style={{ flex: 1 }}>
      <AddExpenseForm onAdded={handleAdded} />
      <ExpenseSummaryList refreshTrigger={refreshTrigger} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  listTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6, marginBottom: 8 },
  pickerWrap: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 8 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  rowText: { width: '25%' }
});
