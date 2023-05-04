import { ChangeEvent, SyntheticEvent, useState } from "react";
import Image from 'next/image';
import { AxiosResponse } from "axios";
import { ChatCompletionRequestMessage, Configuration, CreateChatCompletionResponse, OpenAIApi } from "openai";
import styles from './index.module.css';

const organization = process.env.NEXT_PUBLIC_OPEN_AI_ORG;
const apiKey = process.env.NEXT_PUBLIC_OPEN_AI_API_KEY;


const Home = () => {
  const [inputText, setInputText] = useState<string>('');
  const [conversation, setConversation] = useState<ChatCompletionRequestMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
      setConversation(updatedConversation);
      setInputText('');

      
      const configuration = new Configuration({
        organization: organization,
        apiKey: apiKey,
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
      }
      else {
        console.log('No response from OpenAI');
      }
      
    }
    setLoading(false);
  }

  return (
    <main className={styles.pageContent}>
      <h1>OpenAI Client</h1>
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
            {loading ?
            <div className={styles.submitButton}>
              <Image src={require('../images/throbber.gif')} alt="loading" />
            </div>
            :
            <button type="submit" className={styles.submitButton}>Send</button>}
          </form>
        </div>
      </div>
    </main>
  )
}

export default Home;
