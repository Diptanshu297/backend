import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const channelId = req.params.channelId;

    const totalVideos = await Video.countDocuments({ owner: channelId });
    const totalSubscribers = await Subscription.countDocuments({ channel: channelId });

    const videos = await Video.find({ owner: channelId }).select("_id views");
    const totalViews = videos.reduce((acc, video) => acc + (video.views || 0), 0);

    const videoIds = videos.map(v => v._id);
    const totalLikes = await Like.countDocuments({ video: { $in: videoIds }, like: true });

    return res.status(200).json(
        new ApiResponse(200, {
            totalVideos,
            totalSubscribers,
            totalViews,
            totalLikes
        }, "Channel statistics fetched successfully")
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const channelId = req.params.channelId;

    const videos = await Video.find({ owner: channelId }).sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, videos, "Channel videos fetched successfully")
    );
});

export {
    getChannelStats, 
    getChannelVideos
};
