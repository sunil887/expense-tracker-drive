import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addExpense } from './sheetApi';

export default function AddExpenseForm({ onAdded }) {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [submitting, setSubmitting] = useState(false);

  async function handleAdd() {
    if (!description.trim() || !amount) {
      alert('Please add description and amount');
      return;
    }

    setSubmitting(true);
    try {
      const newExpense = {
        date: date.toISOString().split('T')[0],
        remark: description,
        cashOut: Number(amount),
        category
      };

      await addExpense(newExpense);
      alert('Expense added successfully!');

      setDescription('');
      setAmount('');
      setDate(new Date());
      setCategory('Food');

      if (typeof onAdded === 'function') onAdded();
    } catch (err) {
      console.error(err);
      alert('Failed to add expense');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={{ padding: 16 }}>
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

      <Text style={{ marginTop: 10 }}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Lunch, Taxi..."
        editable={!submitting}
      />

      <Text>Amount</Text>
      <TextInput
        keyboardType="numeric"
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        placeholder="0"
        editable={!submitting}
      />

      <Text>Category</Text>
      <View style={styles.pickerWrap}>
        <Picker selectedValue={category} onValueChange={setCategory} enabled={!submitting}>
          <Picker.Item label="Miscellaneous" value="Miscellaneous" />
          <Picker.Item label="Outstation fun traveling" value="Outstation fun traveling" />
          <Picker.Item label="Travel and fuel" value="Travel and fuel" />
          <Picker.Item label="Wants Item" value="Wants Item" />
          <Picker.Item label="Rent" value="Rent" />
          <Picker.Item label="internet and comms" value="internet and comms" />
          <Picker.Item label="Medical bills + medicine" value="Medical bills + medicine" />
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

      <Button title={submitting ? 'Adding...' : 'Add Expense'} onPress={handleAdd} disabled={submitting} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6, marginBottom: 8 },
  pickerWrap: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 8 },
});
