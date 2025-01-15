import { useEffect } from "react";
import { ChatInfo } from "../../types/chat";

interface HomeProps {
    chatInfos: ChatInfo[];
}


const App = (homeProps: HomeProps) => {

    const { chatInfos } = homeProps;

    useEffect(() => {
        if (chatInfos) {
            console.log(chatInfos)
        }
    }, [chatInfos])


    return (
        <div>
            <h1>Home</h1>
            <p>Home page content goes here</p>
            {/* Add more components and content as needed */}
        </div>
    );
}

export default App;