import React, { useEffect, useState } from "react";
import Post from "./Post";
import { getPost } from "@/api/postsApi";
import { ownerAccountStore } from "@/store/ownerAccountStore";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getImageSize, getVideoSize } from "@/utils/getSizeElement";
import { Plus } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

const calculateNumberOfScales = (dimensions) => {
  const numberSquare = dimensions.reduce(
    (sum, curr) => (curr.width / curr.height === 1 ? (sum += 1) : sum),
    0
  );
  const numberHorizontal = dimensions.reduce(
    (sum, curr) => (curr.width / curr.height > 1 ? (sum += 1) : sum),
    0
  );
  const numberVertical = dimensions.length - numberSquare - numberHorizontal;

  return { numberSquare, numberHorizontal, numberVertical };
};

const genClassLayout = async (medias) => {
  const dimensions = await Promise.all(
    medias.map((media) => {
      if (media.type === "image") {
        return getImageSize(media.src).catch((err) => {
          console.log(`Lỗi lấy kích thước cho ảnh ${media.src}: ${err}`);
        });
      }
      if (media.type === "video") {
        return getVideoSize(media.src).catch((err) => {
          console.log(`Lỗi lấy kích thước cho video ${media.src}: ${err}`);
        });
      }
      return Promise.resolve({}); // Trường hợp không khớp regex
    })
  );

  switch (medias.length) {
    case 1:
      return "size-full max-h-[calc(100%*9/16)]";

    case 2:
      var { numberSquare, numberHorizontal, numberVertical } =
        calculateNumberOfScales(dimensions);
      if (numberHorizontal === 2)
        return "gap-0.5 aspect-square grid grid-rows-2";
      if (numberVertical === 2) return "gap-0.5 aspect-square grid grid-cols-2";
      return "gap-0.5 grid grid-cols-2 [&>*]:aspect-square";

    case 3:
      var { numberSquare, numberHorizontal, numberVertical } =
        calculateNumberOfScales(dimensions);
      numberHorizontal += numberSquare;
      if (numberHorizontal > numberVertical) {
        return "grid gap-0.5 grid-cols-2 aspect-square [&>:nth-child(1)]:col-span-2 ";
      }
      return "grid gap-0.5 grid-cols-[auto_auto] aspect-square [&>:nth-child(1)]:row-span-2 [&>:nth-child(1)]:w-full [&>:not(:nth-child(1))]:w-full";

    case 4:
      const firstRatio = dimensions[0].width / dimensions[0].height;
      if (firstRatio > 1)
        return "grid gap-0.5 grid-cols-3 [&>:nth-child(1)]:col-span-3 [&>:not(:nth-child(1))]:aspect-square";
      if (firstRatio === 1)
        return "grid gap-0.5 grid-cols-2 grid-rows-2 aspect-square";
      return "aspect-square grid gap-0.5 grid-cols-[auto_auto] grid-rows-3 [&>:nth-child(1)]:row-span-3";

    // case 5 or 5+
    default:
      var { numberSquare, numberHorizontal, numberVertical } =
        calculateNumberOfScales(dimensions.slice(2, 6));
      numberHorizontal += numberSquare;
      if (numberHorizontal > numberVertical)
        return `
				aspect-square grid gap-0.5 grid-flow-col grid-cols-[auto_auto] grid-rows-6 
				[&>:nth-child(1)]:row-span-3
				[&>:nth-child(2)]:row-span-3 
				[&>:nth-child(3)]:row-span-2 
				[&>:nth-child(4)]:row-span-2 
				[&>:nth-child(5)]:row-span-2`;
      return `
			aspect-square grid gap-0.5 grid-cols-6 grid-rows-[auto_auto] 
			[&>:nth-child(1)]:col-span-3
			[&>:nth-child(2)]:col-span-3 
			[&>:nth-child(3)]:col-span-2 
			[&>:nth-child(4)]:col-span-2 
			[&>:nth-child(5)]:col-span-2`;
  }
};

export default function GenerateMediaLayout({
  medias,
  allowCarousel = false,
  mediaCallback = () => {},
  store,
  blockEvent,
}) {
  // handle lấy post nếu là repost
  const isPost = medias.length === 1 && medias[0].type === "post";
  const [post, setPost] = useState(null);

  const handleGetPost = async (postId) => {
    const user = ownerAccountStore.getState().user;
    const resp = await getPost(user.userId, postId);
    if (!resp || resp.statusCode !== 200) return;
    setPost(resp.data);
  };

  useEffect(() => {
    isPost && handleGetPost(medias[0].src);
  }, []);

  // navigate về post gốc nếu là repost
  const navigate = useNavigate();
  const handleToOriginPost = () => {
    !blockEvent && navigate(`/post?id=${post.id}`);
  };

  // handle carousel khi mở comment modal
  allowCarousel = allowCarousel && medias.length > 1;
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api || isPost || !allowCarousel) {
      return;
    }
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // sinh class tailwind tự động theo số lượng và tỉ lệ của media
  const [classLayout, setClassLayout] = useState(null);

  useEffect(() => {
    const layout = async () => {
      setClassLayout(await genClassLayout(medias));
    };
    !allowCarousel && layout();
  }, [medias]);

  return (
    medias.length > 0 && (
      <div
        onClick={() => !allowCarousel && mediaCallback()}
        className={cn(
          "relative transition",
          !isPost && !allowCarousel
            ? cn("border-y border-x-0", classLayout)
            : "border-b"
        )}
      >
        {!isPost &&
          classLayout &&
          medias.slice(0, 5).map((media, index) => (
            <div key={index} className="relative overflow-hidden size-full">
              {media.type === "image" && (
                <img
                  src={media.src}
                  alt="Bài đăng"
                  className="size-full object-cover object-center"
                />
              )}
              {media.type === "video" && (
                <video
                  src={media.src}
                  controls
                  className="size-full object-cover object-center"
                />
              )}
              {/* if more than 5 */}
              {medias.length > 5 && index === 4 && (
                <div className="absolute inset-0 bg-black text-txtWhite bg-opacity-60 flex items-center justify-center">
                  <Plus className="size-7" />{" "}
                  <span className="text-2xl">{medias.length - 1 - index}</span>
                </div>
              )}
            </div>
          ))}

        {!isPost && allowCarousel && (
          <div className="relative border-t border-x-0">
            <Carousel setApi={setApi} className="w-[80%] mx-auto ">
              <CarouselContent className="max-h-[70vh]">
                {medias.map((media, index) => (
                  <CarouselItem key={index} className="pl-3">
                    {media.type === "image" && (
                      <img
                        src={media.src}
                        alt="Bài đăng"
                        className="size-full object-contain"
                      />
                    )}

                    {media.type === "video" && (
                      <div className="size-full object-contain grid place-content-center">
                        <video src={media.src} controls className="" />
                      </div>
                    )}
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="sm:inline-flex hidden" />
              <CarouselNext className="sm:inline-flex hidden" />
            </Carousel>
            <div className="fs-xs px-2 bg-background shadow-lg border rounded-full  absolute bottom-2 right-2">
              {current} / {medias.length}
            </div>
          </div>
        )}

        {post && (
          <div onClick={handleToOriginPost}>
            <Post
              post={post}
              isChildren={true}
              showReact={false}
              className="border-t rounded-lg overflow-hidden pointer-events-none"
              isShared={true}
              store={store}
              blockEvent={blockEvent}
            />
          </div>
        )}
      </div>
    )
  );
}
