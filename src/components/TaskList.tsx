import { FlatList, StyleSheet, Text, View } from 'react-native';
import TaskItemComponent from './TaskItem';
import { TaskItem } from '../utils/handle-api';

interface TaskListProps {
  tasks: TaskItem[];
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item._id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma tarefa encontrada.</Text>
        </View>
      }
      renderItem={({ item }) => (
        <TaskItemComponent
          text={item.text}
          onEdit={() => onEdit(item._id, item.text)}
          onDelete={() => onDelete(item._id)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});