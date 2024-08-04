import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate"
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";


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
        const isPro = await checkSubscription();
        if (!freeTrial && !isPro) {
            return new NextResponse("You have reached your free trial limit", { status: 403 });
        }

        const input = {
            prompt
        };

        const response = await replicate.run("anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351", { input });
        console.log('response', response)

        if (!isPro) {
            await increaseApiLimit();
        }

        return NextResponse.json(response);

    } catch (error) {
        console.log("[VIDEO_ERROR]", error);
        return new NextResponse(`Internal error: ${error}`, { status: 500 })
    }
}