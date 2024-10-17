import { menu, readWallets } from "../utils/common";
import { deployRuneModule, mintRuneModule } from "./rune";
import { deployInscriptionModule, mintInscriptionModule } from "./inscription";
import {projectConfig} from "../data/project.config";
import {log} from "../utils/logger";


async function runModule(wallets: string[], callback: (wallets: string[]) => Promise<void>): Promise<void> {
    const batchSize = projectConfig.batchCount;
    const batchSleep = projectConfig.batchSleep;

    const batchPromises = Array.from({ length: Math.ceil(wallets.length / batchSize) }, (_, i) => {
        const startIndex = i * batchSize;
        const endIndex = Math.min(startIndex + batchSize, wallets.length);
        const batch = wallets.slice(startIndex, endIndex);

        const sleepTime = Math.floor(Math.random() * (batchSleep[1] - batchSleep[0] + 1)) + batchSleep[0];

        return new Promise<void>(async (resolve) => {
            await new Promise(resolveTimeout => setTimeout(resolveTimeout, i * sleepTime * 1000));
            await callback(batch);
            resolve();
        });
    });

    await Promise.all(batchPromises);
}

async function index() {
    const mode = await menu();

    const wallets = readWallets("wallets.txt");

    switch (mode) {
        case "mint_inscription_unisat":
            await runModule(wallets, mintInscriptionModule);
            break;
        case "mint_rune_unisat":
            await runModule(wallets, mintRuneModule);
            break;
        case "deploy_inscription_unisat":
            await runModule(wallets, deployInscriptionModule);
            break;
        case "deploy_rune_unisat":
            await runModule(wallets, deployRuneModule);
            break;
        case "exit":
            log("info", "\n🤑 Donate me: \nEVM: 0x00000b0ddce0bfda4531542ad1f2f5fad7b9cde9\nBTC: bc1p0mhv0d3ywqja49gnzhusxmxxkzhn4zhew6k6z4rn0gjcytluhkhq3uhq5z");
            process.exit(1);
    }

    log("info", "\n🤑 Donate me: \nEVM: 0x00000b0ddce0bfda4531542ad1f2f5fad7b9cde9\nBTC: bc1p0mhv0d3ywqja49gnzhusxmxxkzhn4zhew6k6z4rn0gjcytluhkhq3uhq5z");
}

if (require.main === module) {
    index().catch(err => {
        console.error("Error:", err);
        process.exit(1);
    });
}
