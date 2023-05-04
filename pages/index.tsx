import { ChangeEvent, SyntheticEvent, useState } from "react";
import Image from 'next/image';
import { AxiosResponse } from "axios";
import { ChatCompletionRequestMessage, Configuration, CreateChatCompletionResponse, OpenAIApi } from "openai";
import styles from './index.module.css';

const Home = () => {
  const [inputText, setInputText] = useState<string>('');
  const [conversation, setConversation] = useState<ChatCompletionRequestMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [secretKey, setSecretKey] = useState<string>("");
  const [orgId, setOrgId] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const setCredentials = (event: SyntheticEvent) => {
    event.preventDefault();
    setDialogOpen(false);
  }

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  }

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);

    if (inputText !== '') {
      
      const newMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: inputText
      }
      const updatedConversation = [...conversation, newMessage];
      
      const configuration = new Configuration({
        organization: orgId,
        apiKey: secretKey,
      });

      const openai = new OpenAIApi(configuration);

      let response;
      try {
        response = (await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: updatedConversation,
        })) as AxiosResponse<CreateChatCompletionResponse>;
      } catch (error) {
        console.log(error);
      }

      const choices = response?.data?.choices;

      if (choices && choices.length > 0 && choices[0].message?.content){

        const newMessage: ChatCompletionRequestMessage = {
          role: "assistant",
          content: choices[0].message?.content
        }
        setConversation([...updatedConversation, newMessage]);
        setInputText('');
      }
      else {
        console.log('No response from OpenAI');
      }
      
    }
    setLoading(false);
  }

  return (
    <main className={styles.pageContent}>
      
      <dialog open={dialogOpen} className={styles.dialog}>
        <form onSubmit={setCredentials}>
          <label>Secret Key</label>
          <input type="text" value={secretKey} onChange={(event) => setSecretKey(event.target.value)}></input>
          <label>Organization ID</label>
          <input type="text" value={orgId} onChange={(event) => setOrgId(event.target.value)}></input>
          <button type="submit">Save and close</button>
        </form>
      </dialog>

      <div className={styles.header}>
        <h1>OpenAI Client</h1>
        <button onClick={() => setDialogOpen(true)}>Set credentials</button>
      </div>

      <div className={styles.conversationWrapper}>
        <div className={styles.conversation}>
          {
            conversation.map((message, index) => (
              <div key={index} className={`${styles.message} ${message.role === 'user' ? styles.user : styles.assistant}`}>
                <div className={styles.role}>{message.role === 'user' ? 'You' : 'OpenAI'}</div>
                <div>{message.content}</div>
              </div>
            ))
          }
        </div>
        <div className={styles.formWrapper}>
          <form onSubmit={handleSubmit}>
            <textarea
              name="name"
              value={inputText}
              onChange={handleInputChange}
            />
            {!dialogOpen ?
              <>
                {loading ?
                  <div className={`${styles.submitButton} button`}>
                    <Image src={require('../images/throbber.gif')} alt="loading" />
                  </div>
                  :
                  <button type="submit" className={styles.submitButton}>Send</button>
                }
              </>
              :
              <>
                <div className={`${styles.submitButton} button`}>...</div>
              </>
            }
          </form>
        </div>
      </div>
      
    </main>
  )
}

export default Home;
