import { ChangeEvent, SyntheticEvent, useState } from "react";

const Home = () => {
  const [inputText, setInputText] = useState<string>('');
  const [responses, setResponses] = useState<string[]>([]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  }

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    if (inputText !== '') {
      setInputText('');
      
      let response: any = null;
      try {
        response = await fetch('/api/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: inputText}),
        });

        const responseData = await response.json();
        const responseText = responseData.choices[0].text;

        setResponses([...responses, responseText]);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <main>
      <h1>OpenAI custom client</h1>
      <ol>
        {
          responses.map((response, index) => (
            <li key={index}>{response}</li>
          ))
        }
      </ol>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={inputText}
          onChange={handleInputChange}
        />
        <button type="submit">Send</button>
      </form>
    </main>
  )
}

export default Home;
