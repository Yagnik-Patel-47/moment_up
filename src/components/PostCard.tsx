import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  IconButton,
  Typography,
  Button,
  Popover,
  makeStyles,
} from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import CommentIcon from "@material-ui/icons/Comment";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import { db, auth } from "../firebase";
import { FC, useState, MouseEvent } from "react";
import firebase from "../firebase";
import { RootStateOrAny, useSelector, useDispatch } from "react-redux";
import { ProfileData } from "../reducers/UpdateProfile";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import Link from "next/link";
import LikesModal from "../components/LikesModal";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import AppSnackBar from "./AppSnackBar";
import TextTruncate from "react-text-truncate";
import { useRouter } from "next/router";

interface Props {
  post: {
    title: string;
    description: string;
    likes: string[];
    comments: Array<any>;
    user: string;
    timestamp: string;
  };
  postID: string;
}

const useStyles = makeStyles({
  card: {
    borderRadius: 8,
    padding: "0 1rem",
    marginBottom: 20,
    background: "#f7f7f7",
  },
});

const PostCard: FC<Props> = ({ post, postID }: Props) => {
  const router = useRouter();
  const classes = useStyles();
  const [photo, setPhoto] = useState<string>("");
  const [uname, setUname] = useState<string>("");
  const [commentText, setCommentText] = useState<string>("");
  const [likesModalOpen, setLikesModalOpen] = useState<boolean>(false);
  const profile: ProfileData = useSelector(
    (store: RootStateOrAny) => store.profileData
  );
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClickPopOver = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopOver = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  db.collection("users")
    .doc(post.user)
    .get()
    .then((doc) => {
      if (doc.exists) {
        setPhoto(doc.data().photo);
        setUname(doc.data().userName);
      }
    });

  const addToLiked = () => {
    db.collection("posts")
      .doc(postID)
      .set(
        {
          likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.uid),
        },
        { merge: true }
      );

    db.collection("users")
      .doc(auth.currentUser.uid)
      .set(
        {
          likedPosts: firebase.firestore.FieldValue.arrayUnion(postID),
        },
        { merge: true }
      );
  };

  const removeFromLiked = () => {
    db.collection("posts")
      .doc(postID)
      .set(
        {
          likes: firebase.firestore.FieldValue.arrayRemove(
            auth.currentUser.uid
          ),
        },
        { merge: true }
      );

    db.collection("users")
      .doc(auth.currentUser.uid)
      .set(
        {
          likedPosts: firebase.firestore.FieldValue.arrayRemove(postID),
        },
        { merge: true }
      );
  };

  const savePost = () => {
    db.collection("users")
      .doc(auth.currentUser.uid)
      .set(
        {
          savedPosts: firebase.firestore.FieldValue.arrayUnion(postID),
        },
        { merge: true }
      );
  };

  const removeSavedPost = () => {
    db.collection("users")
      .doc(auth.currentUser.uid)
      .set(
        {
          savedPosts: firebase.firestore.FieldValue.arrayRemove(postID),
        },
        { merge: true }
      );
  };

  const deletePost = () => {
    db.collection("posts").doc(postID).delete();
    db.collection("users")
      .doc(auth.currentUser.uid)
      .set(
        {
          posts: firebase.firestore.FieldValue.arrayRemove(postID),
        },
        { merge: true }
      );
  };

  return (
    <>
      <Card elevation={4} className={classes.card}>
        <div className="flex items-center p-4 justify-between">
          <Link href={`/${encodeURIComponent(uname)}`}>
            <div className="flex items-center space-x-4">
              {photo ? (
                <Avatar src={photo} alt="profile image" />
              ) : (
                <Avatar>{uname[0]}</Avatar>
              )}
              <Typography>{uname}</Typography>
            </div>
          </Link>
          {profile.posts.includes(postID) && (
            <IconButton
              onClick={handleClickPopOver}
              style={{ outline: "none" }}
              size="medium"
            >
              <MoreVertIcon />
            </IconButton>
          )}
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClosePopOver}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Button
              style={{ outline: "none", color: "#fff" }}
              startIcon={<DeleteForeverIcon />}
              color="primary"
              variant="contained"
              onClick={deletePost}
            >
              Delete Post
            </Button>
          </Popover>
        </div>
        <div className="flex items-center relative px-4">
          <Typography noWrap variant="h5">
            {post.title}
          </Typography>
        </div>
        <CardContent>
          <TextTruncate
            line={3}
            element="p"
            truncateText="…"
            text={post.description.replace(new RegExp("<br />", "g"), " ")}
          />
        </CardContent>
        <CardActions>
          <div className="w-full flex items-center justify-between">
            <div className="space-x-2 items-center flex">
              <div className="flex items-center">
                {profile.likedPosts.includes(postID) ? (
                  <IconButton size="small" onClick={removeFromLiked}>
                    <FavoriteIcon />
                  </IconButton>
                ) : (
                  <IconButton size="small" onClick={addToLiked}>
                    <FavoriteBorderIcon />
                  </IconButton>
                )}
                {post.likes.length !== 0 && (
                  <IconButton
                    onClick={() => {
                      setLikesModalOpen(true);
                    }}
                    size="small"
                    style={{ color: "rgba(0, 0, 0, 0.87)" }}
                  >
                    {post.likes.length}
                  </IconButton>
                )}
              </div>
              <div className="flex items-center">
                <IconButton
                  size="small"
                  onClick={() => router.push(`/post/${postID}?comment=true`)}
                >
                  <CommentIcon />
                </IconButton>
                {post.comments.length !== 0 && (
                  <Typography variant="button">
                    {post.comments.length}
                  </Typography>
                )}
              </div>
              <Button
                onClick={() => router.push(`/post/${postID}`)}
                variant="outlined"
                size="small"
              >
                read more
              </Button>
            </div>
            {profile?.savedPosts?.includes(postID) ? (
              <IconButton onClick={removeSavedPost}>
                <BookmarkIcon />
              </IconButton>
            ) : (
              <IconButton onClick={savePost}>
                <BookmarkBorderOutlinedIcon />
              </IconButton>
            )}
          </div>
        </CardActions>
      </Card>
      <AnimatePresence>
        {likesModalOpen && (
          <LikesModal
            setLikesModalOpen={setLikesModalOpen}
            likes={post.likes}
          />
        )}
      </AnimatePresence>
      <AppSnackBar type="error" message="Please write your comment first." />
    </>
  );
};

export default PostCard;
