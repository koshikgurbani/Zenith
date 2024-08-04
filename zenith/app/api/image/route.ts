import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
// import { Configuration, OpenAIApi } from "openai"

import OpenAI from "openai";
import { checkSubscription } from "@/lib/subscription";

/* const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration) */

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
})

export async function POST(
    req: NextRequest
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { prompt, amount = 1, resolution = "512x512" } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        /* if (!configuration.apiKey) {
            return new NextResponse("OpenAI API key not configured", { status: 500 });
        } */

        if (!prompt) {
            return new NextResponse("Prompt is required", { status: 400 });
        }
        if (!amount) {
            return new NextResponse("Amount is required", { status: 400 });
        }
        if (!resolution) {
            return new NextResponse("Resolution is required", { status: 400 });
        }

        const freeTrial = await checkApiLimit();
        const isPro = await checkSubscription();
        if (!freeTrial && !isPro) {
            return new NextResponse("You have reached your free trial limit", { status: 403 });
        }

        const response = await openai.images.generate({
            model: "dall-e-2",
            prompt,
            n: parseInt(amount, 10),
            size: resolution,
        })
        if (!isPro) {
            await increaseApiLimit();
        }

        return NextResponse.json(response.data);

    } catch (error) {
        console.log("[IMAGE_ERROR]", error);
        return new NextResponse(`Internal error: ${error}`, { status: 500 })
    }
}