
import { ChangeEvent, SyntheticEvent, useState } from "react";
import Image from 'next/image';
import { AxiosResponse } from "axios";
import { ChatCompletionRequestMessage, Configuration, CreateChatCompletionResponse, OpenAIApi } from "openai";
import styles from './index.module.css';
import useCookies from "@/hooks/useCookies";
import Message from "@/components/Message";

const Home = () => {
  const [inputText, setInputText] = useState<string>('');
  const [conversation, setConversation] = useState<ChatCompletionRequestMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [secretKey, setSecretKey] = useCookies<string>("secretKey", "");
  const [orgId, setOrgId] = useCookies<string>("orgId", "");
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  const closeSettings = (event: SyntheticEvent) => {
    event.preventDefault();
    setSettingsOpen(false);
  }

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  }

  const handleAddMessageSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    if (inputText !== '') {
      
      const newMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: inputText
      }
      setConversation([...conversation, newMessage]);
      setInputText('');
    }
  }

  const handleRequestMessage = async (event: SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);

    if (conversation.length > 0) {
        
      const configuration = new Configuration({
        organization: orgId,
        apiKey: secretKey,
      });

      const openai = new OpenAIApi(configuration);

      let response;
      try {
        response = (await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: conversation,
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

        setConversation([...conversation, newMessage]);
      }
      else {
        console.log('No response from OpenAI');
      }
      
    }
    setLoading(false);
  }

  const deleteMessage = (index: number) => {
    console.log("hello" + index)
    if (index >= 0 && index < conversation.length) {
      const updatedConvo = [...conversation];
      updatedConvo.splice(index, 1);
      setConversation(updatedConvo);
    }
  }

  return (
    <main className={styles.pageContent}>
      

      <div className={styles.header}>
        <h1>OpenAI Client</h1>
        <button onClick={() => setSettingsOpen(true)} style={{width: "80px"}}>Settings</button>
      </div>
      
      { settingsOpen &&
        <div className={styles.conversationWrapper}>
          <div className={styles.settings}>
            <h2>Settings</h2>
            <p>You can generate a secret key by signing up for an account at <a href="https://platform.openai.com/" target="_blank">OpenAI</a> and adding a payment method. These values are only stored in your local cookies.</p>
            <form onSubmit={closeSettings}>
              <label>Secret Key</label>
              <input type="text" value={secretKey} onChange={(event) => setSecretKey(event.target.value)}></input>
              <label>Organization ID</label>
              <input type="text" value={orgId} onChange={(event) => setOrgId(event.target.value)}></input>
              <button type="submit">Close</button>
            </form>
          </div>
        </div>
      }

      { !settingsOpen &&
        <div className={styles.conversationWrapper}>
          <div className={styles.conversation}>
            {
              conversation.map((message, index) => (
                <Message index={index} message={message} deleteMessage={deleteMessage} />
              ))
            }
          </div>
          <div className={styles.formWrapper}>
            <form onSubmit={handleAddMessageSubmit}>
              <textarea
                name="name"
                value={inputText}
                onChange={handleInputChange}
              />
                
                
                <div className={styles.buttonArea}>
                  {loading ?
                    <>
                      <button className={`${styles.submitButton} ${styles.disabled}`} disabled>Add</button>
                      <div className={`${styles.submitButton} ${styles.request} button`}>
                        <Image src={require('../images/throbber.gif')} alt="loading" />
                      </div>
                    </>
                    :
                    <>
                      <button type="submit" className={styles.submitButton}>Add</button>
                      <button className={`${styles.submitButton} ${styles.request}`} onClick={handleRequestMessage}>Request</button>
                    </>
                  }
                </div>
            </form>
          </div>
        </div>
      }
      
    </main>
  )
}

export default Home;
