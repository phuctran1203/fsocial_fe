import { create } from "zustand";

export const postsStore = create((set) => ({
	posts: [],

	// Hàm cập nhật một post trong danh sách
	updatePost: (id, newProps) => {
		set((state) => ({
			posts: state.posts.map((post) => (post.id === id ? { ...post, ...newProps } : post)),
		}));
	},

	// Hàm thêm nhiều post mới vào danh sách
	setPosts: (newPosts) => {
		set(() => ({
			posts: newPosts,
		}));
	},

	insertPost: (post) => {
		set((state) => ({
			posts: [post, ...state.posts],
		}));
	},

	findPost: (id) => postsStore.getState().posts.find((post) => post.id === id),
}));
