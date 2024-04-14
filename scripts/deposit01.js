const hre = require("hardhat");
const ethers = require("ethers");

const EP_ADDRESS = "0x2Ad39118406105D8D555F1ED33995bdF1d3A531a";
const PM_ADDRESS = "0x21978fcE02f7e68d6095675e454FA7850a59AFf8";
// 0xCFE1ba7cCeeB4703c8b50BB0247a5158481Ca6BD

async function main() {
    const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);

    await entryPoint.depositTo(PM_ADDRESS, {
        value: hre.ethers.parseEther(".1")
    });

    console.log("deposit was successful!")

//     check();
    
//     async function check() {
//     const balance = await hre.ethers.provider.getBalance(PM_ADDRESS);
//     // Ethers返回的是BigNumber，转换为字符串并转换为ether
//     console.log(balance);
// }

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})