import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleLike = async ({ userId, likeableId, likeableType }) => {
    const existingLike = await Like.findOne({
        user: userId,
        likeableId,
        likeableType
    });

    if (existingLike) {
        await existingLike.deleteOne();
        return { status: "removed" };
    } else {
        await Like.create({
            user: userId,
            likeableId,
            likeableType
        });
        return { status: "added" };
    }
};

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");

    const result = await toggleLike({
        userId: req.user._id,
        likeableId: videoId,
        likeableType: "Video"
    });

    return res.status(200).json(
        new ApiResponse(200, { videoId, ...result }, `Video like ${result.status}`)
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    if (!isValidObjectId(commentId)) throw new ApiError(400, "Invalid comment ID");

    const result = await toggleLike({
        userId: req.user._id,
        likeableId: commentId,
        likeableType: "Comment"
    });

    return res.status(200).json(
        new ApiResponse(200, { commentId, ...result }, `Comment like ${result.status}`)
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    if (!isValidObjectId(tweetId)) throw new ApiError(400, "Invalid tweet ID");

    const result = await toggleLike({
        userId: req.user._id,
        likeableId: tweetId,
        likeableType: "Tweet"
    });

    return res.status(200).json(
        new ApiResponse(200, { tweetId, ...result }, `Tweet like ${result.status}`)
    );
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const likes = await Like.find({
        user: req.user._id,
        likeableType: "Video"
    }).populate("likeableId");

    return res.status(200).json(
        new ApiResponse(200, likes, "Liked videos fetched successfully")
    );
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
};
