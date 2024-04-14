const hre = require("hardhat");
const fs = require('fs');


const ACCOUNT_ADDR = "0x7755d41926C884a555e7Af719CB01beF6E084Bb0";

async function main() {
    fs.writeFileSync('output02.json', '[\n');

    const account = await hre.ethers.getContractAt("Account", ACCOUNT_ADDR);
    const count = await account.count();
    console.log(count);
    writeToFile(count);

    fs.appendFileSync('output02.json', '{}\n]');
}

function writeToFile(data) {
    fs.appendFileSync('output02.json', JSON.stringify(data) + ",\n", 'utf8');
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})