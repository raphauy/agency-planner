import { redirect } from "next/navigation"

export default function InstagramPage() {

    redirect("instagram/feed")

    return (
        <div>InstagramPage</div>
    )
}
