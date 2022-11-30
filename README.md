# Viz App

A single page application that visualizes climate data taken from [Kaggle](https://www.kaggle.com/datasets/sumanthvrao/daily-climate-time-series-data). This data set includes daily measurements for mean temperature, humidity, wind speed, and mean presure. The data set was lightly modifiied to remove extreme values, to allow the scale of the visualizations to be more visually presentable.

This is a front-end only application. As this application was purposely designed without any connection to backend services or infrastructure, network calls are simulated only, indicated with a loading spinner. All data is loaded from imported modules and all storage is in-memory only using Redux.

The user can create visualizations of these types: line graph, scatter plot, simple table. Each visualization is put into a cell which is a movable and resizabe panel with a few buttons. The user may create and delete cells.

A working example is deployed and available publicly here: https://tcl735.github.io/viz-app/

## Major dependencies/packages

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and the TypeScript template.

[Clockface](https://github.com/influxdata/clockface). The theme, styling and almost all of the individual components such as buttons, dropdowns, panels, overlays, toggles, and icons come from this open source presentational component library.

[Giraffe](https://github.com/influxdata/giraffe). The visualizations including line graph, scatter plot, and simple table. And the utilities to perform the transformation of plain CSV from Kaggle into [Flux Annotated CSV](https://docs.influxdata.com/influxdb/cloud/reference/syntax/annotated-csv/). Giraffe and Flux are open source libraries.

## Features

- Create visualizations with the "+ ADD VISUALIZATION" button.

  - Each visualiation is put into a cell which is a resizable and movable panel with a name, a few buttons, and the visualization.
  - Naming the cell is optional but the name is set only once and cannot be changed even for blank names. Max 20 characters long.
  - Choosing a visualization type is required. The choices are: line graph, scatter plot, and simple table.
  - Choosing a date range is optional and defaults to the entire data set. This selection can be changed again as many times as deisred.

- Delete a cell with the trash can button. Confirmation is asked.

- Move a panel by click+hold with the mouse on any part of the cell that is not part of the visualization, and then dragging and dropping.

- Resize a panel with click+drag on the resizer handle in the bottom-right of any cell.

- Change the date range for the visualization in a cell by selecting from a dropdown menu.

- **Adaptive Zoom feature**. Drill down on a visualization by fetching (aka re-querying) for data using mouse click-drag movements. (_Fetching is simulated as mentioned above._)

  - Applies to only line graph and scatter plot, and only works on the x-axis (time axis).
  - To understand this feature, first a brief explanation on the zoom-in and zoom-out features from [Giraffe](https://github.com/influxdata/giraffe):

    - Zooming-in on the visualization:

      - Hover over the area bounded by the horizontal and vertical axes and the top and far right grid lines.
      - Inside this area, click+hold the mouse button, then slide the mouse horizontally or vertically. Then release the mouse button.
      - During the drag, a shaded region will appear. This shaded region can be resized until the mouse button is released.
      - The visualization will re-render using the new limits for the two axes determined by the shaded region.
      - Zooming is progressive; additional zoom-ins will narrow the scope of the rendering.

    - Zooming-out or unzooming the visualization:
      - Double-click over any part of a line graph or scatter plot.
      - Resets the rendering of the visualization back to its first render with the selected date range.

  - **Added by Viz App**:
    - After zooming-in, instead of using fewer data points, the cell will fetch (aka re-query) again for data to give more details for the zoomed-in render.
    - The data fetching is simulated, as mentioned above. A loading spinner will appear to simulate a random short delay.
    - Compare the differences. For best results, create 2 different cells, one with the feature toggled on and one with the feature toggled off.
    - **_NOTE_**: I am the original author of the implementation for the Adaptive Zoom feature found in InfluxDB's UI. I added a similar feature here for Viz App.

## Review: Challenges and Considerations

Given the limit amount of time spent on this application, there were tradeoffs, shortcuts, and design decisions that were considered. Here is recap of what I thought went well, what could have been better, and what could be added in the future.

### What went well

The best way to bootstrap a React app is [create-react-app](https://github.com/facebook/create-react-app) as this tool gives you a skeleton in a template that you can pick, and I went this route using a TypeScript template. A big advantage is the pre-configured scripts and environment tooling. Adding a deployment script to deploy to Github Pages was also a breeze.

Additionally, using both a component library and a visualization library as dependencies allowed me to focus on the higher level design of the whole app. I didn't have to worry about the nitty-gritty of making basic components or the overall theme and styling of the app. And most importanntly, I didn't need to make my own visualizations from scratch, which would have required an enormous effort.

So, right off the bat, I am working with an app that will remain consistent in theme, styling, basic components, and its biggest feature (visualizations). The app scales consistently, in this sense. As it grows in sophistication, I would not have to worry about additional styling, or additional basic components, or even the visualizations depending on what the app is trying to achieve.

Using Redux also makes state management consistent and straightforward. Specifically, I want to mention the use of [immer](https://www.npmjs.com/package/immer). This dependency allows the reducers to be written more succintly and clearly. Instead of carefully and tediously crafting our own new state object with the desired changed properties, immer gives a "draft" state object that we can reference directly and manipulate. Gone are a lot of long-winded spread operations and object destructuring.

### What could have been better

- Using dependencies for major parts of the app are both good (as discussed above) and bad.

  - One bad part is being exposed to any bugs or intentional deficiencies with the library you are working with. Clockface, for example, stil has an issue with mobile breakpoints. If the entire browser window is resized too small, then the cells (or panels) disappear and are not visible, even though they are obviously still in state. This has to with Clockface's styling for the height of the page contents based on the window size. It was an unfortunate bug that probably has a workaround but I did not priortize fixing for this exercise.

  - Another bad part is being tied to the interfaces of the dependency. For the most part, interfaces are just function arguments or object properties that go into one big object as a function argument. However, in some cases, a higher order interface is required and using a dependency with a higher order interface will require that you spend time ensuring the interface connects to your app. Giraffe, for example, uses [Flux](https://www.influxdata.com/products/flux/) as the data interface. This means that whatever data set you are trying to visualize with Giraffe must be transformed in one of few different ways. One of them is [Flux's Annotated CSV](https://docs.influxdata.com/influxdb/cloud/reference/syntax/annotated-csv/). While similar to generic CSV (comma separated values; usually with just a single header line), Flux's Annotated CSV has a more detailed header, with multiple required lines and fields. Giraffe unfortunately, does not provide any utility or tool to transform plain CSV to Flux Annotated CSV.

  - Flux itself can do this, and could have been another dependency added just for the data transformation. However, adding Flux would have increased the development time dramatically. The tradeoff here was writing my own data transformation quickly rather than trying to add a sophisticated tool for a single data set.

- Cell design. The header of the Cell component is problematic when a cell is small. Due to the 3 buttons on the right side of the header, a certain amount of width is required to keep these buttons contained and not overflowing the borders. As a temporary workaround to this problem, I used applied a minimum width to cells using react-grid-layout's `minW` option. I also added `minH` to enforce height but there wasn't a similar issue vertically. Ideally, a better design would be to collapse all buttons and interactive elements into a single wheel or gear that the user would click to reveal the buttons and interactive elements. This minimalist approach let's the user focus on the visualizations and also handles the minimum width problem more gracefully.

- Testing. I made the choice not to add testing in the limited amount of time expected for this exercise. Since this was a simple app, end-to-end tests would have been overkill here. Unit tests could have been helpful. There are a handful of utilities in this app involving CSV transformation to Flux Annotated CSV. Working with just 1 static data set, however, lowered the priority for unit tests. Originally, I had planned on adding the unit tests. But instead I ended up focusing on polishing other parts of the application over adding unit tests for utilities that were very specific to a data set.

- Generic utilities. Related to the above point, utilities should be written as generically as possible so that they can serve a larger set of inputs. The narrower or more specific the input has to be for a utility, the less "utility" it has. So, this was something I could have done better with the CSV mapping utilities.

- Testing, again. I want to emphasize testing is a critically important for commercial-grade production code. For the front-end, testing should involve both end-to-end tests and narrow unit tests.
  - For end-to-end tests I would use [Cypress](https://docs.cypress.io/guides/overview/why-cypress). There is active support for Cypress, detailed docs with good examples, and a full set of features and API.
  - [Playwright](https://playwright.dev/docs/intro) is another good choice.
  - [Jest](https://jestjs.io/docs/getting-started) is a good tool for unit tests and would be my choice.

### What could be added in the future

- As mentoned above in 'What could have been better', we skipped on adding Flux as dependency. To properly scale this app to render from any data source using generic CSV, it is worthwhile to add Flux into the project to take advantage of the Flux language's standard library. Especially if the app would be a full fledged time-series visualziation tool, Flux would be advantageous as a dependency.

- Data sources. Primarily, the app should be connected to one or more databases. There would be a service layer around the databases to serve the front-end's requests to create, updated, or delete (CRUD) the data.

- Additional applications. Instead of just viewing the data, there could be additional actions around the data, such as alerting, logging, or predictive analysis.

- Vertical scaling. Instead of a single page with cells (panels), a user could create a new page to hold cells for a specific purpose. In other words, a "dashboard" holds the cells. And the user could also create multiple dashboards. All of this would be persisted with a backend api and storage. Further, a user could create additional "profiles" that hold the dashboards for a specific purpose. Profiles would be something like an organization. An organization would usually be like a company, or for a divider between home, work, and hobbies for example.

## Building and Running

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm deploy`

Deploys the latest commit in `main` to Github Pages. Note: only the original author and collaborators should have access to this.

### `npm test`

Launches the test runner in the interactive watch mode. Currently, all tests are disabled because none were added. Re-enable the test suites once new tests are added.
