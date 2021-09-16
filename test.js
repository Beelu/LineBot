const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");

const textAnalyticsClient = new TextAnalyticsClient("https://12341234.cognitiveservices.azure.com/",  new AzureKeyCredential('088f06feefd842fcabc7a17bc0005c0f'));


async function sentimentAnalysis(client){

    const sentimentInput = [{
        text: "討厭啦",
        id: "0",
        language: "zh-hant"
    }];
    const sentimentResult = await client.analyzeSentiment(sentimentInput);

    console.log(sentimentResult[0].confidenceScores);
}
sentimentAnalysis(textAnalyticsClient)