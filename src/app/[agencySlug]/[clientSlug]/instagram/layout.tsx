
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-full w-full max-w-[1350px] flex flex-col items-center">
            {children}
        </div>
    )
}
