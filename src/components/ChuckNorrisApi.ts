export interface ChuckNorrisApi {
    randomJoke: () => Promise<Joke>
}

export interface Joke {
    value: string
}

export class ChuckNorrisApiClient implements ChuckNorrisApi {
    readonly baseUrl: string

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
    }

    async randomJoke() : Promise<Joke> {
        const response = await fetch(`${this.baseUrl}/jokes/random`)
        if (!response.ok) {
            throw new Error("Unable to fetch a random joke")
        }
        return await response.json() as Joke
    }
}
