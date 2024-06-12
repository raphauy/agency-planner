"use client"

import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function PublicationTypeFilter() {

    const [post, setPost] = useState(true)
    const [reel, setReel] = useState(true)
    const [story, setStory] = useState(true)

    const router = useRouter()

    useEffect(() => {
        let filter= ""
        if (post) filter+= "P"
        if (reel) filter+= "R"
        if (story) filter+= "S"

        router.push(`?filter=${filter}`)

    }, [post, reel, story, router])
    

    return (
        <div className="flex items-center gap-3 lg:gap-5 font-bold">
            <div className="flex items-center gap-1 md:w-40">
                Posts <Switch checked={post} onCheckedChange={(e) => setPost(!post)} />
            </div>

            <div className="flex items-center gap-1 md:w-40">
                Reels <Switch checked={reel} onCheckedChange={(e) => setReel(!reel)} />
            </div>

            <div className="flex items-center gap-1 md:w-40">
                Historias <Switch checked={story} onCheckedChange={(e) => setStory(!story)} />
            </div>
        </div>
    )
}
