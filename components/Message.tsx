import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from './Message.module.css';
import { ChatCompletionRequestMessage } from 'openai';

interface MessageProps {
  index: number;
  message: ChatCompletionRequestMessage;
  deleteMessage: (index: number) => void;
}

const Message = (props: MessageProps) => {
  const [hovering, setHovering] = useState<Boolean>(false);

  return (
    <div 
      key={props.index}
      className={`${styles.message} ${props.message.role === 'user' ? styles.user : styles.assistant}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      
      {hovering ?
      <FontAwesomeIcon icon={faTrash} className={styles.bin} onClick={() => props.deleteMessage(props.index)} /> : <div className={styles.bin}></div>}

      <div className={styles.role}>{props.message.role === 'user' ? 'You' : 'OpenAI'}</div>
      <div>{props.message.content}</div>
    </div>
  )
}

export default Message;
