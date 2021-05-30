import React from "react";
import {act, render, screen} from "@testing-library/react";
import {ChuckNorrisDialog} from "./ChuckNorrisDialog";
import {ChuckNorrisApi, Joke} from "./ChuckNorrisApi";
import {mock, MockProxy} from "jest-mock-extended";
import {ChuckNorrisApiProvider} from "./ChuckNorrisApiContext";

describe("ChuckNorrisDialog", () => {

    let apiClient: MockProxy<ChuckNorrisApi>

    beforeEach(async () => {
        apiClient = mock<ChuckNorrisApi>()
    })

    describe("when mounted", () => {
        beforeEach(() => {
            givenRandomJokesApiResolves({ value: "Chuck Norris doesn't read books. He stares them down until he gets the information he wants." })
            renderComponent()
        })

        it("fetches a random joke from the api", () => {
            thenRandomJokesApiIsInvoked(1)
        })

        it("displays a joke", async () => {
            await thenJokeIsDisplayed("Chuck Norris doesn't read books. He stares them down until he gets the information he wants.")
        })
    })

    const givenRandomJokesApiResolves = (joke: Joke) => {
        apiClient.randomJoke.mockResolvedValueOnce(joke)
    }

    const renderComponent = async () => {
        await act(async () => {
            render(
                <ChuckNorrisApiProvider apiClient={apiClient}>
                    <ChuckNorrisDialog/>
                </ChuckNorrisApiProvider>
            )
        })
    }

    const thenJokeIsDisplayed = async (joke: string) => {
        expect(await screen.findByText(joke)).toBeInTheDocument();
    }

    const thenRandomJokesApiIsInvoked = (times: number) => {
        expect(apiClient.randomJoke).toHaveBeenCalledTimes(times)
    }
})
