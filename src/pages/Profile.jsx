import { ownerAccountStore } from "@/store/ownerAccountStore";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PencilChangeImageIcon } from "@/components/Icon";
import Button from "@/components/Button";
import { useLocation } from "react-router-dom";
import { useProfilePostsStore } from "@/store/postsStore";
import { getPosts } from "@/api/postsApi";
import RenderPosts from "@/components/RenderPosts";
import {
  getFollowers,
  getProfile,
  requestFollow,
  unfollow,
} from "@/api/profileApi";
import {
  combineIntoAvatarName,
  combineIntoDisplayName,
} from "@/utils/combineName";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { userProfileOptions } from "@/config/userProfileOptions";
import { usePopupStore } from "@/store/popupStore";
import ModalCropImage from "@/components/ModalCropImage";
import { cn } from "@/lib/utils";
import { Ellipsis } from "lucide-react";
import { messageReadAllPosts } from "@/config/globalVariables";
import { listTabs } from "@/config/userProfileTabs";
import { listFriends } from "@/data/fakeDataFriends";

export default function Profile() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { user, setUser } = ownerAccountStore();
  const [accountInfo, setAccountInfo] = useState({});
  const maxPreviewFriendsAvatar = useRef(7);

  // handle change banner, avatar
  const { showPopup, hidePopup } = usePopupStore();

  const handleSelectBanner = (e) => {
    const el = e.target;
    const file = el.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      console.log("have file");
      showPopup(
        "Cập nhật ảnh bìa",
        <ModalCropImage
          image={previewURL}
          ratio={3 / 1}
          acceptCropCallback={(imageCroped) => {
            setUser({ banner: imageCroped });
            hidePopup();
          }}
        />
      );
    }
  };

  const handleSelectAvatar = (e) => {
    const el = e.target;
    const file = el.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      console.log("have file");
      showPopup(
        "Cập nhật ảnh đại diện",
        <ModalCropImage
          image={previewURL}
          ratio={1 / 1}
          acceptCropCallback={(imageCroped) => {
            setUser({ avatar: imageCroped });
            hidePopup();
          }}
        />
      );
    }
  };

  // handle click follow, hủy follow
  const handleRequestFollow = () => {
    requestFollow(queryParams.get("id"));
    setAccountInfo({ ...accountInfo, relationship: true });
  };

  const handleUnfollow = () => {
    unfollow(queryParams.get("id"));
    setAccountInfo({ ...accountInfo, relationship: false });
  };

  // handle các tab
  const containerTabsRef = useRef(null);
  const wrapperTabsRef = useRef(null);
  const [currentTab, setCurrentTab] = useState(null);

  // handle post user
  const {
    posts: postsUser,
    setPosts: setPostsUser,
    appendPosts: appendPostsUser,
  } = useProfilePostsStore();
  const [isEndUserPosts, setIsEndUserPosts] = useState(false);

  const showPosts = () => {
    fetchPostsUser();
  };

  const fetchPostsUser = async () => {
    const resp = await getPosts(user.userId);
    if (!resp || resp.statusCode !== 200) return;
    if (!postsUser) {
      setPostsUser(resp.data);
    } else {
      if (postsUser.length !== 0 && resp.data.length === 0) {
        setIsEndUserPosts(true);
        return;
      }
      appendPostsUser(resp.data);
    }
  };
  // handle tab hình ảnh
  const showPictures = async () => {};
  // handle tab video
  const showVideos = async () => {};
  // handle tab những ai đang theo dõi user
  const [followers, setFollowers] = useState(null);

  const showFollowers = async () => {
    if (followers) return;
    const resp = await getFollowers();
    if (!resp || resp.statusCode !== 200) return;
    setFollowers(resp.data);
  };
  // handle tab bài viết user đã tương tác
  const showPostsReacted = async () => {
    fetchPostsReacted();
  };

  const fetchPostsReacted = () => {};

  useEffect(() => {
    switch (currentTab) {
      case 0:
        showPosts();
        break;
      case 1:
        showPictures();
        break;
      case 2:
        showVideos();
        break;
      case 3:
        showFollowers();
        break;
      case 4:
        showPostsReacted();
        break;
    }
  }, [currentTab]);

  const clickChangeTab = (index) => {
    const container = containerTabsRef.current;
    const targetChild = wrapperTabsRef.current.children[index];
    if (!container || !targetChild) return;
    const targetLeft = targetChild.offsetLeft - container.offsetLeft;
    container.scrollTo({ left: targetLeft, behavior: "smooth" });
    ignoreIntersec.current = true;
    setCurrentTab(index);
    setTimeout(() => {
      if (ignoreIntersec.current) ignoreIntersec.current = false;
    }, 500);
  };

  const [touched, setTouched] = useState(false);
  const startDragPos = useRef(0);
  const scrollLeftStart = useRef(0);
  const speedFactor = 2; // Tăng tốc cuộn lên 2 lần

  const ignoreIntersec = useRef(false);

  const onPressDown = (e) => {
    setTouched(true);
    const clientX = e.touches?.[0]?.clientX || e.clientX;
    startDragPos.current = clientX;
    scrollLeftStart.current = containerTabsRef.current?.scrollLeft || 0;
  };

  const onDrag = (e) => {
    if (!touched || !containerTabsRef.current) return;
    // Ngăn chặn hành vi cuộn mặc định của trình duyệt
    e.preventDefault();
    const clientX = e.touches?.[0]?.clientX || e.clientX;
    const diff = clientX - startDragPos.current;
    // Tăng tốc độ cuộn bằng cách nhân với speedFactor
    containerTabsRef.current.scrollLeft =
      scrollLeftStart.current - diff * speedFactor;
  };

  const onEnd = () => {
    setTouched(false);
  };

  const isOwner =
    !queryParams.get("id") || queryParams.get("id") === user.userId;

  const handleGetProfile = async () => {
    const resp = await getProfile(queryParams.get("id"));
    if (!resp || resp.statusCode !== 200) return;
    const data = await resp.data;
    setAccountInfo(data);
  };

  useEffect(() => {
    if (!user?.userId) return;
    setCurrentTab(0);

    if (isOwner) {
      setAccountInfo(user);
    } else {
      handleGetProfile();
    }
  }, [user, queryParams.get("id")]);

  useEffect(() => {
    if (!wrapperTabsRef.current) return;
    const interCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !ignoreIntersec.current) {
          const index = Array.from(wrapperTabsRef.current.children).indexOf(
            entry.target
          );
          setCurrentTab(index);
        }
      });
    };
    const options = {
      root: containerTabsRef.current, // Phạm vi quan sát (mặc định là viewport)
      rootMargin: "0px", // Biên ngoài phạm vi quan sát (giống margin trong CSS)
      threshold: 0.6, // Ngưỡng kích hoạt (0 → 1)
    };
    const observer = new IntersectionObserver(interCallback, options);
    Array.from(wrapperTabsRef.current.children).forEach((element) =>
      observer.observe(element)
    );
    return () => observer.disconnect();
  }, [currentTab, wrapperTabsRef.current]);

  return (
    <div className="flex-grow bg-background transition overflow-auto scrollable-div">
      <div className="lg:max-w-[630px] mx-auto">
        {/* banner */}
        <div
          className={cn(
            "relative sm:mt-5 mt-2 aspect-[3/1] overflow-hidden lg:rounded-lg border",
            !accountInfo.banner && "border-field"
          )}
        >
          {accountInfo.banner ? (
            <img
              src={accountInfo.banner}
              alt="Ảnh bìa"
              className="object-cover size-full object-center"
            />
          ) : (
            isOwner && (
              <div className="size-full grid place-content-center">
                <p>Cập nhật ảnh bìa của bạn</p>
              </div>
            )
          )}
          {isOwner && (
            <label className="btn-secondary w-fit absolute bottom-2 right-2 py-1 ps-2.5 pe-4 border cursor-pointer">
              <PencilChangeImageIcon />
              Đổi ảnh bìa
              <input
                type="file"
                hidden
                onChange={handleSelectBanner}
                onClick={(e) => {
                  e.target.value = "";
                }}
              />
            </label>
          )}
        </div>

        <div className="sm:-mt-6 -mt-4 mx-auto lg:max-w-[630px] ">
          {/* profile detail */}
          <div className="flex sm:flex-row sm:items-start flex-col items-center gap-4 sm:px-3 px-1">
            <div className="relative bg-background border-4 rounded-full p-1 mt-3 w-fit transition">
              <Avatar className={`size-[120px]`}>
                <AvatarImage src={accountInfo.avatar} />
                <AvatarFallback className="text-[40px] transition">
                  {combineIntoAvatarName(
                    accountInfo.firstName,
                    accountInfo.lastName
                  )}
                </AvatarFallback>
              </Avatar>

              {isOwner && (
                <label className="btn-secondary w-fit absolute bottom-0 right-0 p-1 rounded-full shadow border cursor-pointer">
                  <input
                    type="file"
                    hidden
                    onChange={handleSelectAvatar}
                    onClick={(e) => {
                      e.target.value = "";
                    }}
                  />
                  <PencilChangeImageIcon />
                </label>
              )}
            </div>

            <div className="flex-grow sm:self-center sm:block sm:px-0 sm:pt-5 px-4  flex flex-col items-center">
              <h3 className="line-clamp-2">
                {combineIntoDisplayName(
                  accountInfo.firstName,
                  accountInfo.lastName
                )}
              </h3>

              <p>{accountInfo.followers?.length} người theo dõi</p>

              <div className="mt-1 flex -space-x-2">
                {accountInfo.followers
                  ?.slice(0, maxPreviewFriendsAvatar.current)
                  .map((friend, index) => (
                    <div key={index} className="relative">
                      <Avatar
                        className={`size-7 ring-[2px] ring-background transition`}
                      >
                        <AvatarImage src={friend.avatar} />
                        <AvatarFallback className="text-[11px] font-medium">
                          {combineIntoAvatarName(
                            friend.firstName,
                            friend.lastName
                          )}
                        </AvatarFallback>
                      </Avatar>
                      {index + 1 ===
                        Math.min(
                          maxPreviewFriendsAvatar.current,
                          accountInfo.followers.length
                        ) && (
                        <button
                          className="absolute top-0 size-full bg-black/50 grid place-content-center rounded-full hover:bg-black/60"
                          onClick={() => clickChangeTab(3)}
                        >
                          <Ellipsis className="size-4 text-txtWhite" />
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            <div className="self-center flex gap-4 ">
              {/* profile options */}
              <Popover>
                <PopoverTrigger className="btn-secondary aspect-square h-10 border">
                  <Ellipsis className="size-5" />
                </PopoverTrigger>
                <PopoverContent className="bg-background p-1.5 w-64">
                  {userProfileOptions[isOwner ? "OWNER" : "OTHER"].map(
                    (item, index) => (
                      <Button
                        key={index}
                        to={item.to}
                        className="btn-transparent gap-2 justify-start px-3 py-2.5"
                      >
                        {item.icon} {item.content}
                      </Button>
                    )
                  )}
                </PopoverContent>
              </Popover>
              {/* follow, unfollow */}
              {!isOwner && accountInfo.relationship === false && (
                <Button
                  className="btn-primary px-8 text-nowrap h-10"
                  onClick={handleRequestFollow}
                >
                  Theo dõi
                </Button>
              )}

              {!isOwner && accountInfo.relationship === true && (
                <Button
                  className="btn-secondary px-5 text-nowrap h-10"
                  onClick={handleUnfollow}
                >
                  Đang theo dõi
                </Button>
              )}
            </div>
          </div>

          {/* bio */}
          <div className="mt-4 text-center">{accountInfo.bio}</div>

          <div className="mt-8 flex flex-col gap-2 h-[100dvh]">
            {/* button head */}
            <div className="border-t flex bg-background transition">
              {(isOwner ? listTabs : listTabs.slice(0, 4)).map((tab, index) => (
                <button
                  key={index}
                  className={`flex-grow flex items-center justify-center gap-1 border-t px-1 sm:py-1 py-3 ${
                    currentTab === index
                      ? "text-primary-text fill-primary-text stroke-primary-text border-primary-text"
                      : "text-gray fill-gray stroke-gray border-background"
                  }`}
                  onClick={() => clickChangeTab(index)}
                >
                  {tab.icon}
                  <span className="sm:inline hidden"> {tab.label}</span>
                </button>
              ))}
            </div>

            {/* tab content */}
            <div
              ref={containerTabsRef}
              className="flex-grow w-full overflow-x-auto snap-x snap-mandatory scrollable-div scroll-smooth"
              onMouseDown={onPressDown}
              onMouseMove={onDrag}
              onMouseUp={onEnd}
            >
              <div
                ref={wrapperTabsRef}
                className={cn(
                  "grid h-full gap-[1px]",
                  isOwner
                    ? "grid-cols-[repeat(5,100%)]"
                    : "grid-cols-[repeat(4,100%)]"
                )}
              >
                {/* owner posts */}
                <div className="pt-0.5 snap-start mx-auto md:space-y-4 space-y-1.5 md:pb-0 overflow-y-auto w-full max-h-full scrollable-div">
                  <RenderPosts
                    className="sm:rounded shadow-y border-x my-2 md:my-4"
                    posts={postsUser}
                    store={useProfilePostsStore}
                    fetchPosts={fetchPostsUser}
                  />
                  {isEndUserPosts && (
                    <p className="pb-4 text-center text-gray">
                      {messageReadAllPosts}
                    </p>
                  )}
                </div>
                {/* owner pictures */}
                <div className="snap-start grid grid-cols-3 gap-[1px] h-fit overflow-y-auto w-full max-h-full scrollable-div">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="aspect-square w-full overflow-hidden"
                    >
                      <img
                        src={`./temp/profile_tab_image_${index + 1}.png`}
                        alt=""
                        className="w-full object-cover object-center"
                      />
                    </div>
                  ))}
                </div>
                {/* owner video */}
                <div className="snap-start grid grid-cols-3 gap-[1px] h-fit overflow-y-auto w-full max-h-full scrollable-div">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="relative aspect-square w-full overflow-hidden"
                    >
                      <img
                        src={`./temp/profile_tab_image_${index + 1}.png`}
                        alt=""
                        className="w-full object-cover object-center"
                      />
                      <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 bg-black/60 rounded-full grid place-content-center">
                        <svg
                          className="size-4"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            className="stroke-txtWhite"
                            d="M11.9949 5.41155C13.335 6.1039 13.335 7.8961 11.9949 8.58844L3.90312 12.7687C2.60064 13.4416 1 12.5658 1 11.1803V2.81974C1 1.43421 2.60064 0.558412 3.90312 1.23129L11.9949 5.41155Z"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                {/* owner followers */}
                <div className="snap-start grid grid-cols-5 sm:gap-3 gap-2 min-h-1 h-fit overflow-y-auto w-full max-h-full scrollable-div">
                  {followers &&
                    followers.map((friend) => (
                      <div key={friend.firstName}>
                        <div className="aspect-square">
                          <Avatar className="size-full rounded-md">
                            <AvatarImage
                              scr={friend.avatar}
                              className="rounded-none"
                            />
                            <AvatarFallback className="rounded-none text-[32px]">
                              {combineIntoAvatarName(
                                friend.firstName,
                                friend.lastName
                              )}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <p className="font-semibold">
                          {combineIntoDisplayName(
                            friend.firstName,
                            friend.lastName
                          )}
                        </p>
                      </div>
                    ))}
                  {(!followers || followers.length === 0) && (
                    <p className="text-center col-span-5">
                      Không có người theo dõi
                    </p>
                  )}
                </div>
                {/* owner posts reacted */}
                {isOwner && (
                  <div className="pt-0.5 snap-start mx-auto md:space-y-4 space-y-1.5 md:pb-0 overflow-y-auto w-full max-h-full scrollable-div">
                    <RenderPosts
                      className="sm:rounded shadow-y border-x my-2 md:my-4"
                      posts={postsUser}
                      store={useProfilePostsStore}
                      fetchPosts={fetchPostsUser}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
