const hre = require("hardhat");

const ACCOUNT_ADDR = "0x49746D61a13Edd77d562bd950D5bDBd273C922a1";

async function main() {
    const account = await hre.ethers.getContractAt("Account", ACCOUNT_ADDR);
    const count = await account.count();
    console.log(count);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})