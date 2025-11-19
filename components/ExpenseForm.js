import { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getExpenses, addExpense } from './sheetApi';
import ExpenseList from './ExpenseList';

export default function ExpenseForm() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [loading, setLoading] = useState(true);

  const [expenses, setExpenses] = useState([]);  

  const [summaryType, setSummaryType] = useState("currentMonth"); // NEW STATE

  useEffect(() => {
    loadExpenses();
  }, []);

  async function loadExpenses() {
    setLoading(true);
    const data = await getExpenses();
    setLoading(false);
    setExpenses(data);
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

    addExpense(newExpense);

    alert('Expense added successfully!');

    await loadExpenses();

    setDescription('');
    setAmount('');
  }

  // ------- SUMMARY CALCULATIONS --------

  const thisMonth = date.getMonth();
  const thisYear = date.getFullYear();

  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  // Current Month
  const currentMonthExpenses = expenses
    .filter(exp => {
      const d = new Date(exp.date);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    })
    .reduce((sum, exp) => sum + (exp.cashOut || 0), 0);

  // Last Month
  const lastMonthExpenses = expenses
    .filter(exp => {
      const d = new Date(exp.date);
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    })
    .reduce((sum, exp) => sum + (exp.cashOut || 0), 0);

  // Annual (Current Year)
  const currentAnnualExpenses = expenses
    .filter(exp => {
      const d = new Date(exp.date);
      return d.getFullYear() === thisYear;
    })
    .reduce((sum, exp) => sum + (exp.cashOut || 0), 0);

  // Monthly totals for current year
  const monthlyTotals = Array.from({ length: 12 }, () => 0);
  expenses.forEach(exp => {
    const d = new Date(exp.date);
    if (d.getFullYear() === thisYear) {
      monthlyTotals[d.getMonth()] += (exp.cashOut || 0);
    }
  });

  // Average monthly expense for full year (divide by 12)
  const averageMonthlyExpense = monthlyTotals.reduce((sum, v) => sum + v, 0) / 12;

  // Average monthly expense up to current month (inclusive)
  const monthsElapsed = thisMonth + 1;
  const averageMonthlyToDate = monthsElapsed > 0
    ? monthlyTotals.slice(0, monthsElapsed).reduce((s, v) => s + v, 0) / monthsElapsed
    : 0;
  

  // Selected summary
  function computeSummaryValue() {
    switch (summaryType) {
      case 'currentMonth':
        return currentMonthExpenses;
      case 'lastMonth':
        return lastMonthExpenses;
      case 'monthlyAverage':
        return averageMonthlyToDate;
      case 'currentAnnual':
        return currentAnnualExpenses;
      default:
        return 0;
    }
  }

  const summaryValue = computeSummaryValue();

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

      {/* SUMMARY DROPDOWN */}
      <Text style={styles.listTitle}>Expense Summary</Text>

      <View style={styles.pickerWrap}>
        <Picker selectedValue={summaryType} onValueChange={setSummaryType}>
          <Picker.Item label="Current Month Expense" value="currentMonth" />
          <Picker.Item label="Last Month Expense" value="lastMonth" />
          <Picker.Item label="Current Annual Expense" value="currentAnnual" />
          <Picker.Item label="Current Monthly Average Expense" value="monthlyAverage" />
        </Picker>
      </View>

      <Text> Selected summary : {summaryValue}</Text>

      <Text style={styles.listTitle}>Your Expenses</Text>

      <ExpenseList expenses={expenses} loading={loading} />
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
