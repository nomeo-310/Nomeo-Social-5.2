
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


export type sessionUserProps = {
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
    _id: string
    username: string
    displayName: string
    image: string
    followers: string[]
    following: string[]
    bio: string
    city: string
    state: string
    country: string
    occupation: string
  }
  attachments: [
    { _id: string
      url: string
      type: string
    }
  ],
  likes: string[],
  bookmarks: string[],
  hideNotification: boolean,
  isBarred: boolean,
  hidePost: boolean,
  postReported: boolean,
  totalReports: number,
  comments: [
    {
      _id: string
      author: {
        _id: string
        username: string
        displayName: string
        image: string
        followers: string[]
        following: string[]
      },
      content: string
      createdAt: string
      updatedAt: string
    }
  ],
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

export type likeUserInfoProps = {
  likes: number
  isLikedByUser: boolean
};

export type bookmarkInfoProps = {
  isBookmarkedByUser: boolean
};

export type notificationStatusProps = {
  notificationStatus: boolean
};

export type visibilityStatusProps = {
  visibilityStatus: boolean
};

export type commentProps = {
  _id: string
  content: string
  author: {
    _id: string
    displayName: string
    username: string
    image: string
    followers: string[]
    following: string[]
  }
  post: string
  createdAt: string
};

export type notificationProps = {
  _id: string
  issuer: {
    displayName: string
    username: string
    image: string
  }
  post?: {
    _id: string
    content: string
  }
  comment: string
  type: string
  read: boolean
};

export type notificationCountProps = {
  unreadCounts: number
};

export type mediaProps = {
  _id: string
  url: string
  type: string
  post: {
    _id: string
    content: string
    createdAt: string
  }
}

