import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TaskItemProps {
  text: string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TaskItem({ text, onEdit, onDelete }: TaskItemProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    backgroundColor: '#2e7d32',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  deleteButton: {
    backgroundColor: '#c62828',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});