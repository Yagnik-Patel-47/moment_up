import { CircularProgress } from "@material-ui/core";
import Image from "next/image";
import { FC } from "react";

const Loading: FC = () => {
  return (
    <div className="grid place-items-center h-full p-4">
      <div className="p-4 sm:px-4 h-3/4 justify-evenly flex w-full flex-col items-center md:w-1/2">
        <Image
          src="/moments.png"
          quality={100}
          alt="logo"
          width={200}
          height={200}
        />
        <CircularProgress size={50} />
      </div>
    </div>
  );
};

export default Loading;
