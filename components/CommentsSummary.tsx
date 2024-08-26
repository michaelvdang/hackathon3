import { Comment } from '@/common/types'
import React from 'react'
import conversation from '../conversation.json';

interface CommentsSummaryProps {
  content: JSX.Element[]
  comments: Comment[]
}

const CommentsSummary : React.FC<CommentsSummaryProps> = ({content, comments}) => {

  const [output, setOutput] = React.useState<string>('');
  const textComments = comments.filter((comment) => comment.type !== 'file');

  const onSubmit = async () => {
    setOutput('');
    // console.log(JSON.stringify({'comments': comments, 'content': content}));
    fetch('/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'comments': textComments, 'content': conversation.messages}),
    }).then((res) => res.body)
    .then(async (body: any) => {
      const reader = body.getReader()
      const decoder = new TextDecoder()

      let result = ''
      return reader.read().then(
        function processText({ done, value }: any) {
          if (done) {
            return result
          }
          const text = decoder.decode(value || new Uint8Array(), { stream: true })
          setOutput((messages) => {
            return messages + text
            // let lastMessage = messages[messages.length - 1]
            // let otherMessages = messages.slice(0, messages.length - 1)
            // return [
            //   ...otherMessages, 
            //   { 'role': lastMessage.role, 'content': lastMessage.content + text }
            // ]
          })
        return reader.read().then(processText)
      })
    })
  }
  
  return (
    <div>
      <h2 className="section-title">Comments Summary</h2>
      {/* {comments.map((comment, index) => (
        <p key={index}>{comment.content}</p>
      ))}
       */}
      <div
        className='summary-text'
      >
        {output}
        {/* {comments.map((comment, index) => (
          <p key={index}>{comment.content}</p>
        ))}  */}
      </div>
      <div
        className="flex justify-center"
      >
        <button onClick={onSubmit} className='button-primary'>
          Get Summary
        </button>
      </div>
    </div>
  )
}

export default CommentsSummary