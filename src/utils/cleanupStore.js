import useMessageStore from "@/store/messageStore";
import useNotificationsStore from "@/store/notificationStore";
import { ownerAccountStore } from "@/store/ownerAccountStore";
import {
	useFollowPostsStore,
	useHomePostsStore,
	useProfilePostsStore,
	useSearchPostsStore,
	useSinglePostStore,
} from "@/store/postsStore";

export default function cleanupStore() {
	ownerAccountStore.getState().cleanOwnerAccountStore();
	useMessageStore.getState().cleanMessageWebSocket();
	useNotificationsStore.getState().cleanNotificationWebSocket();
	useHomePostsStore.getState().cleanPostsStore();
	useFollowPostsStore.getState().cleanPostsStore();
	useSearchPostsStore.getState().cleanPostsStore();
	useProfilePostsStore.getState().cleanPostsStore();
	useSinglePostStore.getState().cleanPostsStore();
}
