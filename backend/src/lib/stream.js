import {StreamChat} from "stream-chat";
import "dotenv/config"

const apiKey=process.env.STREAM_API_KEY;
const apiSecret=process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    console.error("Stream API or Secret is missing")

}
const streamClient=StreamChat.getInstance(apiKey,apiSecret);

export const upsertStreamUser=async (userData)=>{
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.log("Error in Upserting Stream User: ",error);
        
    }
};
export const generateStreamToken =(userId)=>{
    try {
        //ensure UserId is a String
        const userIdstr=userId.toString();
        return streamClient.createToken(userIdstr);
    } catch (error) {
        console.error("Error generating Stream Token: ",error)
    }
};