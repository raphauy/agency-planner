import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { camelCaseToNormal, putTildes } from "@/lib/utils";

type Props = {
    repoName: string
    jsonData: Record<string, any>
}

export default function DataCard({ repoName, jsonData }: Props) {
    const keys= Object.keys(jsonData)
    return (
        <Card>
            <CardHeader>
                <CardTitle>{repoName}</CardTitle>
            </CardHeader>

            <CardContent>
                <div className="">
                    {
                        keys.map((key, i) => {
                            let value = jsonData[key];
                            // log value type
                            const normalKey = camelCaseToNormal(key);
                            const type = typeof value
                            if (type === "object") {
                                value = value.join(", ")
                            }
                            const keyWithTildes = putTildes(normalKey);
                            return (
                                <div key={i} className="grid grid-cols-2">
                                    <p className="whitespace-nowrap font-bold">{keyWithTildes}:</p>
                                    <p className="">{value}</p>
                                </div>
                            );
                        })
                    }
                </div>
            </CardContent>
        </Card>
    );
}

