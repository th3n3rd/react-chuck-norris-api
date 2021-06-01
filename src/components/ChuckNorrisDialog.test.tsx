import React from "react";
import {act, render, screen, waitFor} from "@testing-library/react";
import {ChuckNorrisDialog} from "./ChuckNorrisDialog";
import {ChuckNorrisApi, Joke} from "./ChuckNorrisApi";
import {mock, MockProxy} from "jest-mock-extended";
import {ChuckNorrisApiProvider} from "./ChuckNorrisApiContext";
import userEvent from "@testing-library/user-event";

describe("ChuckNorrisDialog", () => {

    let apiClient: MockProxy<ChuckNorrisApi>

    beforeEach(async () => {
        apiClient = mock<ChuckNorrisApi>()
    })

    describe("when mounted", () => {
        beforeEach(async () => {
            givenRandomJokesApiResolves({ value: "Chuck Norris doesn't read books. He stares them down until he gets the information he wants." })
            await renderComponent()
        })

        it("fetches a random joke from the api", async () => {
            await thenRandomJokesApiIsInvoked(1)
        })

        it("displays a joke", async () => {
            await thenJokeIsDisplayed("Chuck Norris doesn't read books. He stares them down until he gets the information he wants.")
        })

        it("renders a next button", async () => {
            await thenNextButtonExist()
        })
    })

    describe("when the next button is clicked", () => {
        beforeEach(async () => {
            givenRandomJokesApiResolves({ value: "Chuck Norris doesn't read books. He stares them down until he gets the information he wants." })
            givenRandomJokesApiResolves({ value: "How many push-ups can Chuck Norris do? All of them." })
            await renderComponent();
            await clickNextButton();
        })

        it("fetches the next random joke from the api", async () => {
            await thenRandomJokesApiIsInvoked(2)
        })

        it("displays the received joke by replacing the previous one", async () => {
            await thenJokeIsDisplayed("How many push-ups can Chuck Norris do? All of them.")
            await thenJokeIsNotDisplayed("Chuck Norris doesn't read books. He stares them down until he gets the information he wants.")
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

    const nextButton = async () => {
        return screen.findByRole("button", { name: "Next" } )
    }

    const clickNextButton = async () => {
        await act(async () => {
            userEvent.click(await nextButton());
        })
    }

    const thenNextButtonExist = async () => {
        expect(await nextButton()).toBeInTheDocument();
    }

    const thenJokeIsDisplayed = async (joke: string) => {
        expect(await screen.findByText(joke)).toBeInTheDocument();
    }

    const thenJokeIsNotDisplayed = async (joke: string) => {
        expect(screen.queryByText(joke)).not.toBeInTheDocument()
    }

    const thenRandomJokesApiIsInvoked = async (times: number) => {
        await waitFor(() => expect(apiClient.randomJoke).toHaveBeenCalledTimes(times))
    }
})
