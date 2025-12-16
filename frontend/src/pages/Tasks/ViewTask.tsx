import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../../api/axios";
import { useState, useEffect } from "react";
import { socket } from "../../sockets/socket";
import GradientBackground from "../../components/GradientBackground";

export default function ViewTask() {
  const { id } = useParams();
  const [task, setTask] = useState<any>(null);

  const { refetch } = useQuery({
    queryKey: ["task", id],
    queryFn: async () => {
      const res = await api.get(`/tasks/${id}`);
      setTask(res.data.task);
    },
  });

  useEffect(() => {
    socket.on("task:updated", refetch);
    socket.on("task:assigned", refetch);

    return () => {
      socket.off("task:updated");
      socket.off("task:assigned");
    };
  }, []);

  const updateMutation = useMutation({
    mutationFn: async (changes: any) => {
      const res = await api.put(`/tasks/${id}`, changes);
      return res.data.task;
    },
    onSuccess: (updatedTask) => {
      socket.emit("task:update", updatedTask);
      setTask(updatedTask);
    },
  });

  if (!task) return <GradientBackground>Loading...</GradientBackground>;

  return (
    <GradientBackground>
      <div className="glass p-8 rounded-xl w-full max-w-xl text-white">
        <h1 className="text-3xl font-bold mb-4">{task.title}</h1>

        <p className="opacity-80 mb-4">{task.description}</p>

        <div className="flex justify-between mb-4">
          <span>Priority: {task.priority}</span>
          <span>Status: {task.status}</span>
        </div>

        <div className="grid gap-3">
          <button
            className="btn-primary"
            onClick={() => updateMutation.mutate({ status: "IN_PROGRESS" })}
          >
            Mark In Progress
          </button>
          <button
            className="btn-primary bg-green-500"
            onClick={() => updateMutation.mutate({ status: "COMPLETED" })}
          >
            Mark Completed
          </button>
        </div>
      </div>
    </GradientBackground>
  );
}
