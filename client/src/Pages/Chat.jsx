import { useContext, useEffect, useRef, useState } from "react";
// import Avatar from "../Components/Avatar";
import Logo from "../Components/Logo";
import { UserContext } from "../UserContext";
import { uniqBy } from "lodash";
import axios from "axios";
import Contact from "../Components/Contact";

export default function Chat() {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const {username,id,setId,setUsername} = useContext(UserContext);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const divUnderMessages = useRef();

  useEffect(() => {
    connectToWs();
  }, []);

  function connectToWs() {
    const ws = new WebSocket("ws://localhost:4000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        console.log("Disconnected, attempting to reconnect.");
        connectToWs();
      }, 1000);
    });
  }

  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  }

  function logout() {
    axios.post('/logout').then(()=> {
      setId(null);
      setUsername(null);
    })
  }

  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    console.log({ ev, messageData });
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      setMessages((prev) => [...prev, { ...messageData }]);
    }
  }
  function sendMessage(ev) {
    ev.preventDefault();
    ws.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessage,
      })
    );
    setNewMessage("");
    setMessages((prev) => [
      ...prev,
      {
        text: newMessage,
        sender: id,
        recipient: selectedUserId,
        _id: Date.now(),
      },
    ]);
  }
  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  useEffect(() => {
    axios.get("/people").then((res) => {
      const offlinePeopleArr = res.data
        .filter((p) => p._id !== id)
        .filter((p) => !Object.keys(onlinePeople).includes(p._id));
      const offlinePeople = {};
      offlinePeopleArr.forEach((p) => {
        offlinePeople[p._id] = p;
      });
      setOfflinePeople(offlinePeople);
    });
  }, [onlinePeople, id]);

  useEffect(() => {
    if (selectedUserId) {
      axios.get("/messages/" + selectedUserId).then((res) => {
        setMessages(res.data);
      });
    }
  }, [selectedUserId]);

  const onlineFriendsList = { ...onlinePeople };
  delete onlineFriendsList[id];

  const stopMessageDuplicates = uniqBy(messages, "_id");

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3 flex flex-col">
        <div className="flex-grow">
          <Logo />
          {/* look for online people */}
          {Object.keys(onlineFriendsList).map((userId) => (
            <Contact
              key={userId}
              id={userId}
              online={true}
              username={onlineFriendsList[userId]}
              onClick={() => setSelectedUserId(userId)}
              selected={userId === selectedUserId}
            />
          ))}
          {/* look for offline people */}
          {Object.keys(offlinePeople).map((userId) => (
            <Contact
              key={userId}
              id={userId}
              online={false}
              username={offlinePeople[userId].username}
              onClick={() => setSelectedUserId(userId)}
              selected={userId === selectedUserId}
            />
          ))}
        </div>
        <div className="p-2 text-center">
          <button
          onClick={logout} 
          className="text-sm bg-blue-100 py-1 px-2 text-gray-400 border rounded-sm"
          >
            logout
            </button>
          </div>
      </div>
      <div className=" flex flex-col bg-blue-100 w-2/3 p-2 ">
        <div className="flex-grow">
          {!selectedUserId && (
            <div className="flex h-full flex-grow items-center justify-center">
              <div className="text-gray-400">&larr; Select a conversation</div>
            </div>
          )}
        </div>
        {!!selectedUserId && (
          <div className="relative h-full ">
            <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
              {stopMessageDuplicates.map((message) => (
                <div
                  key={message._id}
                  className={message.sender === id ? "text-right" : "text-left"}
                >
                  <div
                    className={
                      "text-left inline-block p-2 my-2 rounded-md text-sm" +
                      (message.sender === id
                        ? " bg-blue-500 text-white "
                        : " bg-white text-gray-500 ")
                    }
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={divUnderMessages}> </div>
            </div>
          </div>
        )}

        {/* message */}
        {!!selectedUserId && (
          <form className="flex gap-2" onSubmit={sendMessage}>
            <input
              value={newMessage}
              onChange={(ev) => setNewMessage(ev.target.value)}
              type="text"
              placeholder="Type message here"
              className="bg-white flex-grow border rounded-sm p-2"
            />
            <button
              type="submit"
              className="bg-blue-500 p-2 text-white rounded-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
