import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getExpenses, addExpense } from './sheetApi';

export default function ExpenseForm() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [loading, setLoading] = useState(true);

  const [expenses, setExpenses] = useState([]);  // <-- LIST OF ROWS

  useEffect(() => {
    loadExpenses();
  }, []);

  async function loadExpenses() {
    const data = await getExpenses();
    setLoading(false);
    setExpenses(data);   // <-- STORE IN STATE
  }

  async function handleAdd() {
    if (!description.trim() || !amount) {
      alert('Please add description and amount');
      return;
    }

    const newExpense = {
      date: date.toISOString().split('T')[0],
      remark: description,
      cashOut: Number(amount),
      category
    };

    // ---- Send to Google Sheets ----
    await addExpense(newExpense);

    // ---- Refresh from Google Sheets ----
    await loadExpenses();

    // ---- Clear form ----
    setDescription('');
    setAmount('');
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={styles.title}>Add New Expense</Text>

      <Text>Date</Text>
      <Button title={date.toDateString()} onPress={() => setShowPicker(true)} />

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(e, selected) => {
            setShowPicker(false);
            if (selected) setDate(selected);
          }}
        />
      )}

      <Text>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Lunch, Taxi..."
      />

      <Text>Amount</Text>
      <TextInput
        keyboardType="numeric"
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        placeholder="0"
      />

      <Text>Category</Text>
      <View style={styles.pickerWrap}>
        <Picker selectedValue={category} onValueChange={setCategory}>
          <Picker.Item label="Miscellaneous" value="Miscellaneous" />
          <Picker.Item label="Outstation fun travel" value="Outstation fun travel" />
          <Picker.Item label="Travel and fuel" value="Travel and fuel" />
          <Picker.Item label="Wants Item" value="Wants Item" />
          <Picker.Item label="Rent" value="Rent" />
          <Picker.Item label="internet and comms" value="internet and comms" />
          <Picker.Item label="Medical bills + medic" value="Medical bills + medic" />
          <Picker.Item label="PurposeOfLife" value="PurposeOfLife" />
          <Picker.Item label="Entertainment" value="Entertainment" />
          <Picker.Item label="Relationship" value="Relationship" />
          <Picker.Item label="Health - efforts" value="Health - efforts" />
          <Picker.Item label="office food" value="office food" />
          <Picker.Item label="Grocery" value="Grocery" />
          <Picker.Item label="Food Outing" value="Food Outing" />
          <Picker.Item label="Clothes" value="Clothes" />
          <Picker.Item label="Electricity bill" value="Electricity bill" />
          <Picker.Item label="Home" value="Home" />
        </Picker>
      </View>

      <Button title="Add Expense" onPress={handleAdd} />

      <Text style={styles.listTitle}>Your Expenses</Text>

     {loading ? (
  <View style={{ marginTop: 40, alignItems: "center" }}>
    <ActivityIndicator size="large" color="#2196F3" />
    <Text style={{ marginTop: 10 }}>Loading expenses...</Text>
  </View>
) : (
  <ScrollView style={{ marginTop: 10 }}>
    {expenses.map((e, index) => (
      <View
        key={index}
        style={[
          styles.row,
          { backgroundColor: index % 2 === 0 ? "#ffffff" : "#e6f3ff" },
        ]}
      >
        <Text style={styles.rowText}>
          {new Date(e.date).toDateString()}
        </Text>
        <Text style={styles.rowText}>{e.remark}</Text>
        <Text style={styles.rowText}>₹{e.cashOut}</Text>
        <Text style={styles.rowText}>{e.category}</Text>
      </View>
    ))}
  </ScrollView>
)}
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
