import bs58 from "bs58"

export function base32Encode(input: string): string {
  return bs58.encode(Buffer.from(input))
}

export function base32Decode(input: string): string {
  return Buffer.from(bs58.decode(input)).toString("utf8");
}



export const getSkinsById = (skins:any,id:string)=>
{
    for(let i of skins)
    {
        if(i.skin?.toLocaleLowerCase() == id.toLocaleLowerCase())
        {
            return i;
        }
    }
    return false;
}
export const getSkinsNameById = (skins:any,id:string)=>
{
    for(let i of skins)
    {
        if(i.id?.toLocaleLowerCase() == id.toLocaleLowerCase())
        {
            return i;
        }
    }
    return false;
}
export const getMarketsByName = (markets:any,id:string)=>
{
  // console.log(markets)
    for(let i of markets)
    {
        if(i.name?.toLocaleLowerCase() == id.toLocaleLowerCase())
        {
            return i;
        }
    }
    return false;
}

export const getTimeDiffText = (time: string | number) => {
  const last = new Date(time).getTime();
  const now = Date.now();
  const diff = Math.floor((now - last) / 1000);

  if (diff < 60) return `${diff} 秒前`;
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`;
  return `${Math.floor(diff / 86400)} 天前`;
};