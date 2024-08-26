import { Comment, CommentMap, TranscriptMessage } from '@/common/types'
import React, { useState } from 'react'
import { db } from '@/firebase'
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { ConversationDialog } from './Dialog'

interface SaveSectionProps {
  messages: TranscriptMessage[]
  setMessages: (messages: TranscriptMessage[]) => void
  commentsMap: CommentMap
  setCommentsMap: (commentsMap: CommentMap) => void
  convertCommentsMapToArray: () => void
}

const SaveSection : React.FC<SaveSectionProps> = ({messages, setMessages, commentsMap, setCommentsMap, convertCommentsMapToArray}) => {
  const [conversationId, setConversationId] = useState<string>('');
  const [conversationList, setConversationList] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState('');
  
  const handleSave = async () => {
    console.log('Saving session...');
    console.log('messages: ', messages);
    console.log('commentsMap: ', commentsMap);
    // save to firestore
    const data = {
      messages: JSON.stringify(messages),
      commentsMap: JSON.stringify(Array.from(commentsMap.entries())),
    }
    console.log('handleSave data: ', data);
    const docRef = conversationId === '' ? doc(collection(db, 'conversations')) : doc(db, 'conversations', selectedConversationId);

    const docId = await setDoc(docRef, data);
    console.log('docId: ', docId);
    console.log('docRef.id: ', docRef.id);
    setConversationId(docRef.id);
    setSelectedConversationId(docRef.id);
  }

  const loadConversationList = async () => {
    console.log('Loading session...');
    // load from firestore
    const colRef = collection(db, 'conversations');
    const conversations = await getDocs(colRef);
    
    const conversationList = conversations.docs.map((doc) => doc.id);
    console.log('conversationList: ', conversationList);
    setConversationList(conversationList);
  }
  
  const loadConversation = async (id : string) => {
    console.log('loadConvo before messages: ', messages);
    console.log('loadConvo before commentsMap: ', commentsMap);
    // load from firestore
    const docRef = doc(db, 'conversations', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('data: ', data);
      setMessages(JSON.parse(data.messages));

      commentsMap.clear();
      
      if (data.commentsMap !== undefined) {
        const parsedCommentsMap = new Map(JSON.parse(data.commentsMap));
        parsedCommentsMap.forEach((value, key) => {
          commentsMap.set(Number(key), value as Comment);
        })
        // setCommentsMap(parsedCommentsMap as CommentMap);
        console.log('loadConvo after commentsMap: ', commentsMap);
      }

      convertCommentsMapToArray();

      console.log('loadConvo after messages: ', JSON.parse(data.messages));
    }
    setConversationId(id);
  }
  
  const handleOpenDialog = () => {
    loadConversationList(); // Load conversation IDs when opening the dialog
    setIsDialogOpen(true);
  };
  
  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    setIsDialogOpen(false);
    loadConversation(id); // Load the conversation after selecting the ID
  };

  return (
    <div
      className="flex justify-center gap-4"
    >
      <div

      >
        <p>Session ID: {conversationId}</p>
      </div>
      <button onClick={handleOpenDialog} className='save-button'>Load Session</button>
      <button onClick={handleSave} className='save-button'>Save Session</button>
      <ConversationDialog
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        conversationList={conversationList} 
        onSelect={handleSelectConversation} 
      />
    </div>
  )
}

export default SaveSection