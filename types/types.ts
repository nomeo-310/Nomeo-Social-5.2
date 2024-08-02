
type imageProps = {
  public_id: string, 
  secure_url: string
}

export type userProps = {
  _id: string
  name: string
  email: string
  username: string
  displayName: string
  hashedPassword: string
  bio: string
  city: string
  state: string
  image: string
  website: string
  occupation: string
  profileImage: imageProps
  country: string,
  posts: string[],
  followers: string[],
  following: string[],
  likes: string[],
  comments: string[],
  notifications: string[],
  bookmarks : string[],
  createdAt: string
  updatedAt: string
};

export type postProps = {
  _id: string
  content: string
  author: {
    username: string
    displayName: string
    image: string
    _id: string
    followers: string[]
    following: string[]
  }
  images: string[],
  likes: string[],
  bookmarks: string[],
  hideNotification: boolean,
  isBarred: boolean,
  hidePost: boolean,
  postReported: boolean,
  totalReports: number,
  comments: string[],
  createdAt: string
  updatedAt: string
}

export type suggestedUserProps = {
  followers: string[]
  username: string
  displayName: string
  image: string
  _id: string
};

export type followUserInfoProps = {
  followers: number
  isFollowedBy: boolean
};