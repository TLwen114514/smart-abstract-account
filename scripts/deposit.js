const hre = require("hardhat");
const ethers = require("ethers");

const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const PM_ADDRESS = "0xE29D040eED9971FcaA4a2E84e4A3AaBE66032e6a";
// 0xCFE1ba7cCeeB4703c8b50BB0247a5158481Ca6BD
// 0x5070a7c736F9078311fc7193a21Bd6a2FD9b5D9D

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