import React from "react";
import {render, screen} from "@testing-library/react";
import {ChuckNorrisDialog} from "./ChuckNorrisDialog";

describe("ChuckNorrisDialog", () => {

    describe("when mounted", () => {
        it("displays a joke", async () => {
            renderComponent();
            await thenJokeIsDisplayed("Chuck Norris doesn't read books. He stares them down until he gets the information he wants.")
        })
    })

    const renderComponent = () => {
        render(<ChuckNorrisDialog/>)
    }

    const thenJokeIsDisplayed = async (joke: string) => {
        expect(await screen.findByText(joke)).toBeInTheDocument();
    }
})
