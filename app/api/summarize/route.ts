import OpenAI from "openai"
import { NextResponse } from "next/server"

const systemPrompt = 'you are a helpful assistant that summarizes the transcript between a salesperson and customer along with comments made on the transcript, the comments object has a divIndex field which roughly corresponds to the index of the messages on the content array';

export async function GET() {
  return NextResponse.json({
    message: 'Hello, World!',})
}

export async function POST(request: Request) {
  const data = await request.json()
  console.log("data.comments: ", data.comments)
  const comments = data.comments.filter((comment: any) => comment.content !== 'file upload')
  console.log('comments: ', comments)

  // return NextResponse.json('server', data)

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const completion = await openai.chat.completions.create( { // different way to do it
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: JSON.stringify({'comments': comments, 'content': data.content}) },
    ],
    stream: true,
  })
  
  let stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()

      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content
          if (content) {
            const text = encoder.encode(content) 
            controller.enqueue(text)
          }
        }
      }
      catch (error) {
        controller.error(error)
      }
      finally {
        controller.close()
      }
    }
  })
  
  return new NextResponse(stream)
}