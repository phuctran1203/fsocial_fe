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
import useSideActionMessageStore from "@/store/sideActionMessageStore";

export default function cleanupStore() {
	ownerAccountStore.getState().cleanOwnerAccountStore();
	useMessageStore.getState().cleanMessageWebSocket();
	useSideActionMessageStore.getState().cleanSideActionMessageWebSocket();
	useNotificationsStore.getState().cleanNotificationWebSocket();
	useHomePostsStore.getState().cleanPostsStore();
	useFollowPostsStore.getState().cleanPostsStore();
	useSearchPostsStore.getState().cleanPostsStore();
	useProfilePostsStore.getState().cleanPostsStore();
	useSinglePostStore.getState().cleanPostsStore();
}
