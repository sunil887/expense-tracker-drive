import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';

export default function ExpenseList({ expenses = [], loading }) {
  if (loading) {
    return (
      <View style={{ marginTop: 40, alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={{ marginTop: 10 }}>Loading expenses...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ marginTop: 10 }}>
      {expenses.map((e, index) => (
        <View
          key={index}
          style={[
            styles.row,
            { backgroundColor: index % 2 === 0 ? '#ffffff' : '#e6f3ff' },
          ]}
        >
          <Text style={styles.rowText}>{new Date(e.date).toDateString()}</Text>
          <Text style={styles.rowText}>{e.remark}</Text>
          <Text style={styles.rowText}>₹{e.cashOut}</Text>
          <Text style={styles.rowText}>{e.category}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  rowText: { width: '25%' },
});
