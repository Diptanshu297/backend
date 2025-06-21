import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const totalVideos = await Video.countDocuments({ owner: channelId });
    const totalSubscribers = await Subscription.countDocuments({ channel: channelId });
    const totalViews = await Video.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(channelId) } },
        { $group: { _id: null, views: { $sum: "$views" } } }
    ]);
    const totalLikes = await Like.countDocuments({ videoOwner: channelId });

    const stats = {
        totalVideos,
        totalSubscribers,
        totalViews: totalViews[0]?.views || 0,
        totalLikes
    };

    return res.status(200).json(
        new ApiResponse(200, stats, "Channel stats retrieved successfully")
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const videos = await Video.find({ owner: channelId }).sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, videos, "Channel videos retrieved successfully")
    );
});

export {
    getChannelStats,
    getChannelVideos
};
