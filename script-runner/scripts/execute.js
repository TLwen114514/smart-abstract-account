const hre = require("hardhat");
const EventEmitter = require("events");
class CheckTrans extends EventEmitter {};
const checkTrans = new CheckTrans();
const fs = require('fs');


const FACTORY_ADDRESS = "0xAD42fA4a9e3Db20402e236ea0fdEE54c2051f588";
const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const PM_ADDRESS = "0xE29D040eED9971FcaA4a2E84e4A3AaBE66032e6a";
// 0x5070a7c736F9078311fc7193a21Bd6a2FD9b5D9D

async function main() {
    fs.writeFileSync('output.json', '[\n'); 
    const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);

    const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
    const [signer0, signer1] = await hre.ethers.getSigners();
    const address0 = await signer0.getAddress();
    let initCode =
        FACTORY_ADDRESS +
        AccountFactory.interface
        .encodeFunctionData("createAccount", [address0])
        .slice(2);

    function writeToFile(data) {
    fs.appendFileSync('output.json', JSON.stringify(data) + ",\n", 'utf8');
    }


    let sender;
    try {
        await entryPoint.getSenderAddress(initCode);
    } catch (ex) {
        sender = "0x" + ex.data.slice(-40);
    }

    const code = await hre.ethers.provider.getCode(sender);
    if (code !== "0x") {
        initCode = "0x";
    }

    console.log({ sender });

    const Account = await hre.ethers.getContractFactory("Account");
    const userOp = {
        sender, // smart account address
        nonce: "0x" + (await entryPoint.getNonce(sender, 0)).toString(16),
        initCode,
        callData: Account.interface.encodeFunctionData("execute"),
        paymasterAndData: PM_ADDRESS,
        signature:
        "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
    };

    const { preVerificationGas, verificationGasLimit, callGasLimit } =
        await hre.ethers.provider.send("eth_estimateUserOperationGas", [
        userOp,
        EP_ADDRESS,
        ]);

    userOp.preVerificationGas = preVerificationGas;
    userOp.verificationGasLimit = verificationGasLimit;
    userOp.callGasLimit = callGasLimit;

    const { maxFeePerGas } = await hre.ethers.provider.getFeeData();
    userOp.maxFeePerGas = "0x" + maxFeePerGas.toString(16);

    const maxPriorityFeePerGas = await hre.ethers.provider.send(
        "rundler_maxPriorityFeePerGas"
    );
    userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;

    const userOpHash = await entryPoint.getUserOpHash(userOp);
    userOp.signature = await signer0.signMessage(hre.ethers.getBytes(userOpHash));

    console.log(userOp)

    const opHash = await hre.ethers.provider.send("eth_sendUserOperation", [
        userOp,
        EP_ADDRESS,
    ]);

    // entryPoint.on('UserOperationExecuted', (userOpHash, success, reason, event) => {
    //     console.log(`UserOperation with hash ${userOpHash} was executed. Success: ${success}, Reason: ${reason}`);
    //     // 在这里，你可以进一步处理事件
    // });

    console.log(userOpHash)

    const waitSomeSeconds = (number) => {
    let num = number.toString() + '000';
    num = Number(num);
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
        resolve('');
        }, num);
    });
    };


    try {
        await waitSomeSeconds (30);
        const response = await hre.ethers.provider.send(
            "eth_getUserOperationByHash",
            [opHash]
            );
            
        console.log(response);
        console.log(response.transactionHash);
            writeToFile(response);

    } catch (ex) {
        console.log(ex);
    }

    writeToFile({ sender });
    writeToFile(userOp);

    fs.appendFileSync('output.json', '{}\n]');

    // await waitSomeSeconds (5);


    // const response = await hre.ethers.provider.send(
    // "eth_getUserOperationByHash",
    // [opHash]
    // );

    // console.log(response);

    // const { transactionHash } = await hre.ethers.provider.send(
    // "eth_getUserOperationByHash",
    // [opHash]
    // );

    // console.log(response.transactionHash);


}

// async function txhashCheck() {
//     try {
//         await waitSomeSeconds(100);
//         const response = await hre.ethers.provider.send("eth_getUserOperationByHash", [opHash]);
        
//         console.log(response);
//         console.log(response.transactionHash);
        
//         // 发射一个事件
//         checkTrans.emit('operationCompleted', response);
//     } catch (ex) {
//         console.log(ex);
//     }
// }

// module.exports = { checkTrans, txhashCheck };

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});