import RegisterAndLogin from "./Pages/RegisterAndLogin";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import Chat from "./Pages/Chat.jsx";

export default function Routes() {
    const {username, id} = useContext(UserContext);
    if (username) {
        return <Chat/>
    }
    return (
        <RegisterAndLogin />
    ) ;
}