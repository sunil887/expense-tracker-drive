import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getExpenses } from './sheetApi';
import ExpenseList from './ExpenseList';

export default function ExpenseSummaryList({ refreshTrigger }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summaryType, setSummaryType] = useState('currentMonth');
  const [date] = useState(new Date());

  useEffect(() => {
    loadExpenses();
  }, [refreshTrigger]);

  async function loadExpenses() {
    try {
      setLoading(true);
      const data = await getExpenses();
      setExpenses(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const thisMonth = date.getMonth();
  const thisYear = date.getFullYear();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  const currentMonthExpenses = expenses
    .filter(exp => {
      const d = new Date(exp.date);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    })
    .reduce((sum, exp) => sum + (exp.cashOut || 0), 0);

  const lastMonthExpenses = expenses
    .filter(exp => {
      const d = new Date(exp.date);
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    })
    .reduce((sum, exp) => sum + (exp.cashOut || 0), 0);

  const currentAnnualExpenses = expenses
    .filter(exp => new Date(exp.date).getFullYear() === thisYear)
    .reduce((sum, exp) => sum + (exp.cashOut || 0), 0);

  const monthlyTotals = Array.from({ length: 12 }, () => 0);
  expenses.forEach(exp => {
    const d = new Date(exp.date);
    if (d.getFullYear() === thisYear) monthlyTotals[d.getMonth()] += (exp.cashOut || 0);
  });

  const monthsElapsed = thisMonth + 1;
  const averageMonthlyToDate = monthsElapsed > 0
    ? monthlyTotals.slice(0, monthsElapsed).reduce((s, v) => s + v, 0) / monthsElapsed
    : 0;

  function computeSummaryValue() {
    switch (summaryType) {
      case 'currentMonth': return currentMonthExpenses;
      case 'lastMonth': return lastMonthExpenses;
      case 'monthlyAverage': return averageMonthlyToDate;
      case 'currentAnnual': return currentAnnualExpenses;
      default: return 0;
    }
  }

  const summaryValue = computeSummaryValue();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Expense Summary</Text>

      <View style={styles.pickerWrap}>
        <Picker selectedValue={summaryType} onValueChange={setSummaryType}>
          <Picker.Item label="Current Month Expense" value="currentMonth" />
          <Picker.Item label="Last Month Expense" value="lastMonth" />
          <Picker.Item label="Current Annual Expense" value="currentAnnual" />
          <Picker.Item label="Current Monthly Average Expense" value="monthlyAverage" />
        </Picker>
      </View>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryLabel}>Selected Summary</Text>
        <Text style={styles.summaryValue}>₹{summaryValue.toFixed(2)}</Text>
      </View>

      <Text style={styles.title}>Your Expenses</Text>

      {loading ? (
        <View style={{ marginTop: 40, alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={{ marginTop: 10 }}>Loading expenses...</Text>
        </View>
      ) : expenses.length === 0 ? (
        <Text style={styles.emptyText}>No expenses yet.</Text>
      ) : (
        <ExpenseList expenses={expenses} loading={false} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginTop: 8, paddingHorizontal: 16 },
  pickerWrap: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 12, marginHorizontal: 16 },
  summaryBox: { backgroundColor: '#e3f2fd', padding: 16, borderRadius: 8, marginBottom: 16, alignItems: 'center', marginHorizontal: 16 },
  summaryLabel: { fontSize: 14, color: '#666' },
  summaryValue: { fontSize: 28, fontWeight: 'bold', color: '#2196F3', marginTop: 8 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 20, fontSize: 16 },
});
