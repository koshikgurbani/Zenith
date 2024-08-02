import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate"

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";


const replicate = new Replicate({
    auth: process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN
})

export async function POST(
    req: NextRequest
) {
    try {
        const { userId } = auth();
        console.log('userId', userId)
        const body = await req.json();
        console.log('body', body)
        const { prompt } = body;
        console.log('prompt', prompt)

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!prompt) {
            return new NextResponse("prompt is required", { status: 400 });
        }

        const freeTrial = await checkApiLimit();
        if (!freeTrial) {
            return new NextResponse("You have reached your free trial limit", { status: 403 });
        }

        const input = {
            prompt_b: prompt
        };

        const response = await replicate.run("riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05", { input });
        console.log('response', response)

        await increaseApiLimit();

        return NextResponse.json(response);

    } catch (error) {
        console.log("[MUSIC_ERROR]", error);
        return new NextResponse(`Internal error: ${error}`, { status: 500 })
    }
}