import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const videoSchema = new Schema({
    videoFile: {
        type: String,
        required: true,
    },

    thumbnail: {

        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

   duration: {
        type: Number,
        required: true
    },

    views: {
        type: Number,
        required: true
    },

    isPublished: {
        type: Boolean,
        required: true
    },

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, {timestamps: true})

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)