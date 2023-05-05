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
  const [hoveringBin, setHoveringBin] = useState<Boolean>(false);

  const getStyle = () => {
    if (hoveringBin) return {color: "red"};
  }

  return (
    <div 
      key={props.index}
      className={`${styles.message} ${props.message.role === 'user' ? styles.user : styles.assistant}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={getStyle()}
    >
      
      {hovering ?
        <div
          className={styles.bin}
          onMouseEnter={() => setHoveringBin(true)}
          onMouseLeave={() => setHoveringBin(false)}
        >
          <FontAwesomeIcon
            icon={faTrash}
            onClick={() => props.deleteMessage(props.index)}
          />
        </div>
        :
        <div className={styles.bin}>{props.index + 1}</div>
      }

      <div className={styles.role}>{props.message.role === 'user' ? 'You' : 'AI'}</div>
      <div>{props.message.content}</div>
    </div>
  )
}

export default Message;
