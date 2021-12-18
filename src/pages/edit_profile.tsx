import {
  Button,
  TextField,
  Avatar,
  Typography,
  makeStyles,
  IconButton,
} from "@material-ui/core";
import { useState } from "react";
import { useSelector, RootStateOrAny, useDispatch } from "react-redux";
import { ProfileData } from "../reducers/UpdateProfile";
import { db, auth } from "../firebase";
import AppSnackBar from "../components/AppSnackBar";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import MenuIcon from "@material-ui/icons/Menu";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: 140,
    height: 140,
    [theme.breakpoints.down(801)]: {
      width: 120,
      height: 120,
    },
  },
}));

const EditProfile = () => {
  const router = useRouter();
  const classes = useStyles();
  const isMobbile = useMediaQuery("(max-width: 800px)");
  const profile: ProfileData = useSelector(
    (store: RootStateOrAny) => store.profileData
  );
  const dispatch = useDispatch();
  const [newUsername, setNewUsername] = useState<String>(profile.userName);
  const [newFullName, setNewFullName] = useState<String>(profile.fullName);

  const SubmitChanges = () => {
    if (!(newUsername && newFullName)) {
      return alert(
        "Please enter all fields. if you not have to change all fields, rewrite that fields as before."
      );
    }
    db.collection("users").doc(auth.currentUser.uid).set(
      {
        fullName: newFullName,
        userName: newUsername,
      },
      { merge: true }
    );
    dispatch({ type: "OPEN_SNACKBAR" });
  };

  return (
    <div className="flex flex-col px-12 py-8 space-y-4 w-full h-full">
      {isMobbile && (
        <div>
          <IconButton
            onClick={() => {
              dispatch({ type: "SHOW_SIDEBAR" });
            }}
            style={{ outline: "none" }}
          >
            <MenuIcon />
          </IconButton>
        </div>
      )}
      <Typography align="center" variant="h6">
        Edit Your Profile.
      </Typography>
      <div className="flex items-center flex-col space-y-6">
        {profile.photo ? (
          <Avatar
            className={classes.avatar}
            src={profile.photo}
            alt="profile image"
          />
        ) : (
          <Avatar className={classes.avatar}>
            {profile.userName[0]?.toUpperCase()}
          </Avatar>
        )}
      </div>
      <div className="container flex flex-col mx-auto items-center">
        <div className="flex flex-col md:flex-row">
          <TextField
            label="Full Name"
            variant="filled"
            className="!m-2"
            value={newFullName}
            onChange={(e) => {
              setNewFullName(e.target.value);
            }}
          />
          <TextField
            label="Username"
            variant="filled"
            className="!m-2"
            value={newUsername}
            onChange={(e) => {
              setNewUsername(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="flex w-full space-x-3 justify-center">
        <Button onClick={SubmitChanges} variant="contained" color="primary">
          Save
        </Button>
        <Button
          onClick={() => router.back()}
          variant="outlined"
          color="secondary"
        >
          Cancel
        </Button>
      </div>
      <AppSnackBar type="success" message="Successfully changed your data." />
    </div>
  );
};

export default EditProfile;
