"use strict";
import { create } from "zustand";

class PostsStore {
	constructor(set) {
		this.set = set;
	}
	// cập nhật các thuộc tính của 1 post
	updatePost = (id, newProps) => {
		this.set((state) => ({
			posts: state.posts.map((post) =>
				post.id === id ? { ...post, ...newProps } : post
			),
		}));
	};
	// thay thế nguyên 1 post đã có
	replacePost = (post) =>
		this.set((state) => ({
			posts: state.posts.map((oldPost) =>
				oldPost.id === post.id ? { ...oldPost, ...post } : oldPost
			),
		}));

	// set mới toàn bộ posts
	setPosts = (newPosts) => {
		this.set({ posts: newPosts });
	};
	// thêm 1 post mới vào đầu
	insertPost = (post) => {
		this.set((state) => ({
			posts: [post, ...state.posts],
		}));
	};
	// tìm post
	findPost = (id, get) => get().posts.find((post) => post.id === id);
	// xóa post
	deletePost = (id) =>
		this.set((state) => ({
			posts: state.posts.filter((post) => post.id !== id),
		}));
}

export const useHomePostsStore = create((set, get) => {
	const store = new PostsStore(set);
	return {
		posts: null,
		updatePost: store.updatePost,

		replacePost: store.replacePost,

		setPosts: store.setPosts,

		insertPost: store.insertPost,

		findPost: (id) => store.findPost(id, get),

		deletePost: store.deletePost,
	};
});

export const useFollowPostsStore = create((set, get) => {
	const store = new PostsStore(set);
	return {
		posts: null,
		updatePost: store.updatePost,

		replacePost: store.replacePost,

		setPosts: store.setPosts,

		insertPost: store.insertPost,

		findPost: (id) => store.findPost(id, get),

		deletePost: store.deletePost,
	};
});

export const useSearchPostsStore = create((set, get) => {
	const store = new PostsStore(set);
	return {
		posts: null,
		updatePost: store.updatePost,

		replacePost: store.replacePost,

		setPosts: store.setPosts,

		insertPost: store.insertPost,

		findPost: (id) => store.findPost(id, get),

		deletePost: store.deletePost,
	};
});

export const useProfilePostsStore = create((set, get) => {
	const store = new PostsStore(set);
	return {
		posts: null,
		updatePost: store.updatePost,

		replacePost: store.replacePost,

		setPosts: store.setPosts,

		insertPost: store.insertPost,

		findPost: (id) => store.findPost(id, get),

		deletePost: store.deletePost,
	};
});
