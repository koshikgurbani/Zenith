import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
// import { Configuration, OpenAIApi } from "openai"

import OpenAI from "openai";

/* const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration) */

const openai =  new OpenAI({
    apiKey:process.env.NEXT_PUBLIC_OPENAI_API_KEY
})

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

        /* if (!configuration.apiKey) {
            return new NextResponse("OpenAI API key not configured", { status: 500 });
        } */

        if (!messages) {
            return new NextResponse("Messages are required", { status: 400 });
        }
        /* const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages
        }); */
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages
        })

        // return NextResponse.json(response.data.choices[0].message);
        return NextResponse.json(response.choices[0].message);

    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse(`Internal error: ${error}`, { status: 500 })
    }
}