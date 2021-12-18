import {
  Backdrop,
  Box,
  makeStyles,
  IconButton,
  Typography,
  TextField,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { FC, useState } from "react";
import { db, auth } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import firebase from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";

const useStyles = makeStyles({
  backdrop: {
    zIndex: 10000,
  },
});

const PostCreator: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const showCreateModal = useSelector(
    (store: RootStateOrAny) => store.postCreator
  );
  const [titleText, setTitleText] = useState<string>("");
  const [descriptionText, setDescriptionText] = useState<string>("");
  const [user] = useAuthState(auth);

  const handlePost = () => {
    if (!titleText) {
      alert("plz write title text");
      return;
    }
    const id = uuidv4();
    const linesDescription = descriptionText.replace(/\n/g, "<br />");
    db.collection("posts").doc(id).set({
      title: titleText,
      description: linesDescription,
      likes: [],
      comments: [],
      user: user.uid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    db.collection("users")
      .doc(auth.currentUser.uid)
      .set(
        {
          posts: firebase.firestore.FieldValue.arrayUnion(id),
        },
        { merge: true }
      );
    dispatch({ type: "HIDE_POST_CREATOR" });
    setTitleText("");
    setDescriptionText("");
  };

  return (
    <Backdrop className={classes.backdrop} open={showCreateModal}>
      <Box className="bg-[#e5e5e5] w-3/4 flex flex-col items-center space-y-4 rounded-md p-4 md:space-y-8 h-3/4 overflow-x-hidden hide-scrollbars">
        <div className="flex justify-between items-center p-4 w-full">
          <Typography variant="h6">Create Post</Typography>
          <IconButton
            style={{ outline: "none" }}
            onClick={() => {
              dispatch({ type: "HIDE_POST_CREATOR" });
              setTitleText("");
              setDescriptionText("");
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div className="flex w-full flex-col lg:px-12 space-y-4">
          <TextField
            variant="filled"
            label="Title"
            value={titleText}
            fullWidth
            onChange={(e) => {
              setTitleText(e.target.value);
            }}
          />
          <textarea
            className=" bg-gray-300 outline-none border-0 p-3 placeholder:text-black/70 placeholder:text-lg"
            cols={30}
            rows={10}
            placeholder="describe you thoughts..."
            value={descriptionText}
            onChange={(e) => setDescriptionText(e.target.value)}
          ></textarea>
        </div>
        <button className="app-btn" onClick={handlePost}>
          <Typography variant="button">Post</Typography>
        </button>
      </Box>
    </Backdrop>
  );
};

export default PostCreator;
