const{
    TopicCreateTransaction,
    Client,
    PrivateKey,
    TopicMessageQuery,
    TopicMessageSubmitTransaction
}=require("@hashgraph/sdk");
require("dotenv").config();

const firstAccount=process.env.FIRST_ACCOUNT;
const firstPrivateKey=PrivateKey.fromString(process.env.FIRST_PRIVATE_KEY);

if(firstAccount==null || firstPrivateKey==null ){
    throw new Error("Environment variables myAccountId and myPrivateKey must be present")
}
const client =Client.forTestnet();
client.setOperator(firstAccount,firstPrivateKey);

async function main(){

    const createTopic= await new TopicCreateTransaction()
    .execute(client);

    let receiptTopic= await createTopic.getReceipt(client)
       let topicId=receiptTopic.topicId;

       console.log(`The topic Id : ${topicId}`);

    await new Promise((resolve)=>setTimeout(resolve,50000));

    new TopicMessageQuery()
    .setTopicId(topicId)
    .setStartTime(0)
    .subscribe(
        client,
        (message)=>console.log(Buffer.from(message.contents,"utf8").toString())
    );

    let sendResponse=await new TopicMessageSubmitTransaction({
        topicId:topicId,
        message:"While writing the msg,the time was 11:57"
    }).execute(client);

    let responseReceipt=await sendResponse.getReceipt(client);

     const responseStatus=responseReceipt.status;

     console.log("The message transaction status :" ,responseStatus.toString());

     process.exit();

}

main();
