import { createClient } from "@supabase/supabase-js";
import toast from "react-hot-toast";

const url="https://xccaovxtbcyfsevy.supabase.co"
const key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZ6InhjYndxcmNhb3Z4dGJjeWZzZXZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNjEzMTYsImV4cCI6MjA3MzgzNzMxNn0.DvcekCOO8YhmjSngMb4MMGjZp-o2a2qvKAmqBW3hSSg"

const supabase = createClient(url,key)

  
  
  
  export default function uploadfile(file){

    const promise = new Promise(

        (reslove, reject)=>{

            if(file==null){
                reject("Please select a file to upload");
            }

             const timeStamp = new Date().getTime();
             const fileName = timeStamp+"-"+file.name;

             supabase.storage.from("course").upload(fileName,file,{
                cacheControl: "3600",
                upsert: false
             }).then(
                ()=>{
                    const publicUrl = supabase.storage.from("course").getPublicUrl(fileName).data.publicUrl;
                    
                    reslove(publicUrl)
                }
             ).catch(
                ()=>{
                    
                    reject("Faild to upload file");
                }

             )

              

        }
    )

    return promise;

  }
