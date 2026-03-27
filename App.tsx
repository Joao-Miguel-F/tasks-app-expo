import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
  Image,
  Button,
  KeyboardAvoidingView,
  Keyboard,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TaskList from './src/components/TaskList';
import {
  addTask,
  deleteTask,
  getAllTasks,
  updateTask,
  TaskItem
} from './src/utils/handle-api';

export default function App() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [text, setText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [taskId, setTaskId] = useState("");

  useEffect(() => {
    getAllTasks(setTasks);
  }, []);

  const updateMode = (_id: string, taskText: string) => {
    setIsUpdating(true);
    setText(taskText);
    setTaskId(_id);
  };

  const handleAddOrUpdate = () => {
    if (text.trim() === "") {
      Alert.alert("Atenção", "Digite uma tarefa antes de continuar.");
      return;
    }

    if (isUpdating) {
      updateTask(taskId, text, setTasks, setText, setIsUpdating);
    } else {
      addTask(text, setText, setTasks);
    }

    Keyboard.dismiss();
  };

  const handleClearInput = () => {
    setText("");
    setIsUpdating(false);
    setTaskId("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <Image
            source={require('./assets/task-app-banner.png')}
            style={styles.banner}
            resizeMode="contain"
          />

          <Text style={styles.title}>Minhas Tarefas</Text>

          <Text style={styles.counter}>
            Total: {tasks.length} {tasks.length === 1 ? 'tarefa' : 'tarefas'}
          </Text>
        </View>

        {/* INPUT */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="O que precisa ser feito?"
            placeholderTextColor="#999"
            value={text}
            onChangeText={setText}
            maxLength={80}
            returnKeyType="done"
            onSubmitEditing={handleAddOrUpdate}
          />

          <TouchableOpacity
            style={[styles.addButton, isUpdating && styles.updateButton]}
            onPress={handleAddOrUpdate}
          >
            <Text style={styles.addButtonText}>
              {isUpdating ? "Atualizar" : "Adicionar"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* BOTÃO EXTRA (REQUISITO DA ATIVIDADE) */}
        <View style={styles.buttonRow}>
          <Button
            title="Limpar campo"
            onPress={handleClearInput}
            disabled={text === ""}
          />
        </View>

        {/* LISTA */}
        <View style={styles.listWrapper}>
          <TaskList
            tasks={tasks}
            onEdit={updateMode}
            onDelete={(id) => deleteTask(id, setTasks)}
          />
        </View>
      </KeyboardAvoidingView>

      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  /* HEADER */
  headerContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  banner: {
    width: '100%',
    height: 120,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  counter: {
    marginTop: 6,
    fontSize: 14,
    color: '#666',
  },

  /* INPUT */
  inputContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#000',
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: '#2e7d32',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  /* BOTÃO */
  buttonRow: {
    marginBottom: 16,
    alignItems: 'flex-end',
  },

  /* LISTA */
  listWrapper: {
    flex: 1,
  },
});