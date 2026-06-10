import { create } from "zustand";

interface UserProfile {
    userName: string;
    email: string;
    userId: string;
}

interface UserState extends UserProfile {
    isLoading: boolean;

    setUser: (user: UserProfile) => void;
    clearUser: () => void;
    fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
    userName: "",
    email: "",
    userId: "",
    isLoading: false,

    setUser: (user) => set(user),

    clearUser: () => set({
        userName: "",
        email: "",
        userId: "",
    }),

    fetchUser: async () => {
        set({ isLoading: true });
        try {
            const res = await fetch("/api/profile", {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();

            if (!res.ok || !data.success || !data.user) {
                set({
                    userName: "",
                    email: "",
                    userId: "",
                });
                return;
            }

            set({
                userName: data.user.userName ?? "",
                email: data.user.email ?? "",
                userId: data.user.userId ?? "",
            });
        } catch (error) {
            console.error("failed to fetch user:", error);
            set({
                userName: "",
                email: "",
                userId: "",
            });
        } finally {
            set({ isLoading: false });
        }
    },
}));
