import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Image, Pressable } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, Modal, Portal, Checkbox } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import TaskList from './src/components/TaskList';
import { addTask, deleteTask, deleteAllTasks, getAllTasks, updateTask, TaskItem } from './src/utils/handle-api';

export default function App() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [text, setText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAllTasks(setTasks, () => setLoading(false));
    const timeout = setTimeout(() => setLoading(false), 10000);
    return () => clearTimeout(timeout);
  }, []);

  const updateMode = (_id: string, text: string) => {
    setIsUpdating(true);
    setText(text);
    setTaskId(_id);
    setModalVisible(true);
  };

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <Image source={require('./assets/image.png')} style={styles.logo} />
            <Text style={styles.header}>Tarefas</Text>

            <Text style={styles.counter}>{tasks.length} tarefa(s)</Text>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setIsUpdating(false);
                setText("");
                setCompleted(false);
                setDueDate(new Date());
                setModalVisible(true);
              }}
            >
              <Text style={styles.addButtonText}>Adicionar task</Text>
            </TouchableOpacity>

            <View style={styles.deleteAllContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.deleteButton,
                  pressed && { opacity: 0.7 }
                ]}
                onPress={() => deleteAllTasks(tasks, setTasks)}
              >
                <Text style={styles.deleteButtonText}>Excluir todas as tarefas</Text>
              </Pressable>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
                <Text style={styles.loadingText}></Text>
              </View>
            ) : (
              <TaskList
                tasks={tasks}
                updateMode={updateMode}
                deleteToDo={(task: TaskItem) => deleteTask(task, setTasks)}
              />
            )}

            <Portal>
              <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
                <Text style={styles.modalTitle}>{isUpdating ? 'Atualizar task' : 'Nova task'}</Text>

                <TextInput
                  style={styles.inputModal}
                  placeholder="Título da tarefa..."
                  value={text}
                  onChangeText={(val) => setText(val)}
                  maxLength={100}
                />

                <View style={[styles.checkboxContainer, { paddingVertical: 8 }]}>
                  <Text style={styles.checkboxLabel}>Concluída?</Text>
                  <View style={{ backgroundColor: '#f0f0f0', borderRadius: 4, padding: 2 }}>
                    <Checkbox.IOS
                      status={completed ? 'checked' : 'unchecked'}
                      onPress={() => setCompleted(!completed)}
                      color="#007AFF"
                    />
                  </View>
                </View>

                <View style={styles.dateContainer}>
                  <Text>Data de entrega: {dueDate.toLocaleDateString()}</Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                    <Text style={styles.dateButtonText}>Alterar Data</Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={dueDate}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) setDueDate(selectedDate);
                      }}
                    />
                  )}
                </View>

                <TouchableOpacity
                  style={styles.modalSaveButton}
                  onPress={() => {
                    const dateStr = dueDate.toISOString().split('T')[0];
                    if (isUpdating) {
                      updateTask({ _id: taskId, text, completed, dueDate: dateStr }, setTasks, setText, setIsUpdating);
                    } else {
                      addTask({ _id: "", text, completed, dueDate: dateStr }, setTasks);
                    }
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalSaveButtonText}>Salvar</Text>
                </TouchableOpacity>
              </Modal>
            </Portal>
          </View>
          <StatusBar style="auto" />
        </SafeAreaView>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  logo: {
    width: 160,
    height: 160,
    alignSelf: 'center',
    marginTop: 16,
    resizeMode: 'contain',
  },
  header: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  counter: {
    marginTop: 4,
    textAlign: 'center',
    fontSize: 24,
    color: '#666',
  },
  top: {
    marginTop: 16,
    gap: 8,
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    fontSize: 16,
  },
  deleteAllContainer: {
    marginTop: 8,
    alignItems: 'flex-start',
  },
  deleteButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    width: '100%',
    alignItems: 'center',
    borderColor: '#005bb5',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  addButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  list: {
    marginTop: 16,
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 16,
    color: '#999',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 24,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputModal: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  dateContainer: {
    marginBottom: 24,
  },
  dateButton: {
    marginTop: 8,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  modalSaveButton: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 4,
    alignItems: 'center',
  },
  modalSaveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});