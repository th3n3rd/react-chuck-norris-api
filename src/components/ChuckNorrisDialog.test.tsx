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

    describe("when the random joke api fails", () => {
        beforeEach(async () => {
            givenRandomJokesApiRejects(new Error("Something went wrong"))
            await renderComponent();
        })

        it("displays an error", async () => {
            await thenErrorIsDisplayed("Chuck Norris broke this page");
        })

        it("replaces the next button with a retry button", async () => {
            thenNextButtonDoesNotExist();
            await thenRetryButtonExist();
        })

        describe("when the retry button is clicked", () => {
            beforeEach(async () => {
                givenRandomJokesApiResolves({ value: "Chuck Norris can make Jenny leave the Block."})
                await clickRetryButton();
            })

            it("retries to fetch the next random joke from the api", async () => {
                await thenRandomJokesApiIsInvoked(2)
            })

            it("displays the received joke by replacing the previous error", async () => {
                await thenNoErrorIsDisplayed();
                await thenJokeIsDisplayed("Chuck Norris can make Jenny leave the Block.")
            })

            it("restores the next button in place of the retry button", async () => {
                await thenNextButtonExist();
                await thenRetryButtonDoesNotExist();
            })
        })
    })

    const givenRandomJokesApiResolves = (joke: Joke) => {
        apiClient.randomJoke.mockResolvedValueOnce(joke)
    }

    const givenRandomJokesApiRejects = (error: Error) => {
        apiClient.randomJoke.mockRejectedValueOnce(error);
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

    const nextButtonOrNothing = () => {
        return screen.queryByRole("button", { name: "Next" } )
    }

    const clickNextButton = async () => {
        await act(async () => {
            userEvent.click(await nextButton());
        })
    }

    const retryButton = async () => {
        return screen.findByRole("button", { name: "Retry" } )
    }

    const retryButtonOrNothing = () => {
        return screen.queryByRole("button", { name: "Retry" } )
    }

    const clickRetryButton = async () => {
        await act(async () => {
            userEvent.click(await retryButton());
        })
    }

    const thenNextButtonExist = async () => {
        expect(await nextButton()).toBeInTheDocument();
    }

    const thenNextButtonDoesNotExist = () => {
        expect(nextButtonOrNothing()).not.toBeInTheDocument();
    }

    const thenRetryButtonExist = async () => {
        expect(await retryButton()).toBeInTheDocument();
    }

    const thenRetryButtonDoesNotExist = () => {
        expect(retryButtonOrNothing()).not.toBeInTheDocument();
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

    const thenErrorIsDisplayed = async (message: string) => {
        await waitFor(() => expect(screen.queryByRole("alert")).toHaveTextContent(message))
    }

    const thenNoErrorIsDisplayed = async () => {
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    }
})
