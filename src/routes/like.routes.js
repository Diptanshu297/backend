import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// Toggle like on a video
const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const existingLike = await Like.findOne({
        user: req.user._id,
        video: videoId
    });

    if (existingLike) {
        await existingLike.deleteOne();
        return res.status(200).json(new ApiResponse(200, {}, "Like removed from video"));
    }

    await Like.create({
        user: req.user._id,
        video: videoId,
        like: true
    });

    return res.status(201).json(new ApiResponse(201, {}, "Video liked successfully"));
});

// Toggle like on a comment
const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const existingLike = await Like.findOne({
        user: req.user._id,
        comment: commentId
    });

    if (existingLike) {
        await existingLike.deleteOne();
        return res.status(200).json(new ApiResponse(200, {}, "Like removed from comment"));
    }

    await Like.create({
        user: req.user._id,
        comment: commentId,
        like: true
    });

    return res.status(201).json(new ApiResponse(201, {}, "Comment liked successfully"));
});

// Toggle like on a tweet
const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const existingLike = await Like.findOne({
        user: req.user._id,
        tweet: tweetId
    });

    if (existingLike) {
        await existingLike.deleteOne();
        return res.status(200).json(new ApiResponse(200, {}, "Like removed from tweet"));
    }

    await Like.create({
        user: req.user._id,
        tweet: tweetId,
        like: true
    });

    return res.status(201).json(new ApiResponse(201, {}, "Tweet liked successfully"));
});


const getLikedVideos = asyncHandler(async (req, res) => {
    const likes = await Like.find({ user: req.user._id, video: { $exists: true } })
        .populate("video")
        .sort({ createdAt: -1 });

    const likedVideos = likes.map(like => like.video);

    return res.status(200).json(
        new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    );
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
};
