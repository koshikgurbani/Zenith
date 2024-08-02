import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { increaseApiLimit,checkApiLimit } from "@/lib/api-limit";

import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai =  new OpenAI({
    apiKey:process.env.NEXT_PUBLIC_OPENAI_API_KEY
})

const instructionMessage: ChatCompletionMessageParam = {
    role:"system",
    content: "Act as a code-generating AI. Respond with markdown code snippets also. Use code comments for explanations. Also provide a brief explaination and some google articles references to follow-up"
}

export async function POST(
    req: NextRequest
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }


        if (!messages) {
            return new NextResponse("Messages are required", { status: 400 });
        }

        const freeTrial = await checkApiLimit();
        if (!freeTrial) {
            return new NextResponse("You have reached your free trial limit", { status: 403 });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [instructionMessage, ...messages]
        })

        await increaseApiLimit();

        return NextResponse.json(response.choices[0].message);

    } catch (error) {
        console.log("[CODE_ERROR]", error);
        return new NextResponse(`Internal error: ${error}`, { status: 500 })
    }
}