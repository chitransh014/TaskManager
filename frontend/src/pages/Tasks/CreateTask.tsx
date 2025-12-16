import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../../api/axios";
import { socket } from "../../sockets/socket";
import GradientBackground from "../../components/GradientBackground";

export default function CreateTask() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "LOW",
    status: "TODO",
    assignedToId: "",
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => (await api.get("/auth/all-users")).data.users,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/tasks", form);
      return res.data.task;
    },
    onSuccess: (task) => {
      socket.emit("task:create", task);
      window.location.href = "/";
    },
  });

  const submit = (e: any) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <GradientBackground>
      <form
        className="glass p-8 rounded-2xl w-full max-w-lg text-white"
        onSubmit={submit}
      >
        <h1 className="text-3xl font-bold mb-6">Create Task</h1>

        <input
          type="text"
          placeholder="Title"
          className="glass-input"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="glass-input h-24"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="datetime-local"
          className="glass-input"
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />

        <select
          className="glass-input"
          onChange={(e) =>
            setForm({ ...form, priority: e.target.value as any })
          }
        >
          <option>LOW</option>
          <option>MEDIUM</option>
          <option>HIGH</option>
          <option>URGENT</option>
        </select>

        <select
          className="glass-input"
          onChange={(e) =>
            setForm({ ...form, assignedToId: e.target.value })
          }
        >
          <option value="">Assign to...</option>
          {users?.map((u: any) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        <button className="btn-primary mt-4">Create</button>
      </form>
    </GradientBackground>
  );
}
