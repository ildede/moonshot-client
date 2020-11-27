import React, {useState} from "react";
import {httpServer} from "../../../environment";

export const MessageSender = (props: { place: string, gameId?: string }) => {
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const messageChange = (event: any) => {
    setMessage(event.target.value);
  }

  const sendMessage = () => {
    if (message) {
      setIsSubmitting(true);
      const xhr = new XMLHttpRequest();
      xhr.addEventListener('load', () => {
        setIsSubmitting(false);
      });
      xhr.open('POST', httpServer + '/games/message');
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.send(JSON.stringify({game: props.gameId, location: props.place, message: message}));
    }
  }

  return (
    <>
      <input
        type="text" autoComplete="off"
        placeholder="Type a message..."
        value={message}
        onChange={messageChange}
      />
      <button disabled={isSubmitting} onClick={sendMessage}>
        {isSubmitting ? ("Wait...") : ("Send")}
      </button>
    </>
  )
}