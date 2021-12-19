import { GetStaticProps, GetStaticPaths } from "next";
import { db, auth } from "../../firebase";
import Head from "next/head";
import { useDispatch } from "react-redux";
import MenuIcon from "@material-ui/icons/Menu";
import { useRouter } from "next/router";
import {
  Typography,
  IconButton,
  Button,
  Container,
  Divider,
  TextField,
  Avatar,
} from "@material-ui/core";
import { useState } from "react";
import SendIcon from "@material-ui/icons/Send";
import firebase from "../../firebase";
import Comment from "../../components/Comment";
import AppSnackBar from "../../components/AppSnackBar";
import moment from "moment";

interface Props {
  postFound: boolean;
  data: {
    comments: any[];
    likes: string[];
    title: string;
    description: string;
    timestamp: string;
    id: string;
  };
  postUser: {
    username: string;
    photo: string;
  };
}

const PostPage = ({ postFound, data, postUser }: Props) => {
  const router = useRouter();
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const dispatch = useDispatch();

  db.collection("posts")
    .doc(data.id)
    .onSnapshot((doc) => {
      if (doc.exists) {
        setComments(doc.data().comments as any[]);
      }
    });

  const postComment = () => {
    if (commentText === "") {
      dispatch({ type: "OPEN_SNACKBAR" });
      return;
    }
    db.collection("posts")
      .doc(data.id)
      .set(
        {
          comments: firebase.firestore.FieldValue.arrayUnion({
            user: auth.currentUser.uid,
            content: commentText,
          }),
        },
        { merge: true }
      );
    setCommentText("");
  };

  return (
    <>
      <AppSnackBar type="error" message="Please write your comment first." />
      {postFound ? (
        <div className="flex flex-col space-y-4 py-4 px-4 md:px-8 w-full">
          <div className="flex justify-between items-center md:px-12">
            <IconButton
              onClick={() => {
                dispatch({ type: "SHOW_SIDEBAR" });
              }}
              color="primary"
            >
              <MenuIcon />
            </IconButton>
            <Button
              onClick={() => {
                router.back();
              }}
              color="primary"
              variant="contained"
            >
              Back
            </Button>
          </div>
          <Container maxWidth="md">
            <div className="space-y-8 md:mt-6">
              <div className="flex space-x-4 items-center">
                {postUser.photo ? (
                  <Avatar src={postUser.photo} alt="profile image" />
                ) : (
                  <Avatar>{postUser.username[0].toUpperCase()}</Avatar>
                )}
                <Typography variant="subtitle1">
                  <span className="font-medium text-lg text-gray-800">
                    {postUser.username}
                  </span>
                </Typography>
                <Typography variant="subtitle1">
                  {moment(Number(data.timestamp) * 1000).format(
                    "MMM D[,] YY h:mm A"
                  )}
                </Typography>
              </div>
              <span className="font-semibold block text-2xl md:text-4xl">
                {data.title}
              </span>
              <p
                style={{
                  lineHeight: 1.5,
                  letterSpacing: "0.00938em",
                }}
                dangerouslySetInnerHTML={{ __html: data.description }}
              ></p>
              <Divider />
              <div className="flex space-x-6 justify-between w-full items-center">
                <TextField
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  fullWidth
                  variant="outlined"
                  label="write comment..."
                  multiline
                  autoFocus={Boolean(router.query.comment)}
                />
                <IconButton onClick={postComment}>
                  <SendIcon />
                </IconButton>
              </div>
              {comments && (
                <>
                  <div className="flex flex-col ml-12 space-y-3 !mb-6">
                    {comments.map((comment, index) => (
                      <Comment
                        key={index}
                        user={comment.user}
                        content={comment.content}
                      />
                    ))}
                  </div>
                  {comments.length === 0 && (
                    <Typography style={{ marginBottom: "1rem" }}>
                      No comments now!
                    </Typography>
                  )}
                </>
              )}
            </div>
          </Container>
        </div>
      ) : (
        <>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <title>Post Not Found!</title>
          </Head>
          <div className="flex items-center justify-center w-full h-full">
            <Typography variant="h6">User not found!</Typography>
          </div>
        </>
      )}
    </>
  );
};

export default PostPage;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  let docFound = false;
  let docData: any = {};
  let docID = "";
  let postUserData = {
    username: "",
    photo: "",
  };

  const post = await db
    .collection("posts")
    .doc(params.postid as string)
    .get();

  if (post.exists) {
    docFound = true;
    docID = post.id;
    docData = post.data();
  } else {
    docFound = false;
  }

  if (!docFound) {
    return {
      props: {
        postFound: false,
        data: null,
        postUser: null,
      },
    };
  }

  if (docFound) {
    const getUser = await db.collection("users").doc(post.data().user).get();
    if (getUser.exists) {
      postUserData.username = getUser.data().userName;
      postUserData.photo = getUser.data().photo;
    }
  }

  return {
    props: {
      postFound: true,
      data: {
        comments: docData.comments,
        likes: docData.likes,
        description: docData.description,
        timestamp: docData.timestamp.seconds,
        title: docData.title,
        id: docID,
      },
      postUser: postUserData,
    },
  };
};
