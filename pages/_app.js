import "@/styles/globals.css";
import { Socketprovider } from "@/context/socket";

export default function App({ Component, pageProps }) {
  /*
  
    So whenever this component will be mounted, the provider will run, inside that the useeffect will run which will be establishing the connection and we will get the value of the socket.
  
  */
  return (
    <Socketprovider>
      <Component {...pageProps} />
    </Socketprovider>
  );
}
