import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    if (!content) {
        throw new ApiError(400, "Tweet content is required");
    }

    const tweet = await Tweet.create({
        content,
        author: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(201, tweet, "Tweet created successfully")
    );
});


const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const tweets = await Tweet.find({ author: userId })
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, tweets, "Tweets fetched successfully")
    );
});


const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Tweet content is required");
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if (tweet.author.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized to update this tweet");
    }

    tweet.content = content;
    await tweet.save();

    return res.status(200).json(
        new ApiResponse(200, tweet, "Tweet updated successfully")
    );
});


const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if (tweet.author.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized to delete this tweet");
    }

    await tweet.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, {}, "Tweet deleted successfully")
    );
});

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
};
