import {ChuckNorrisApiClient, Joke} from "./ChuckNorrisApi";
import {setupServer} from "msw/node";
import {rest} from "msw";

describe("ChuckNorrisApiClient", () => {
    const apiServer = setupServer()
    const apiClient = new ChuckNorrisApiClient("http://localhost:5000")

    beforeAll(() => apiServer.listen())
    afterEach(() => apiServer.resetHandlers())
    afterAll(() => apiServer.close())

    describe("fetch random joke", () => {

        it("returns a joke after a successful GET request", async () => {
            givenRandomJokesApiResponds({
                icon_url: "https://assets.chucknorris.host/img/avatar/chuck-norris.png",
                id: "AqhhPBSNQ_KyFTWLm12a2g",
                url: "",
                value: "How many push-ups can Chuck Norris do? All of them."
            })
            await thenRandomJokeResolves({ value: "How many push-ups can Chuck Norris do? All of them." })
        })

        it("throws an error after a failed GET request", async () => {
            givenRandomJokesApiFails();
            await thenRandomJokeRejectsAndThrows();
        })
    })

    const givenRandomJokesApiResponds = (response: any) => {
        apiServer.use(rest.get("http://localhost:5000/jokes/random", (req, resp, ctx) => {
            return resp(ctx.json(response))
        }))
    }

    const givenRandomJokesApiFails = () => {
        apiServer.use(rest.get("http://localhost:5000/jokes/random", (req, resp, ctx) => {
            return resp(ctx.status(503, "Service Unavailable"))
        }))
    }

    const thenRandomJokeResolves = async (joke: Joke) => {
        await expect(apiClient.randomJoke()).resolves.toMatchObject(joke)
    }

    const thenRandomJokeRejectsAndThrows = async () => {
        await expect(apiClient.randomJoke()).rejects.toThrow("Unable to fetch a random joke")
    }
})
