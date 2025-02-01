type Props = {
    title: string
}

export function EnDesarrollo({ title }: Props) {

    return (
      <div className="flex flex-col items-center justify-center h-40 mt-10 border-dashed border rounded-lg p-4 bg-background">
        <p className="text-2xl font-bold">{title}</p>
        <p className="text-muted-foreground">En desarrollo</p>
      </div>
    )
  }
  
  