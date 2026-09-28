import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Square } from 'lucide-react';
import styles from './todo.module.css';

interface Todo {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
}

interface Props {
    id: string;
}

export default function TodoCard({ id }: Props) {
    const [todos, setTodos] = useState<Todo[]>(() => {
        const saved = localStorage.getItem(`${id}-todos`);
        return saved ? JSON.parse(saved) : [];
    });

    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        localStorage.setItem(`${id}-todos`, JSON.stringify(todos));
    }, [todos, id]);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newTodo: Todo = {
            id: Date.now().toString(),
            text: inputValue.trim(),
            completed: false,
            createdAt: Date.now(),
        };

        setTodos([newTodo, ...todos]);
        setInputValue('');
    };

    const toggleTodo = (todoId: string) => {
        setTodos(todos.map(todo =>
            todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (todoId: string) => {
        setTodos(todos.filter(todo => todo.id !== todoId));
    };

    const sortedTodos = [...todos].sort((a, b) => {
        if (a.completed === b.completed) {
            return b.createdAt - a.createdAt;
        }
        return a.completed ? 1 : -1;
    });

    return (
        <div className={`${styles.todoCard}`}>
            <div className={"header"}>
                <span className={"rank"}>TODO</span>
            </div>

            <form onSubmit={handleAdd} className={styles.todoForm}>
                <input
                    type="text"
                    className={styles.todoInput}
                    placeholder="Add a new task..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button type="submit" className={styles.todoAddBtn} disabled={!inputValue.trim()}>
                    <Plus size={18} />
                </button>
            </form>

            <div className={styles.todoList}>
                {sortedTodos.length === 0 ? (
                    <div className={styles.emptyState}>All caught up!</div>
                ) : (
                    sortedTodos.map(todo => (
                        <div
                            key={todo.id}
                            className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}
                        >
                            <button
                                className={styles.checkBtn}
                                onClick={() => toggleTodo(todo.id)}
                            >
                                {todo.completed ? <Check size={16} /> : <Square size={16} />}
                            </button>

                            <span className={styles.todoText}>{todo.text}</span>

                            <button
                                className={styles.deleteTodoBtn}
                                onClick={() => deleteTodo(todo.id)}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}