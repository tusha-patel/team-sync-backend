import mongoose, { Document } from "mongoose";
import { Schema } from "mongoose";
import { accountProviderEnumType, providerEnum } from "../enums/account-provider.enum";

export interface AccountDocument extends Document {
    provider: accountProviderEnumType;
    providerId: string;
    userId: mongoose.Types.ObjectId;
    refreshToken: string | null;
    tokenExpiry: Date | null;
    createdAt: Date;
}


const AccountSchema = new Schema<AccountDocument>({
    provider: {
        type: String,
        enum: Object.values(providerEnum),
        required: true
    },
    providerId: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    refreshToken: {
        type: String,
        default: null
    },
    tokenExpiry: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            delete ret.refreshToken;
        }
    }
});


const AccountModel = mongoose.model<AccountDocument>("Account", AccountSchema);

export default AccountModel;


