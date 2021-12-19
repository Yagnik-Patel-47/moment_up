import { Avatar, Typography } from "@material-ui/core";
import { useState } from "react";
import { db } from "../firebase";

interface Props {
  user: string;
  content: string;
}

const Comment = ({ user, content }: Props) => {
  const [userData, setUserData] = useState({
    photo: "",
    username: "",
  });
  db.collection("users")
    .doc(user)
    .get()
    .then((doc) => {
      if (doc.exists) {
        setUserData({
          username: doc.data().userName,
          photo: doc.data().photo,
        });
      }
    });
  return (
    <div className="md:ml-6 ml-3 space-y-3 bg-[#f3f3f3] p-4 rounded-md">
      <div className="flex space-x-3 items-center">
        {userData.photo ? (
          <Avatar src={userData.photo} alt="profile image" />
        ) : (
          <Avatar>{userData.username[0]?.toUpperCase()}</Avatar>
        )}
        <Typography>
          <span className="font-medium text-gray-800">{userData.username}</span>
        </Typography>
      </div>
      <Typography paragraph>{content}</Typography>
    </div>
  );
};

export default Comment;
