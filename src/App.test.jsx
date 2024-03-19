import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, it as test, expect} from 'vitest';

import App from './App';

describe("App component", ()=>{

    test("Renders 'magnificient monkeys'", ()=>{
        //Since screen does not have a container property, we can destructure 'render()' to get a container for the tester
        const {container} = render(<App />);
        expect(container).toMatchSnapshot(); //Refer to the snapshot in the 'snapshot' folder
    })

    test("Renders 'radical rhinos' after button click", ()=>{
        async () => {
            const user = userEvent.setup();

                render(<App />);
                //Instead of destructuing, use 'screen' instead.
                
                screen.debug();

                const button = screen.getByRole("button", {name: "Click me"});

                await user.click(button);

                expect(screen.getByRole("heading").textContent).toMatch(/Radical Rhinos/i);
        }

    })

})