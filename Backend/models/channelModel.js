import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    channelName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    channelPic: {
      type: String,
    },
    channelBanner: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscribers: {
      type: Number,
      default: 0,
    },
    subscribedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  { timestamps: true }
);

const ChannelModel = mongoose.model("Channel", channelSchema);
export default ChannelModel;
