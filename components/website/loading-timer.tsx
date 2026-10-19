"use client"
import { useEffect, useState } from "react"
export function LoadingTimer({loading,label}:{loading:boolean;label:string}){
 const [elapsed,setElapsed]=useState(0)
 useEffect(()=>{if(!loading)return;const start=performance.now();setElapsed(0);const tick=()=>setElapsed(performance.now()-start);const timer=window.setInterval(tick,100);return()=>{window.clearInterval(timer);setElapsed(performance.now()-start)}},[loading])
 return <p className="mb-3 rounded-lg border border-[#C5A15A]/35 px-3 py-2 text-xs text-[#766B67]">Temporary timing · {label}: {(elapsed/1000).toFixed(1)} s · {loading?"Loading…":"Finished (success or error)"}</p>
}
