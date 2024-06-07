import { redirect } from "next/navigation"

export default function InstagramPage() {

    redirect("instagram/posts")

    return (
        <div>InstagramPage</div>
    )
}
