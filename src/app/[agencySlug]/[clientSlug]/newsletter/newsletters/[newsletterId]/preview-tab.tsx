import ContentViewer from "@/app/d/[docId]/content-viewer";
import { NewsletterDAO } from "@/services/newsletter-services";
import Image from "next/image";

type Props = {
    newsletter: NewsletterDAO
}
export default function PreviewTab({ newsletter }: Props) {
    return (
        <div className="flex flex-col items-center p-1 md:p-4 xl:p-8">

            <p className="mb-4 text-3xl font-bold">{newsletter.subject}</p>

            <Image className="rounded-t-lg" src={`${newsletter?.banner || "/newsletter_placeholder.svg"}`} width={1200} height={400} alt="Banner" />

            <ContentViewer content={JSON.parse(newsletter.contentJson!)} className="w-full h-full border-r border-l p-4 bg-background"/>

            <div className="w-full p-4 bg-background rounded-b-lg border-r border-l border-b">
                <div className="mx-3">
                    <p className="mb-5 whitespace-pre-line">{newsletter.footerText}</p>
                    <a href={newsletter.footerLinkHref} target="_blank" className="text-blue-500">{newsletter.footerLinkText}</a>
                </div>
            </div>

        </div>
    )

}