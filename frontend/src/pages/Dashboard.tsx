import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import GradientBackground from "../components/GradientBackground";
import TaskCard from "../components/TaskCard";
import CreateTaskModal from "../components/CreateTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import TaskSkeleton from "../components/TaskSkeleton";
import { socket } from "../sockets/socket";
import {
  assignedToMeApi,
  createdByMeApi,
  overdueTasksApi,
} from "../api/tasks.api";
import { getUsersApi, logoutApi } from "../api/auth.api";
import { useNotification } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";

type TabType = "assigned" | "created" | "overdue";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("assigned");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortBy, setSortBy] = useState<"asc" | "desc">("asc");

  const notify = useNotification().show;

  // -------- API selection based on tab --------
  const fetchTasks = () => {
    const params = {
      status: statusFilter || undefined,
      priority: priorityFilter || undefined,
      sortBy,
    };

    if (activeTab === "assigned") return assignedToMeApi(params);
    if (activeTab === "created") return createdByMeApi(params);
    return overdueTasksApi(params);
  };

  const { data: tasks = [], refetch, isLoading } = useQuery({
    queryKey: ["dashboard", activeTab, statusFilter, priorityFilter, sortBy],
    queryFn: fetchTasks,
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: getUsersApi,
  });

  // -------- Real-time socket events --------
  useEffect(() => {
    socket.on("task:updated", () => {
      refetch();
      notify("A task was updated");
    });

    socket.on("task:created", () => {
      refetch();
      notify("A new task was created");
    });

    socket.on("task:deleted", () => {
      refetch();
      notify("A task was deleted");
    });

    socket.on("task:assigned", (title: string) => {
      notify(`You were assigned: ${title}`);
      refetch();
    });

    return () => {
      socket.off("task:updated");
      socket.off("task:created");
      socket.off("task:deleted");
      socket.off("task:assigned");
    };
  }, [activeTab, statusFilter, priorityFilter, sortBy]);

  // -------- Logout Functionality --------
  const navigate = useNavigate();
  const { mutate: logout } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      navigate("/login");
      notify("Logged out successfully");
    },
  });

  return (
    <GradientBackground alignTop>
      <div className="w-full max-w-6xl text-white">

        {/* -------- Navbar -------- */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-8 flex flex-col md:flex-row justify-between items-center shadow-lg border border-white/10 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-purple-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-wide">Task Manager</h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/profile")}
              className="group flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-xl transition-all border border-white/10 font-medium"
            >
              <span className="hidden sm:inline">Profile</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button
              onClick={() => logout()}
              className="group flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-xl transition-all border border-white/10 font-medium"
            >
              <span className="hidden sm:inline">Logout</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </button>
          </div>
        </div>

        {/* -------- Filters & Controls -------- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex gap-2">
            {[
              { key: "assigned", label: "Assigned to Me" },
              { key: "created", label: "Created by Me" },
              { key: "overdue", label: "Overdue" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabType)}
                className={`px-4 py-2 text-sm md:text-base rounded-xl backdrop-blur-xl transition ${activeTab === tab.key
                  ? "bg-white/30 shadow-lg"
                  : "bg-white/10 hover:bg-white/20"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <select
              className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:bg-white/20"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option className="text-black" value="">All Status</option>
              <option className="text-black" value="TODO">To Do</option>
              <option className="text-black" value="IN_PROGRESS">In Progress</option>
              <option className="text-black" value="REVIEW">Review</option>
              <option className="text-black" value="COMPLETED">Completed</option>
            </select>

            <select
              className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:bg-white/20"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option className="text-black" value="">All Priority</option>
              <option className="text-black" value="LOW">Low</option>
              <option className="text-black" value="MEDIUM">Medium</option>
              <option className="text-black" value="HIGH">High</option>
              <option className="text-black" value="URGENT">Urgent</option>
            </select>

            <button
              onClick={() => setSortBy(sortBy === "asc" ? "desc" : "asc")}
              className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg border border-white/10 flex items-center gap-2"
            >
              <span className="text-sm">Due Date</span>
              {sortBy === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>

        {/* -------- Task Grid -------- */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <TaskSkeleton key={i} />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center opacity-70 mt-10 p-10 bg-white/5 rounded-2xl border border-white/5">
            <h3 className="text-xl font-bold mb-2">No tasks found</h3>
            <p>Try clearing filters or create a new task!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task: any) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(t) => {
                  setSelectedTask(t);
                  setEditOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* -------- FAB -------- */}
      <button
        onClick={() => setCreateOpen(true)}
        className="
          fixed bottom-6 right-6
          w-14 h-14 rounded-full
          bg-white/30 backdrop-blur-xl
          text-white text-3xl font-bold
          shadow-lg hover:scale-110 transition
        "
      >
        +
      </button>

      {/* -------- Modals -------- */}
      <CreateTaskModal open={createOpen} onClose={() => setCreateOpen(false)} users={users} />
      <EditTaskModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        task={selectedTask}
      />
    </GradientBackground>
  );
}
