import { RepositoryDAO } from "@/services/repository-services"
import { RepoCard } from "./repo-card"

type Props= {
  repositories: RepositoryDAO[]
  basePath: string
}
export default function RepoGrid({ repositories, basePath }: Props) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full mt-4">
      {
        repositories.map(repository => (
          <RepoCard key={repository.id} repository={repository} basePath={basePath} />
        ))
      }
    </div>
  )
}
