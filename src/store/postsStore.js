"use strict";
import { create } from "zustand";

class PostsStore {
  constructor(set) {
    this.set = set;
    this.observer = null;
  }
  // Clean posts
  cleanPostsStore = () => {
    this.set({ posts: null });
  };
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
    this.set((state) =>
      state.posts ? { posts: [post, ...state.posts] } : { posts: [post] }
    );
  };
  // thêm nhiều post vào cuối, tự động kiểm soát số post tối đa
  appendPosts = (posts) => {
    this.set((state) => {
      let newPosts = [...state.posts, ...posts];
      return { posts: newPosts };
    });
  };
  // tìm post
  findPost = (id, get) => get().posts?.find((post) => post.id === id) || null;
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

    cleanPostsStore: store.cleanPostsStore,

    updatePost: store.updatePost,

    replacePost: store.replacePost,

    setPosts: store.setPosts,

    insertPost: store.insertPost,

    appendPosts: (posts, maxPosts) => store.appendPosts(posts, maxPosts),

    findPost: (id) => store.findPost(id, get),

    deletePost: store.deletePost,
  };
});

export const useFollowPostsStore = create((set, get) => {
  const store = new PostsStore(set);
  return {
    posts: null,

    cleanPostsStore: store.cleanPostsStore,

    updatePost: store.updatePost,

    replacePost: store.replacePost,

    setPosts: store.setPosts,

    insertPost: store.insertPost,

    appendPosts: (posts, maxPosts) => store.appendPosts(posts, maxPosts),

    findPost: (id) => store.findPost(id, get),

    deletePost: store.deletePost,
  };
});

export const useSearchPostsStore = create((set, get) => {
  const store = new PostsStore(set);
  return {
    posts: null,

    cleanPostsStore: store.cleanPostsStore,

    updatePost: store.updatePost,

    replacePost: store.replacePost,

    setPosts: store.setPosts,

    insertPost: store.insertPost,

    appendPosts: (posts, maxPosts) => store.appendPosts(posts, maxPosts),

    findPost: (id) => store.findPost(id, get),

    deletePost: store.deletePost,
  };
});

export const useProfilePostsStore = create((set, get) => {
  const store = new PostsStore(set);
  return {
    posts: null,

    cleanPostsStore: store.cleanPostsStore,

    updatePost: store.updatePost,

    replacePost: store.replacePost,

    setPosts: store.setPosts,

    insertPost: store.insertPost,

    appendPosts: (posts, maxPosts) => store.appendPosts(posts, maxPosts),

    findPost: (id) => store.findPost(id, get),

    deletePost: store.deletePost,
  };
});

export const useSinglePostStore = create((set, get) => {
  const store = new PostsStore(set);
  return {
    posts: null,

    cleanPostsStore: store.cleanPostsStore,

    updatePost: store.updatePost,

    setPosts: store.setPosts,

    findPost: (id) => store.findPost(id, get),

    deletePost: store.deletePost,
  };
});
