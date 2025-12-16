import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfileApi, updateProfileApi } from "../api/auth.api";
import GradientBackground from "../components/GradientBackground";
import { useNotification } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function Profile() {
    const navigate = useNavigate();
    const { show } = useNotification();
    const queryClient = useQueryClient();

    const { data: user, isLoading } = useQuery({
        queryKey: ["profile"],
        queryFn: getProfileApi,
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
    });

    useEffect(() => {
        if (user) {
            setValue("name", user.name);
            setValue("email", user.email);
        }
    }, [user, setValue]);

    const mutation = useMutation({
        mutationFn: updateProfileApi,
        onSuccess: () => {
            show("Profile updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            // Also invalidate user list so other users see the new name
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (err: any) => {
            show(err.response?.data?.message || "Failed to update profile");
        },
    });

    const onSubmit = (data: ProfileForm) => {
        mutation.mutate(data);
    };

    if (isLoading) return <div className="text-white text-center mt-20">Loading...</div>;

    return (
        <GradientBackground alignTop>
            <div className="w-full max-w-md">
                <button
                    onClick={() => navigate("/")}
                    className="mb-6 text-white/80 hover:text-white flex items-center gap-2 transition"
                >
                    ← Back to Dashboard
                </button>

                <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/10 text-white">
                    <div className="flex justify-center mb-6">
                        <div className="bg-purple-600 w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg">
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-center mb-1">My Profile</h2>
                    <p className="text-center text-white/60 mb-8">{user?.email}</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold ml-1">Full Name</label>
                            <input
                                {...register("name")}
                                className="w-full p-3 rounded-xl bg-white/20 border border-white/10 focus:bg-white/30 outline-none transition mt-1"
                            />
                            {errors.name && (
                                <p className="text-red-300 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-semibold ml-1">Email Address</label>
                            <input
                                {...register("email")}
                                className="w-full p-3 rounded-xl bg-white/20 border border-white/10 focus:bg-white/30 outline-none transition mt-1"
                            />
                            {errors.email && (
                                <p className="text-red-300 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full bg-white text-purple-600 font-bold py-3.5 rounded-xl hover:bg-gray-100 transition shadow-lg mt-4"
                        >
                            {mutation.isPending ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </div>
            </div>
        </GradientBackground>
    );
}
