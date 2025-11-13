import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface SummaryCardProps {
  title: string;
  value: string | number;
  iconName: string;
  color: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, iconName, color }) => {
  return (
    <View style={styles.card}>
      <Icon name={iconName} size={30} color={color} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1C1C1C',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 5,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5FFF6F',
    marginTop: 5,
  },
  title: {
    fontSize: 14,
    color: '#EAEAEA',
    marginTop: 5,
  },
});

export default SummaryCard;