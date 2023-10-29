"use server";


export default async function hitUrl(url:string) {
    console.log(url);
    const response = await fetch(url).then((res) => {
       console.log(res);
    });
}