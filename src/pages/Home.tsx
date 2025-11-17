import { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from '../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>();

export default function Home() {
  const [todos, setTodos] = useState<Array<Schema['Todo']['type']>>([]);
  const { signOut } = useAuthenticator(); // add { user } if you want to show it

  useEffect(() => {
    const sub = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
    return () => sub.unsubscribe();
  }, []);

  function createTodo() {
    const content = window.prompt('Todo content');
    if (content) client.models.Todo.create({ content });
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div style={{ marginTop: 16 }}>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
      <button style={{ marginTop: 16 }} onClick={signOut}>
        Sign out
      </button>
    </main>
  );
}
