# Moments

## Description

Moments is a platform where several people come Share their ideas, meet with other people, interact with other people’s ideas and get feedback of their own ideas. They can give some advice to others ideas, learn from their ideas and vice-versa. This platform helps the future entrepreneurs, managers to figure out if their ideas are really useful or it can be better, which is actually a big problem as a lot of startups fail every year because their ideas are not so useful at all! This platform will solve all these problems. The only thing that a person has to do is just create a new post, describe their ideas and post it in Moments. Other people will see the idea and react to it and vice-versa.

## Demo

https://moment-up.vercel.app

## Tech Stack

**Client:** Next, Redux, TailwindCSS, Material UI, Typescript

**Server:** Firebase

## Installation

Install moments with npm

```bash
  cd moments
  npm i

  npm run dev
```

This app will not work with this steps only. You have to setup your own firebase project (for database and authentication) and have to use web sdk of it.

First create .env file in root directory and put your web sdk config in it with key name according to written in /src/firebase.ts directory.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NEXT_PUBLIC_API_KEY` = `apiKey of firebase config your project`

`NEXT_PUBLIC_AUTH_DOMAIN` = `authDomain of firebase config your project`

`NEXT_PUBLIC_PROJECT_ID` = `projectId of firebase config your project`

`NEXT_PUBLIC_STORAGE_BUCKET` = `storageBucket of firebase config your project`

`NEXT_PUBLIC_MESSAGING_SENDER_ID` = `messagingSenderId of firebase config your project`

`NEXT_PUBLIC_APP_ID` = `appId of firebase config your project`

## Screenshots

![App Screenshot](https://user-images.githubusercontent.com/74972526/146670915-e4e3dbb6-2545-4118-9fbe-241001bd31fb.png)

![App Screenshot](https://user-images.githubusercontent.com/74972526/146670956-001503b4-0414-44ce-b3cc-2582d631d618.png)

![App Screenshot](https://user-images.githubusercontent.com/74972526/146670986-aab62b65-ceb8-4d2e-a285-50489b1951aa.png)

For more demonstration: https://drive.google.com/drive/folders/1dfoia8airN2b22MAhrpJv0Kz65OR0QMj?usp=sharing
