import { IotaObjectResponse } from "@iota/iota-sdk/client";

export type Nft = {
    id: string;
    name: string;
    imageUrl: string;
};

/* eslint-disable */
export const objResToNft = (obj: IotaObjectResponse): Nft =>
{
    const content = obj.data?.content;
    if (!content || content.dataType !== "moveObject") {
        throw new Error("Invalid object response");
    }
    const fields = content.fields as Record<string, any>;
    return {
        id: fields.id.id,
        name: fields.name,
        imageUrl: fields.image_url,
    };
};
/* eslint-enable */
