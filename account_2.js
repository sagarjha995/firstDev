const {
    Client,
    PrivateKey,
    Hbar,
    AccountCreateTransaction,
    AccountBalanceQuery,
    TransferTransaction
} = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {

    const myAccountId = process.env.OPERATOR_ID;
    const myPrivateKey = process.env.OPERATOR_PVKEY;

    if (myAccountId == null || myPrivateKey == null) {
        throw new Error("Environment varaible must have myAccountId and myPrivateKey");
    }

    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);

    const newAccountPrivateKey = PrivateKey.generateED25519();
    const newAccountPublicKey = newAccountPrivateKey.publicKey;
    // let accountList= new Array ();

    const accountList=[]

    for (let i = 0; i <5; i++) {

        const newAccountPrivateKey = PrivateKey.generateED25519();
        const newAccountPublicKey = newAccountPrivateKey.publicKey;
        
        const newAccount = await new AccountCreateTransaction()
            .setKey(newAccountPublicKey)
            .setInitialBalance(new Hbar(100))
            .execute(client);

        const getReceipt = await newAccount.getReceipt(client);
        const newAccountId = getReceipt.accountId;
        accountList.push(newAccountId);

      console.log(`Created new account number ${i+1} with ID: ${newAccountId} `);
      console.log(`Account number ${i+1} with Public key: ${newAccountPublicKey}`);
      console.log(`Account number ${i+1} with Private key: ${newAccountPrivateKey} `);
  
       
    }
    
    console.log("-------------------------------------------------------------");
    for (const newAccountId of accountList) {
        const accountBalance = await new AccountBalanceQuery()
          .setAccountId(newAccountId)
          .execute(client);
    
        console.log("Account " + newAccountId + " balance: " + accountBalance.hbars + "Hbar");
  
      }
      client.close()


}
main();

