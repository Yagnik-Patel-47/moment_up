import {
  Drawer,
  makeStyles,
  Typography,
  Avatar,
  Button,
  Divider,
  IconButton,
} from "@material-ui/core";
import { FC } from "react";
import DashboardIcon from "@material-ui/icons/Dashboard";
import BookmarksIcon from "@material-ui/icons/Bookmarks";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { auth, db, storage } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import { useEffect, useState } from "react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { ProfileData } from "../reducers/UpdateProfile";
import CloseIcon from "@material-ui/icons/Close";
import { useRouter } from "next/router";
import Link from "next/link";
import { AnimateSharedLayout, motion } from "framer-motion";
import blue from "@material-ui/core/colors/blue";
import EditIcon from "@material-ui/icons/Edit";

const useStyles = makeStyles((theme) => ({
  SideBar: {
    width: "100%",
    background: "#e5e5e5",
    [theme.breakpoints.up(800)]: {
      position: "relative",
      width: "35vw",
    },
    [theme.breakpoints.up(1100)]: {
      position: "relative",
      width: "25vw",
    },
  },
  avatar: {
    height: "7rem",
    width: "7rem",
  },
  avatarPlusBtn: {
    position: "absolute",
    right: "0",
    bottom: "0.2rem",
    background: `linear-gradient(to bottom right, ${blue[300]}, ${blue[700]})`,
  },
}));

const SideBar: FC = () => {
  const classes = useStyles();
  const [user] = useAuthState(auth);
  const dispatch = useDispatch();
  const profile: ProfileData = useSelector(
    (store: RootStateOrAny) => store.profileData
  );
  const showFeed = useSelector((store: RootStateOrAny) => store.showFeed);
  const sideBarOpen = useSelector((store: RootStateOrAny) => store.showSidebar);
  const router = useRouter();

  const [userData] = useDocument(db.collection("users").doc(user?.uid), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  useEffect(() => {
    if (userData) {
      dispatch({
        type: "UPDATE_WHOLE_PROFILE",
        payload: userData.data(),
      });
    }
  }, [userData]);

  return (
    <Drawer
      classes={{ paper: classes.SideBar }}
      variant="temporary"
      anchor="left"
      open={sideBarOpen}
    >
      <div className="p-4 items-center flex justify-end">
        <IconButton
          onClick={() => {
            dispatch({ type: "HIDE_SIDEBAR" });
          }}
          color="primary"
        >
          <CloseIcon />
        </IconButton>
      </div>
      <div className="flex flex-col items-center space-y-3 mt-4">
        {profile.photo.length === 0 ? (
          <div className="relative">
            <Avatar
              style={{ background: "#34a853", color: "#fff" }}
              alt="profile"
              className={classes.avatar}
            >
              <Typography variant="h5">
                {profile?.fullName[0]?.toUpperCase()}
              </Typography>
            </Avatar>
          </div>
        ) : (
          <div className="relative">
            <Avatar
              src={profile.photo}
              alt="profile"
              className={classes.avatar}
            />
          </div>
        )}
        <Typography variant="h6">{profile.fullName}</Typography>
        <Typography>
          <Link
            href="/[username]"
            as={`/${encodeURIComponent(profile.userName)}`}
          >
            {`@${profile.userName}`}
          </Link>
        </Typography>
      </div>
      <div className="grid grid-cols-3 mt-4 gap-0.5">
        <div className="flex flex-col items-center p-4 space-y-2">
          <Typography variant="subtitle1">
            <strong>{profile.posts.length}</strong>
          </Typography>
          <Typography>Posts</Typography>
        </div>
        <div className="flex flex-col items-center p-4 space-y-2">
          <Typography variant="subtitle1">
            <strong>{profile.followers.length}</strong>
          </Typography>
          <Typography>Followers</Typography>
        </div>
        <div className="flex flex-col items-center p-4 space-y-2">
          <Typography variant="subtitle1">
            <strong>{profile.following.length}</strong>
          </Typography>
          <Typography>Followings</Typography>
        </div>
      </div>
      <div className="flex flex-col py-4 pl-10 mt-2 space-y-4">
        <AnimateSharedLayout>
          <Button
            className="!justify-start !p-3"
            startIcon={<DashboardIcon style={{ marginRight: "1rem" }} />}
            size="large"
            onClick={() => {
              if (router.pathname === "/[username]") {
                router.push("/");
              }
              dispatch({ type: "SHOW_FEED" });
              dispatch({ type: "HIDE_SIDEBAR" });
            }}
            style={{ outline: "none" }}
            disableTouchRipple
          >
            Feed
            {showFeed && <Widget />}
          </Button>
          <Button
            className="!justify-start !p-3"
            startIcon={<BookmarksIcon style={{ marginRight: "1rem" }} />}
            size="large"
            onClick={() => {
              if (router.pathname === "/[username]") {
                router.push("/");
              }
              dispatch({ type: "SHOW_SAVED_POSTS" });
              dispatch({ type: "HIDE_SIDEBAR" });
            }}
            style={{ outline: "none" }}
            disableTouchRipple
          >
            Saved
            {!showFeed && <Widget />}
          </Button>
        </AnimateSharedLayout>
        <Divider className="!mr-10" />
        <Button
          className="!justify-start !p-3"
          startIcon={<EditIcon style={{ marginRight: "1rem" }} />}
          size="large"
          style={{ outline: "none" }}
          onClick={() => {
            router.push("/edit_profile");
            dispatch({ type: "HIDE_SIDEBAR" });
          }}
        >
          Edit Profile
        </Button>
        <Button
          className="!justify-start !p-3"
          startIcon={<ExitToAppIcon style={{ marginRight: "1rem" }} />}
          size="large"
          onClick={() => {
            auth.signOut();
          }}
          style={{ outline: "none" }}
        >
          Logout
        </Button>
      </div>
    </Drawer>
  );
};

export default SideBar;

const Widget: FC = () => {
  const spring = {
    type: "spring",
    stiffness: 500,
    damping: 30,
    duration: 0.4,
  };

  return (
    <motion.div
      className="absolute right-0 h-6 bg-blue-600"
      style={{
        borderTopLeftRadius: "4px",
        borderBottomLeftRadius: "4px",
        width: "5px",
      }}
      layoutId="widget"
      transition={spring}
    ></motion.div>
  );
};
