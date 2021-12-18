import { IconButton, Typography } from "@material-ui/core";
import PostCard from "./PostCard";
import Masonry from "react-masonry-css";
import { auth, db } from "../firebase";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import { FC, useState } from "react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import MenuIcon from "@material-ui/icons/Menu";
import Image from "next/image";

const Feed: FC = () => {
  const showFeed = useSelector((store: RootStateOrAny) => store.showFeed);
  const [savedPosts, setSavedPosts] = useState<Array<any>>([]);
  const dispatch = useDispatch();

  const breakpoints = {
    default: 2,
    1100: 2,
    700: 1,
  };
  const [allPosts] = useCollection(
    db.collection("posts").orderBy("timestamp", "desc"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const [savedPostsData] = useDocumentData(
    db.collection("users").doc(auth.currentUser.uid),
    { snapshotListenOptions: { includeMetadataChanges: true } }
  );

  useEffect(() => {
    if (allPosts) {
      const savedFilter = allPosts.docs.filter((post) =>
        savedPostsData?.savedPosts.includes(post.id)
      );
      setSavedPosts(savedFilter);
    }
  }, [savedPostsData, allPosts]);

  const togglePostCreator = () => {
    dispatch({ type: "SHOW_POST_CREATOR" });
  };

  return (
    <div className="flex flex-col space-y-6 h-full bg-[#f0efeb] lg:px-20">
      <div className="w-full flex justify-between items-center px-6 mt-6">
        <div className="space-x-2 flex items-center">
          <IconButton
            onClick={() => {
              dispatch({ type: "SHOW_SIDEBAR" });
            }}
            color="primary"
          >
            <MenuIcon />
          </IconButton>
        </div>
        <div className="flex space-x-5 items-center">
          <div className="flex items-center space-x-4">
            <Image src="/moments.png" alt="Logo" height={45} width={45} />
            <Typography variant="h6">Moments</Typography>
          </div>
        </div>
      </div>
      <div className="flex items-center px-6 justify-between mb-6">
        <Typography className="!font-roboto" variant="h4">
          {showFeed ? "Feed" : "Saved Posts"}
        </Typography>
        <button onClick={togglePostCreator} className="app-btn">
          Add Post
        </button>
      </div>
      <Masonry
        breakpointCols={breakpoints}
        className="space-x-4 my-masonry-grid h-full overflow-x-hidden hide-scrollbars px-6 !mb-6"
        columnClassName="my-masonry-grid_column"
      >
        {showFeed
          ? allPosts &&
            allPosts.docs.map((post) => (
              <PostCard
                key={post.id}
                post={{
                  description: post.data().description,
                  user: post.data().user,
                  title: post.data().title,
                  likes: post.data().likes,
                  comments: post.data().comments,
                  timestamp: post.data().timestamp,
                }}
                postID={post.id}
              />
            ))
          : savedPosts &&
            savedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={{
                  description: post.data().description,
                  user: post.data().user,
                  title: post.data().title,
                  likes: post.data().likes,
                  comments: post.data().comments,
                  timestamp: post.data().timestamp,
                }}
                postID={post.id}
              />
            ))}
        {!showFeed && savedPosts && savedPosts.length === 0 && (
          <Typography>
            <strong>0</strong> Saved Posts
          </Typography>
        )}
        {showFeed && allPosts && allPosts.docs.length === 0 && (
          <Typography>No Posts. be the first to post.</Typography>
        )}
      </Masonry>
    </div>
  );
};

export default Feed;
