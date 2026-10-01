import {BootLoading} from "./components/BootLoadng"

export default async function Home(){
  await new Promise((r) => setTimeout(r, 3000));
  return(
    <BootLoading/>
  );

}